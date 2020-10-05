const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const shortid = require('shortid');
const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ topic: [], author: [] }).write();

// id를 직접 부여하면서 생성
db.get('author').push({
    id:1,
    name:'egoing',
    profile:'developer'
}).write();

db.get('topic').push({
    id:1,
    title:'lowdb',
    description:'lowdb is ...',
    author:1
}).write();

db.get('topic').push({
    id:2,
    title:'mysql',
    description:'mysql is ...',
    author:1
}).write();

// 조희
console.log(db.get('topic').value());
console.log(db.get('topic').find({title:'lowddb'}).value());

// 수정
db.get('topic').find({id:2}).assign({title:'mariadb and mysql'}).write();

// 삭제
db.get('topic').remove({id:2}).write();

// shortid모듈을 이용하여 랜덤한 id를 부여하면서 생성
var sid = shortid.generate();
db.get('author').push({
    id:sid,
    name:'rudwns',
    profile:'junior developer'
}).write();

db.get('topic').push({
    id:shortid.generate(),
    title:'PostgreSQL',
    description:'PostgreSQL is...',
    author:sid
}).write();