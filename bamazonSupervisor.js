var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");
// var table = new Table({
//     head: ['DepartMent ID', 'DepartMent Name', 'Over Head Cost', 'Total Sales', 'Profit']
//   , colWidths: [20, 20, 20, 20, 20]
// });

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
    SuperVisorChoice();
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
            case "View sales by department":
                console.log("View sales by department");
                ViewSales();
                break;
            case "Create a new department":
                console.log("Create a new department");
                break;
            default:
                console.log("Something has gone terrible wrong")
        }
    })
}

//More functions

function ViewSales(){
    connection.query("SELECT departments.department_id AS ID, products.department_name AS Department, departments.over_head_cost AS OverHead, SUM(product_sales) AS Total_Sales, (SUM(product_sales) - departments.over_head_cost ) AS Total_Profit FROM departments JOIN products ON departments.department_name = products.department_name GROUP BY Department", function(err,res){
        if(err) throw err;
        
        console.table(res);
    });
}

function newDept(){
    inquirerPrompt([
        {
        type: "input",
        message: "What is the name of the department you would like to add?",
        name: "newDept"
        },
        {
        type: "input",
        message: "What is the over head cost of this department?",
        name: "newOverHeadCost"
        }
    ]).then(function(supAnswers){
        let newDeptName = supAnswers.newDept;
        let newDeptOverHead = supAnswers.newDeptOverHead;






    })

};

