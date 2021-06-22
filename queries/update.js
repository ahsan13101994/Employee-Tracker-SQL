const inquirer = require('inquirer');

function updateRole(connection, cb) {

    let newRole = {};

    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "updateEmployee",
                    type: "list",
                    choices: function () {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].first_name);
                        }
                        return choiceArray;
                    },
                    message: "Which employee would you like to update?"
                }
            ])
            .then(function (answer) {

                newRole.first_name = answer.updateEmployee;

                connection.query("SELECT * FROM role", function (err, res) {
                    if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                name: "updateRole",
                                type: "list",
                                choices: function () {
                                    let choiceArray = [];
                                    for (var i = 0; i < results.length; i++) {
                                        choiceArray.push(results[i].title);
                                    }
                                    return choiceArray;
                                },
                                message: "What is the employee's new role?"
                            }
                        ])
                        .then(function (answer) {
                            
                            connection.query("SELECT * FROM role WHERE title = ?", answer.updateRole, function (err, results) {
                                if (err) throw err;

                                newRole.role_id = results[0].id;

                                connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [newRole.role_id, newRole.first_name], function (err, res) {
                                    if (err) throw (err);
                                    console.log('Role successfully updated.');
                                    cb();
                                })

                            })
                        });
                });
            });
    })
};

// ADD FUNCTION UPDATE MANAGER

// ADD REMOVE EMPLOYEE FUNCTION

// ADD REMOVE ROLE FUNCTION

// ADD REMOVE DEPARTMENT FUNCTION


module.exports = {    
    updateRole: updateRole,
}