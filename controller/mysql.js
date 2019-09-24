const mysql = require('mysql');
const path = require('path');

const mysql_config = require('../secrets/mysql.json');
const connection = mysql.createConnection(mysql_config);

// test query to check wether the mysql database is up
connection.query('SELECT 1', (error, results, fields) => {
  if (!error) return console.log('Connected to the Database!');
  console.log('Could NOT connect to database with error:\n' + error)
  process.exit();
});

module.exports.execute_query = (query, params, callback) => {
  connection.query(query, params, function (error, results, fields) {
    if (!error) {
      callback(true, results);
    }else{
      callback(false, error);
    }
  });
}