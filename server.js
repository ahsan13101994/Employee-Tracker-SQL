// DEPENDENCIES
const mysql = require('mysql');
const inquirer = require('inquirer'); 
require('dotenv').config();
//MYSQL 

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DB_PASS,
    // password:'Elephant12@',
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

 
function start() {
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
                "View Department Budget",
                "EXIT"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    view.viewAllEmployees(connection, start);
                    break;

                case "View All Employees by Department":
                    view.viewEmployeeDept(connection, start);
                    break;

                case "View All Employees by Manager":
                    view.viewEmployeeMgr(connection, start);
                    break;

                case "Add Employee":
                    add.addEmployee(connection, start);
                    break;

                case "Update Employee Role":
                    update.updateRole(connection, start);
                    break;

                case "Update Employee Manager":
                    update.updateManager(connection, start);
                    break;

                case "Remove Employee":
                    update.removeEmployee(connection, start);
                    break;

                case "View All Roles":
                    view.viewRoles(connection, start);
                    break;

                case "Add Role":
                    add.addRole(connection, start);
                    break;

                case "Remove Role":
                    update.removeRole(connection, start);
                    break;

                case "View All Departments":
                    view.viewDepartments(connection, start);
                    break;

                case "Add Department":
                    add.addDepartment(connection, start);
                    break;

                case "Remove Department":
                    update.removeDepartment(connection, start);
                    break;
                case "View Department Budget":
                        update.getBudget(connection, start);
                        break;

                case "EXIT":
                    connection.end();
                    break;
            }
        })

 };