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
                "Prices: $",stuff.price, 
                "Quantity: ", stuff.stock_quantity,
                "Total Sales: $",stuff.product_sales
            )
        }

    })
  }

  function userChoice(){    
      inquirer.prompt([
          {
        message: "Input the ID of the Items you would like to purchase",
        name: "itemID"
          },
          {
        message: "How many would you like to buy?",
        name: "quantityItem"
          }
      ]).then(function(response){
            let itemID = response.itemID;
            let quantityItem = response.quantityItem;
            console.log(itemID);
            console.log(quantityItem)

        connection.query("SELECT stock_quantity, price, product_sales FROM products WHERE id="+ response.itemID, function(err, res){
            if (err) throw err;

            if(quantityItem <= res[0].stock_quantity){

                console.log("We have enough for you to purchase");
                let cost =  (res[0].price) * (quantityItem);
                let productSales = cost + (res[0].product_sales)
                console.log("The order total will be: $"+ cost);
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
            connection.end();
        })

            }
            else
            {
                console.log(res[0].stock_quantity);
                console.log(res[0].price);
                console.log("We apologize, we currently do not have enough stock for your order. We do not have enough for your purchase");
                connection.end();
            }
            
        })
    
      })


  }
  Products();
  userChoice();
