var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '172.30.1.53',
  user     : 'Open',
  password : 'Piano11823!',
  database : 'opentutorials'
});
 
connection.connect();
 
connection.query('SELECT * FROM topic', function (error, results, fields) {
  if (error) throw error;
  console.log(results);
});
 
connection.end();