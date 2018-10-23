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
            message: "\nHello SuperVisor, please make your choice\n",
            choices:["View sales by department", "Create a new department"],
            name: "managerChoice"
        }
    ]).then(function(response){
        let option = response.managerChoice
        console.log("\nThe Manager Choose: "+ option)
        
        switch (option){
            case "View sales by department":
                console.log("\nView sales by department");
                ViewSales();
                break;
            case "Create a new department":
                console.log("\nCreate a new department");
                newDept();
                break;
            default:
                console.log("Something has gone terrible wrong")
        }
    })
}

//More functions
function promptUser(){
    inquirer.prompt({
        type: "list",
        message: "\nWould you like to take any other actions?",
        name: "reset",
        choices: ["Yes","No"]
    }).then(function(response){
        if(response.reset == "Yes"){
            SuperVisorChoice();
        }else{
            connection.end();
        }
    })
}

function ViewSales(){
    connection.query("SELECT departments.department_id AS ID, departments.department_name AS Department, departments.over_head_cost AS OverHead, SUM(product_sales) AS Total_Sales, (SUM(product_sales) - departments.over_head_cost ) AS Total_Profit FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY Department"
    , function(err,res){
        if(err) throw err;       
        console.table(res);
        promptUser();
    });
}

function newDept(){
    inquirer.prompt([
        {
        type: "input",
        message: "\nWhat is the name of the department you would like to add?",
        name: "newDept"
        },
        {
        type: "input",
        message: "\nWhat is the over head cost of this department?",
        name: "newOverHeadCost"
        }
    ]).then(function(supAnswers){
        let newDeptName = supAnswers.newDept;
        let newDeptOverHead = supAnswers.newOverHeadCost;
       


        connection.query("INSERT INTO departments SET ?",        
            { 
            department_name: newDeptName,
            over_head_cost: newDeptOverHead
            }, 
            function(err,res){
                if(err) throw err;
                console.log(res);

                console.log("\n"+newDeptName + "has been added with an overhead cost of $"+ newDeptOverHead)
                }

            )
        promptUser();

        }
            
    )};
