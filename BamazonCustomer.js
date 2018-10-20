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
            )
        }
    })
  }

  function userChoice(){    
      inquirer.prompt([
          {
        type: "input",
        message: "Pick the Items ID you would like to purchase",
        name: "itemID"
          },
          {
        type: "input",
        message: "How many would you like to buy?",
        name: "quantityItem"
          }
      ]).then(function(response){
        console.log(response.itemID, response.quantityItem)
        if(response.quantityItem<stuff.stock_quantity){
            console.log("We have enough for you to purchase")

        }else
        {
            console.log("We do not have enough for your purchase.")
        }


      })



  }
  Products();
  userChoice();
  connection.end();