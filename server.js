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

 };




