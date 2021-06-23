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
            "Update employee role",
            "Update employee manager",
            "Add employee",
            "Add department",
            "Add role",
            "Remove employee",
            "Remove role",
            "Remove department",
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
          case 'Remove role':
            removeRole();
            break;
          case 'Remove department':
            removeDepartment();
            break;
          case 'Update employee role':
            updateRole();
            break;
          case 'Update employee manager':
            updateManager();
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

//ADD NEW EMPLOYEE
const addEmployee = () => {
    const newEmployee = {};
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "first_name",
                    type: "input",
                    default: "Sohail",
                    message: "What is the employee's first name?",
                    validate: (answer) => {
                        if (answer.length < 1) {
                            return console.log("Please provide valid first name.");
                        }
                        return true;
                    }
                },
                {
                    name: "last_name",
                    type: "input",
                    default: "Shah",
                    message: "What is the employee's last name?",
                    validate: (answer) => {
                        if (answer.length < 1) {
                            return console.log("Please provide valid last name.");
                        }
                        return true;
                    }
                },
                {
                    name: "role",
                    type: "list",
                    choices: () => {
                        const choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                        }
                        return choiceArray;
                    },
                    message: "What is the employee's role?"
                }
            ])
            .then((answer) => {

                newEmployee.first_name = answer.first_name;
                newEmployee.last_name = answer.last_name;

                connection.query("SELECT * FROM role WHERE title = ?", answer.role, (err, results) => {
                    if (err) throw err;

                    newEmployee.role_id = results[0].id;
                    
                connection.query("SELECT * FROM employee;", (err, results) => {
                        if (err) throw err;
                        inquirer
                            .prompt([
                                {
                                    name: "manager_name",
                                    type: "list",
                                    choices: () => {
                                        const choiceArray = [];
                                        for (var i = 0; i < results.length; i++) {
                                            choiceArray.push(results[i].first_name);
                                        }
                                        return choiceArray;
                                    },
                                    message: "Who is the employee's manager?"
                                }
                            ])
                            .then((answer) => {
                                connection.query("SELECT id FROM employee WHERE first_name = ?", answer.manager_name, (err, results) => {
                                    if (err) throw err;
                                    newEmployee.manager_id = results[0].id;
                                    console.log("Adding new employee: ", newEmployee);

                                    connection.query('INSERT INTO employee SET ?', newEmployee, (err, results) => {
                                        if (err) throw err;
                                        console.log("Employee successfully added.");
                                        start();
                                    })
                                })
                            })
                    })
                })
            })
    })
}

//ADD NEW ROLE
const addRole = () => {
    const newRole = {};
    connection.query("SELECT * FROM department", (err, results) => {
        inquirer
            .prompt([
                {
                    name: "role_title",
                    type: "input",
                    default: "Software Engineer",
                    message: "What is the role you would like to add?",
                    validate:(answer) => {
                        if (answer.length < 1) {
                            return console.log("Please select a valid role.");
                        }
                        return true;
                    }
                },
                {
                    name: "salary",
                    type: "input",
                    default: "810000",
                    message: "What is the salary of the role?",
                    validate: (answer) => {
                        if (answer.length < 1) {
                            return console.log("Please select a valid salary.");
                        }
                        return true;
                    }
                },
                {
                    name: "department_name",
                    type: "list",
                    choices: () => {
                        const choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].name);
                        }
                        return choiceArray;
                    },
                    message: "What is the role's department?"
                }
            ])
            .then((answer) => {

                newRole.title = answer.role_title;
                newRole.salary = answer.salary;

                // Translate manager_name to id
                connection.query("SELECT id FROM department WHERE name = ?", answer.department_name, (err, results) =>
                {
                    if (err) throw err;
                    newRole.department_id = results[0].id;
                    console.log("Adding new role: ", newRole);

                    connection.query('INSERT INTO role SET ?', newRole, (err, results) => {
                        if (err) throw err;
                        console.log("Role successfully added.");
                        start();
                    })
                })

            })
    })
}

// ADD NEW DEPARTMENT
const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: "department_name",
                type: "input",
                default: "Information Technology",
                message: "What is the department you would like to add?",
                validate:(answer) => {
                    if (answer.length < 1) {
                        return console.log("Please provide a valid departmant name.");
                    }
                    return true;
                }
            }
        ])
        .then((answer) => {
                connection.query('INSERT INTO department (name) VALUES (?)', answer.department_name, (err, results) => {
                    if (err) throw err;
                    console.log("Department successfully added.");
                    start();
                })

        })

}

