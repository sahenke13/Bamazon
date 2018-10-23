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
    userChoice();
  });

  function Products(){
    connection.query("SELECT * from products", function(err, res){
        if(err) throw err;
        console.log("\nThese are the items Bamazon has for sale\n");
        for (let i in res){
            let stuff = res[i];

            console.log(
                "id: ", stuff.id,
                "Name: ",stuff.product_name,
                "Prices: $",stuff.price, 
                "Quantity: ", stuff.stock_quantity,
            )
        }

    })
  }

  function userChoice(){    
      inquirer.prompt([
          {
        message: "\nInput the ID of the Items you would like to purchase",
        name: "itemID"
          },
          {
        message: "\nHow many would you like to buy?",
        name: "quantityItem"
          }
      ]).then(function(response){
            let itemID = response.itemID;
            let quantityItem = response.quantityItem;

        connection.query("SELECT stock_quantity, price, product_sales FROM products WHERE id="+ response.itemID, function(err, res){
            if (err) throw err;

            if(quantityItem <= res[0].stock_quantity){

                console.log("\nWe have enough for you to purchase\n");
                let cost =  (res[0].price) * (quantityItem);
                let productSales = cost + (res[0].product_sales)
                console.log("\nThe order total will be: $"+ cost);
                let newquantityItem = res[0].stock_quantity - quantityItem;
        connection.query("UPDATE products SET ? WHERE ?", 
                [{product_sales: productSales},
                {id: itemID}],
                function(err){
                    if(err) throw err;
                })
                
        connection.query("UPDATE products SET ? WHERE ?", 
            [{stock_quantity: newquantityItem},
            {id: itemID}],
        function(err){
            if(err) throw err;
            Products();
            promptUser()
        })

            }
            else
            {
                console.log(res[0].stock_quantity);
                console.log(res[0].price);
                console.log("We apologize, we currently do not have enough stock for your order. We do not have enough for your purchase");
                promptUser()
            }
            
        })
    
      })


  }
  Products();
  
//prompt function
function promptUser(){
    inquirer.prompt({
        type: "list",
        message: "\nWould you like to take any other actions?",
        name: "reset",
        choices: ["Yes","No"]
    }).then(function(response){
        if(response.reset == "Yes"){
           userChoice();
        }else{
            connection.end();
        }
    })
}