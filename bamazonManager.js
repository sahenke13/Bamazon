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
                    break;
                case "Add new products":
                    console.log("Add new products");
                default:
                    console.log("something has gone terrible wrong.")
            }
          
        }) 
}
ManagerChoice();


//lets make some fun functions
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
        inquirer.prompt([
        {
        type: "input",
        message: "What items stock would you like to increase"




        }
    ])



}