//UPDATE EXISTING ROLE
const updateRole = () => {

    const newRole = {};
 
     connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee AS e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id", (err, results) => {
         if (err) throw err;
         inquirer
             .prompt([
                 {
                     name: "updateEmployee",
                     type: "list",
                     choices: () => {
                         const choiceArray = [];
                         for (var i = 0; i < results.length; i++) {
                             choiceArray.push(results[i].first_name);
                         }
                         return choiceArray;
                     },
                     message: "Which employee would you like to update?"
                 }
             ])
             .then((answer) => { 
 
                 newRole.first_name = answer.updateEmployee;
 
                 connection.query("SELECT * FROM role",  (err, res) => {
                     if (err) throw err;
                     inquirer
                         .prompt([
                             {
                                 name: "updateRole",
                                 type: "list",
                                 choices: () => {
                                     const choiceArray = [];
                                     for (var i = 0; i < results.length; i++) {
                                         choiceArray.push(results[i].title);
                                     }
                                     return choiceArray;
                                 },
                                 message: "What is the employee's new role?"
                             }
                         ])
                         .then((answer) => {
                             
                             connection.query("SELECT * FROM role WHERE title = ?", answer.updateRole, (err, results) => {
                                 if (err) throw err;
 
                                 newRole.role_id = results[0].id;
 
                                 connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [newRole.role_id, newRole.first_name], (err, res) => {
                                     if (err) throw (err);
                                     console.log('Role successfully updated.');
                                     start();
                                 })
 
                             })
                         })
                 })
             })
     })
 }
 
 // UPDATE MANAGER
 const updateManager = () => {
 
     const newManager = {};
 
     connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee AS e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id", (err, results) => {
         if (err) throw err;
         inquirer
             .prompt([
                 {
                     name: "updateEmployee",
                     type: "list",
                     choices: () => {
                        const choiceArray = [];
                         for (var i = 0; i < results.length; i++) {
                             choiceArray.push(results[i].first_name);
                         }
                         return choiceArray;
                     },
                     message: "Which employee's manager would you like to update?"
                 }
             ])
             .then((answer) => {
 
                 newManager.first_name = answer.updateEmployee;
 
                 connection.query("SELECT * FROM employee", (err, res) => {
                     if (err) throw err;
                     inquirer
                         .prompt([
                             {
                                 name: "updateManager",
                                 type: "list",
                                 choices: () => {
                                     const choiceArray = [];
                                     for (var i = 0; i < results.length; i++) {
                                         choiceArray.push(results[i].first_name);
                                     }
                                     return choiceArray;
                                 },
                                 message: "Who will be their new manager?"
                             }
                         ])
                         .then((answer) => {
                             connection.query("SELECT * FROM employee WHERE first_name = ?", answer.updateManager,  (err, results) => {
                                 if (err) throw err;
 
                                 newManager.manager_id = results[0].id;
 
                                 connection.query("UPDATE employee SET manager_id = ? WHERE first_name = ?", [newManager.manager_id, newManager.first_name],  (err, res) => {
                                     if (err) throw (err);
                                     console.log('Manager successfully updated.');
                                     start();
                                 })
 
                             })
                         })
                 })
             })
     })
 }
 
 // REMOVE EMPLOYEE
 
 const removeEmployee = () => {
     connection.query("SELECT * FROM employee", (err, results) => {
         if (err) throw err;
         inquirer
             .prompt([
                 {
                     name: "removeEmployee",
                     type: "list",
                     choices: () => {
                         const choiceArray = [];
                         for (var i = 0; i < results.length; i++) {
                             choiceArray.push(results[i].first_name);
                         }
                         return choiceArray;
                     },
                     message: "Which employee would you like to remove?"
                 }
             ])
             .then((answer) => {
                 const query = 'DELETE FROM employee WHERE last_name = ?;'
                 connection.query(query, answer.removeEmployee, (err, res) => {
                     if (err) throw err;
                     console.log("Employee successfully removed");
                     start();
                 })
             })
     })
 }
 
 // REMOVE ROLE
 
 const removeRole = () => {
     connection.query("SELECT * FROM role", (err, results) => {
         if (err) throw err;
         inquirer
             .prompt([
                 {
                     name: "removeRole",
                     type: "list",
                     choices: () => {
                         const choiceArray = [];
                         for (var i = 0; i < results.length; i++) {
                             choiceArray.push(results[i].title);
                         }
                         return choiceArray;
                     },
                     message: "Which role would you like to remove?"
                 }
             ])
             .then((answer) => {
                 const query = 'DELETE FROM role WHERE title = ?;'
                 connection.query(query, answer.removeRole, (err, res) => {
                     if (err) throw err;
                     console.log("Role successfully deleted");
                     start();
                 })
             })
     })
 }
 
 // REMOVE DEPARTMENT
 
 const removeDepartment = () => {
     connection.query("SELECT * FROM department", (err, results) => {
         if (err) throw err;
         inquirer
             .prompt([
                 {
                     name: "removeDept",
                     type: "list",
                     choices: () => {
                         const choiceArray = [];
                         for (var i = 0; i < results.length; i++) {
                             choiceArray.push(results[i].name);
                         }
                         return choiceArray;
                     },
                     message: "Which department would you like to remove?"
                 }
             ])
             .then((answer) => {
                 const query = 'DELETE FROM department WHERE name = ?;'
                 connection.query(query, answer.removeDept, (err, res) => {
                     if (err) throw err;
                     console.log("Department successfully removed");
                     start();
                 })
             })
     })
 }

//// TOTAL DEPARTMENT'S BUDGET
const getBudget = ()  => {
    const budget = 0
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
        const query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, e2.first_name AS manager FROM employee LEFT JOIN employee as e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.name = ? ORDER BY employee.id';
        connection.query(query, answer.department_id, (err, finalData) => {
            if (err) throw err;
            finalData.forEach((employee) => {
                budget += employee.Salary
            })
            console.log("This is the department budget $" + budget);
            start();
        })
    })
})
  }
