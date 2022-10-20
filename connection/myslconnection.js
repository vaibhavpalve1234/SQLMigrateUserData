const mysql = require('mysql');


var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    database : 'Local_DB'
  });
  
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
  });

module.exports = { connection };
