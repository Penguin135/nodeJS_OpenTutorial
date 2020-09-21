var mysql = require('mysql');

var db = mysql.createConnection({
    host: '192.168.1.48',
    user: 'Open',
    password: 'Piano11823!',
    database: 'opentutorials'
});

db.connect();

module.exports = db;