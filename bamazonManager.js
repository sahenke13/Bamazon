var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});


connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
  
  });

function ManagerChoice(){
    inquirer.prompt([
        {
        type: "list",
        message: "Hello, Manager please make your choice",
        choices: ["Products for sale", "View low inventory", "Add to inventory", "Add new products"],
        name: "choice"
        }
        ]).then(function(response){

            let option = response.choice;

            switch(option){
                case "Products for sale": 
                    console.log("Products for sale");
                    Products();
                    break;
                case "View low inventory":
                    console.log("Low Inventory")
                    LowInventory();
                    break;
                case "Add to inventory":
                    console.log("Add to Inventory");
                    AddInventory()
                    break;
                case "Add new products":
                    console.log("Add new products");
                    NewProducts();
                    break;
                default:
                    console.log("something has gone terrible wrong.")
            }
          
        }) 
}
// run ManagerChoice function
ManagerChoice();



//lets make some functions
// List Products function
function Products(){
    connection.query("SELECT * from products", function(err, res){
        if(err) throw err;
        console.log("\nThese are the items Bamazon has for sale");
        for (let i in res){
            let stuff = res[i];

            console.log(
                "\nid: ", stuff.id,
                "Name: ",stuff.product_name,
                "Prices: ", stuff.price, 
                "Quantity: ", stuff.stock_quantity
            )
        }
    })
  }

  // Low Inventoty function
function LowInventory(){
        connection.query("SELECT * from products WHERE stock_quantity<5", function(err, res){
            if(err) throw err;
            for(let i in res){
            console.log("This product is low: " + res[i].product_name);
            }
        })
  }

  //Add to Inventory function
function AddInventory(){
        Products();
        GetInventory(function(results){
            inquirer.prompt([
                {
                type: "list",
                message: "What items stock would you like to increasing?",
                name: "stockingPromptName",
                choices: results.map(money => money.product_name)
                },
                {
                type: "input",
                message: "How much inventory will you be adding?",
                name: "stockingInventory"
                }
            ]).then(function(response){
           
                let itemID = results.find(item => item.product_name === response.stockingPromptName)
                console.log("Item is " + itemID);
                console.log("itemID is " + itemID.id);
                console.log("item quantity is : " + itemID.stock_quantity)
                let inventoryChoice = response.stockingPromptName;
                let inventoryQuantIncrease = response.stockingInventory;
                let newQuant = parseInt(itemID.stock_quantity) + parseInt(inventoryQuantIncrease);
                console.log("Inventory Choice to increase is: " + inventoryChoice);
                console.log("Quantity to Increase :" + inventoryQuantIncrease);
                
                connection.query("UPDATE products SET ? WHERE ?", 
                    [{stock_quantity: newQuant},
                    {id: itemID.id}],
                        function(err){
                            if(err) throw err;
                     })
                Products();
                connection.end();
            })
    })
    }


// Creat New Products Function

function NewProducts(){
    inquirer.prompt([
        {
            type: "input",
            message: "What Item would you like to add to the database?",
            name: "newItemName"
        },
        {
            type: "input",
            message: "What quantity would you like to add?",
            name: "newItemQuant"
        },
        {
            type: "input",
            message: "What department does this item go in?",
            name: "newItemDept"
        },
        {
            type: "input",
            message: "What is the list price of this item?",
            name: "newItemPrice"
        }
    ]).then(function(answers){
        let newName = answers.newItemName;
        let newQuant = answers.newItemQuant;
        let newDept = answers.newItemDept;
        let newPrice = answers.newItemPrice;


        connection.query("INSERT INTO products set ?",
        {
            product_name: newName,
            department_name: newDept,
            stock_quantity: newQuant,
            price: newPrice
        },
        function(err){
            if(err) throw err;
            Products();
        }
        )}
    )}

//Get Inventory function

function GetInventory(callback){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        callback(res);
    })
}