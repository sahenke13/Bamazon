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

function SuperVisorChoice(){
    inquirer.prompt([
        {
            type: "list",
            message: "Hello SuperVisor, please make your choice",
            choices:["View sales by department", "Create a new department"],
            name: "managerChoice"
        }
    ]).then(function(response){
        let option = response.managerChoice
        console.log("The Manager Choose: "+ option)
        
        switch (option){



        }


    })

}



SuperVisorChoice();