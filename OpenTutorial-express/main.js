const express = require('express')
const app = express()
const port = 80
const topic = require('./lib/topic');

var db = require('./lib/db');
var template = require('./lib/template');

//get은 route, routing
app.get('/', (req, res) => {
    db.query('SELECT * FROM topic', function (error, topics) {
        if (error) throw error;
    
        var description = 'Hello, Node.js';
        var title = 'Welcome';
        var list = template.list(topics);
        var html = template.html(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
        res.send(html);
    });
    
});

app.get('/create', (req, res)=>{
    db.query('SELECT * FROM topic', function(error, topics){
        var description = '';
        var titole ='create';
        var list = template.list(topics);
        var html = template.html(title, list, )
    });
});

app.get('/page/:pageId', (req, res) =>{
    console.log(req.params);
    res.send(req.params);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

// var http = require('http');
// var url = require('url');
// var topic = require('./lib/topic');
// var author = require('./lib/author');

// var app = http.createServer(function (request, response) {
//     var _url = request.url;
//     var queryData = url.parse(_url, true).query;
//     var pathname = url.parse(_url, true).pathname;


//     if (pathname === '/') {
//         if (queryData.id === undefined) {
//             topic.home(response);
//         }
//         else {
//             topic.page(request, response);
//         }
//     } else if (pathname === '/create') {
//         topic.create(response);
//     }
//     else if (pathname === '/create_process') {
//         topic.create_process(request, response);
//     }
//     else if (pathname === `/update`) {
//         topic.update(request, response);
//     }
//     else if (pathname === '/update_process') {
//         topic.update_process(request, response);
//     }
//     else if (pathname == "/delete_process") {
//         topic.delete_process(request, response);
//     }
//     else if(pathname =="/author"){
//         author.home(request, response);
//     }
//     else if(pathname =="/author/create_process"){
//         author.create_process(request, response);
//     }
//     else if(pathname =="/author/update"){
//         author.update(request, response);
//     }
//     else if(pathname=="/author/update_process"){
//         author.update_process(request, response);
//     }
//     else if(pathname=="/author/delete_process"){
//         author.delete_process(request, response);
//     }
//     else {
//         response.writeHead(404);
//         response.end('Not found');
//     }

// });
// app.listen(80);