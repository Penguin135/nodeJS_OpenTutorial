const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const userdb = low(adapter)
const shortid = require('shortid');
userdb.defaults({users:[]}).write();

module.exports=userdb;