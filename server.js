// DEPENDENCIES
const mysql = require('mysql');
const inquirer = require('inquirer'); 

//MYSQL 

const connection = mysql.createConnection({
    host: 'localhost', 
   
    port: 3306,
     
    user: 'root',

    password: '',
  
    database: 'companyDB',
  });

//QUERIES
// View
const view = require('./queries/view.js');
// Add
const add = require('./queries/add.js');
// Update
const update = require('./queries/update.js');

  //ON START

 connection.connect((err) => {
     if (err) throw err;
     start();
 });

 const start = () => {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees by Department",
                "View All Employees by Manager",
                "Add Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "Remove Employee",
                "View All Roles",
                "Add Role",
                "Remove Role", 
                "View All Departments",
                "Add Department",
                "Remove Department",
                "EXIT"
            ]
        })
        switch (response.choices) {
            case "View All Employees":
                await viewAllEmployees();
                break;
            case "View All Employees by Department":
                await viewDepartments();
                break;
            case "View All Employees by Manager":
                await viewManagers();
                break;
            case "Add Department":
                    await addDepartment();
                    break;
            case "Add Employee":
                    await addEmployee();
                    break;
            case "Add Role":
                await addRole();
                break;
            case "Remove Role":
                await removeRole();
                break;
            case "Remove Department":
                    await removeDepartment();
                    break;
            case "Remove Employee":
                        await removeEmployee();
                        break;
            case "Update Employee Role":
                await updateEmployeeRole();
                break;
            case "Update Employee Manager":
                await updateEmployeeManager();
                break;
            case "View Department Budget":
                await getBudget();
                break;
            case "Exit":
                connection.end();
                break;
            default:
                console.log("Please select a valid option")
                break;
        }

 };




