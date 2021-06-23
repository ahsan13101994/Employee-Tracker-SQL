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
            viewEmployeeDept();
            break;
          case 'View all employees by manager':
            viewEmployeeMgr();
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

//View All Employees
const viewAllEmployees = () => {  
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee as e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
  }

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

// View All Employees By Department
const viewEmployeeDept = () => {
    const query = `SELECT * FROM department`;
    connection.query(query, (err, results) => {
        if (err) throw err;
        inquirer
        .prompt([
            {
                name: "department",
                type: "list",
                choices: () => {
                    const choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].name);
                    }
                    return choiceArray;
                },
                message: "What department would you like to search by?"
            }
        ])
        .then((answer) => { 
            console.log(answer.department);
            const query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee as e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.name = ? ORDER BY employee.id';
            connection.query(query, answer.department, (err, results) => {
                if (err) throw err;
                console.table(results);
        start();
    })
})
    })
}

//View Employees by Manager
const viewEmployeeMgr = () => {
    connection.query("SELECT DISTINCT e2.first_name, e2.last_name FROM employee LEFT JOIN employee AS e2 ON employee.manager_id = e2.id WHERE e2.first_name IS NOT NULL", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "manager",
                    type: "list",
                    choices: () => {
                        const choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name);
                        }
                        return choiceArray;
                    },
                    message: "Which manager would you like to search by?"
                }
            ])
            .then((answer) => { 
                console.log(answer.manager);
                const query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee AS e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE e2.first_name = ? ORDER BY employee.id;'
                connection.query(query, answer.manager, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    start();
                })
            })
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
        let query = "SELECT department.id, department.name AS Department FROM companyDB.department";
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
