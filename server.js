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

//ON START

 connection.connect((err) => {
     if (err) throw err;
     start();
 });

 //  --------- START --------- //

const start = () => {
    inquirer
      .prompt([
        {
          type: "list",
          message: "What would you like to do? ",
          choices: [
            "View all employees",          
            "View all employees by department",
            "View all employees by manager",
            "View Departments",
            "View Roles",
            "View Department Budget",
            "Update employee manager",
            "Add employee",
            "Add department",
            "Add role",
            "Remove employee",
            "Update employee role",
            "Update employee manager",
            "Exit",
          ],
          name: "choice",
        },
      ])
      .then((answer) => {      
        switch (answer.choice) {
          case 'View all employees':
            viewAllEmployees();
            break;
          case 'View all employees by department':
            viewAllEmployeesByDepartment();
            break;
          case 'View all employees by manager':
             viewAllEmployeesByManager();
             break;
          case 'View Departments':
            viewDepartments();
            break;
          case 'View Department Budget':
            getBudget();
            break;  
          case 'View Roles':
            viewRoles();
            break;
          case 'Add employee':
            addEmployee();
            break;
          case 'Add department':
            addDepartment();
            break;
          case 'Add role':
            addRole();
            break;
          case 'Remove employee':
            removeEmployee();
            break;
          case 'Update employee role':
            updateEmployeeRole();
            break;
          case 'Update employee manager':
            updateEmployeeManager();
            break;
          case 'Exit':
            connection.end();
            break;
          default:
            throw new Error('invalid initial user choice');
        }
      });
  };
 
//View Roles
  const viewRoles = () => {
    const query = `SELECT * FROM role`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
  }

//View Departments
  const viewDepartments = () => {
    const query = `SELECT * FROM department`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
  }
  

//// FUNCTION TO GET TOTAL BUDGET OF A DEPARTMENT
  const  getBudget = ()  => {
    connection.query('SELECT * FROM department', (err, departmentData) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "department_id",
                    type: "list",
                    message: "Which department's budget would you like to view?",
                    choices: departmentData.map(department => ({name:department.name,value:department.id})),
                }
            ])
        .then((answer) => {
        let query = "SELECT department.id, role.salary AS Salary, department.name AS Department FROM companyDB.department";
        connection.query(query, answer.department_id, (err, finalData) => {
            if (err) throw err;
            finalData.forEach((employee) => {
                budget += employee.Salary
            })
            console.log("The budget for this department is $" + budget)
        });
    });
});
  }
