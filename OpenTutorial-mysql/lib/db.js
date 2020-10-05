var mysql = require('mysql');
var db = mysql.createConnection({
    host : '172.30.1.53',
    user : 'Open',
    password : 'Piano11823!',
    database : 'opentutorials',
});
db.connect();

module.exports=db;