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
    ManagerChoice();
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
                    Products();
                    break;
                case "View low inventory":
                    LowInventory();
                    break;
                case "Add to inventory":
                    AddInventory()
                    break;
                case "Add new products":
                    NewProducts();
                    break;
                default:
                    console.log("something has gone terrible wrong.")
            }
     
        }) 
}


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
        promptUser();
    })
  }

  // Low Inventoty function
function LowInventory(){
        connection.query("SELECT * from products WHERE stock_quantity<5", function(err, res){
            if(err) throw err;
            
            if (res.length == 0){
                console.log("\nThere is no low inventory at this time\n");
            }
            else{
                for(let i in res){
                    console.log("This product is low: " + res[i].product_name);
                        }
            }
            promptUser();
        })
  }

  //Add to Inventory function
function AddInventory(){
       
        //Show Current Available Inventory
        Products();

        GetInventory(function(results){
            inquirer.prompt([
                {
                type: "list",
                message: "\nWhat items stock would you like to increasing?",
                name: "stockingPromptName",
                choices: results.map(money => money.product_name)
                },
                {
                type: "input",
                message: "\nHow much inventory will you be adding?",
                name: "stockingInventory"
                }
            ]).then(function(response){
                //Get the Item where 
                let item = results.find(item => item.product_name === response.stockingPromptName)
                console.log("Item is " + item);
                console.log("itemID is " + item.id);
                console.log("item quantity is : " + item.stock_quantity)
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
                //Show available products with added inventory
                Products();
                //prompt the user whether he wants to continue
                promptUser();
            })
    })
    }


// Creat New Products Function

function NewProducts(){
    inquirer.prompt([
        {
            type: "input",
            message: "\nWhat Item would you like to add to the database?",
            name: "newItemName"
        },
        {
            type: "input",
            message: "\nWhat quantity would you like to add?",
            name: "newItemQuant"
        },
        {
            type: "input",
            message: "\nWhat department does this item go in?",
            name: "newItemDept"
        },
        {
            type: "input",
            message: "\nWhat is the list price of this item?",
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
            promptUser();
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

//prompt function
function promptUser(){
    inquirer.prompt({
        type: "list",
        message: "\nWould you like to take any other actions?",
        name: "reset",
        choices: ["Yes","No"]
    }).then(function(response){
        if(response.reset == "Yes"){
           ManagerChoice();
        }else{
            connection.end();
        }
    })
}