var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var template = require('./lib/template')
var mysql = require('mysql');
const { deepEqual } = require('assert');

var db = mysql.createConnection({
    host: '172.30.1.53',
    user: 'Open',
    password: 'Piano11823!',
    database: 'opentutorials'
});

db.connect();

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;


    if (pathname === '/') {
        if (queryData.id === undefined) {
            // fs.readdir('./data', function (err, filelist) {
            //     var title = 'Welcome';
            //     var list = template.list(filelist);
            //     var description = 'Hello, Node.js';
            //     var html = template.html(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
            //     response.writeHead(200);
            //     response.end(html);
            // });
            db.query('SELECT * FROM topic', function (error, topics) {
                if (error) throw error;

                var description = 'Hello, Node.js';
                var title = 'Welcome';
                var list = template.list(topics);
                var html = template.html(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);

                response.writeHead(200);
                response.end(html);
            });
        }
        else {
            // fs.readdir('./data', function (err, filelist) {
            //     var filteredId = path.parse(queryData.id).base; // 경로 탐색 차단
            //     fs.readFile(`./data/${filteredId}`, function (err, description) {
            //         var title = sanitizeHtml(queryData.id);
            //         var list = template.list(filelist);
            //         var html = template.html(title, list, `<h2>${title}</h2>${sanitizeHtml(description)}`, 
            //         `<a href="/create">create</a>
            //         <a href="/update?id=${title}">update</a>
            //         <form action="/delete_process" method="POST" onsubmit="y?">
            //             <input type="hidden" name="id" value="${title}">
            //             <input type="submit" value="delete">
            //         </form>`);
            //         response.writeHead(200);
            //         response.end(html);
            //     });
                

            // });
            db.query(`select topic.id, title, description, created, name, profile from topic left join author on topic.author_id=author.id where topic.id=?`, [queryData.id], function (error, topic) {
            //db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function (error, topic) {
                if (error) throw error;
                
                db.query('SELECT * FROM topic', function (error2, topics) {
                    if (error2) throw error2;
                    var title = topic[0].title;
                    var description = topic[0].description;
                    var list = template.list(topics);
                    var html = template.html(title, list, `<h2>${title}</h2>${description}
                    <p>by ${topic[0].name}</p>`, 
                    `<a href="/create">create</a>
                    <a href="/update?id=${topic[0].id}">update</a>
                    <form action="/delete_process" method="POST" onsubmit="y?">
                        <input type="hidden" name="id" value="${queryData.id}">
                        <input type="submit" value="delete">
                    </form>`);

                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if (pathname === '/create') {
//         fs.readdir('./data', function (err, filelist) {
//             var title = 'WEB - create';
//             var list = template.list(filelist);

//             var html = template.html(title, list, `<h2>${title}</h2>
//             <form action="/create_process" method="POST">
//     <p><input type="text" name = "title" placeholder = "title"></p>
//     <p>
//         <textarea name="description" placeholder = "description"></textarea>
//     </p>
//     <p>
//         <input type="submit">
//     </p>
// </form>`, ``);
//             response.writeHead(200);
//             response.end(html);
//         });

        db.query('SELECT * FROM topic', function (error, topics) {
            db.query(`select*from author`, function(error, authors){
                if (error) throw error;
                

                var title = 'WEB - create';
                var list = template.list(topics);
                var html = template.html(title, list, `<h2>${title}</h2>
                            <form action="/create_process" method="POST">
                    <p><input type="text" name = "title" placeholder = "title"></p>
                    <p>
                        <textarea name="description" placeholder = "description"></textarea>
                    </p>
                    <p>
                        ${template.author(authors)}
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>`, ``);

                response.writeHead(200);
                response.end(html);
            });
                
            });
    }
    else if (pathname === '/create_process') {
        var body = '';
        request.on('data', function (data) {
            body = body + data;
            if (body.length > 1e6) request.connection.destroy();
        });
        request.on('end', function () {
            var postData = qs.parse(body);
            var title = postData.title;
            var description = postData.description;
            // fs.writeFile(`./data/${title}`, description, 'utf8', function (err) {
            //     console.log('file creating...');
            //     response.writeHead(302, { Location: `/?id=${title}` });
            //     response.end();
            // });
            db.query(`
            insert into topic (title, description, created, author_id) values(?, ?, now(), ?)`
            ,[title, description, postData.author], function(error, result){
                if(error) throw error;
                response.writeHead(302, { Location: `/?id=${result.insertId}` });
                response.end();
            });
        });

    }
    else if (pathname === `/update`) {
//         fs.readdir('./data', function (err, filelist) {
//             var filteredId = path.parse(queryData.id).base; // 경로 탐색 차단
//             fs.readFile(`./data/${filteredId}`, 'utf8', function (err, description) {
//                 var title = queryData.id;
//                 var list = template.list(filelist);

//                 var html = template.html(title, list, `<h2>${title}</h2>
//             <form action="/update_process" method="POST">
//     <p><input type="text" name = "title" placeholder = "title" value= "${title}"></p>
//     <p>
//         <textarea name="description" placeholder = "description">${description}</textarea>
//     </p>
//     <p><input type="hidden" name = "id" value = "${title}"></p>
//     <p>
//         <input type="submit">
//     </p>
// </form>`, ``);
//                 response.writeHead(200);
//                 response.end(html);
//             });
//         });
            db.query(`select * from topic`, function(error, topics){
                if(error) throw error;
                db.query(`select * from topic where id=?`, [queryData.id], function(error2, result){
                    if (error2) throw error2;
                    db.query(`select*from author`, function (error, authors) {
                        var list = template.list(topics);
                        var title = result[0].title;
                        var description = result[0].description;
                        var tag = template.author(authors, result[0].author_id);
                        var html = template.html(title, list, `<a href="/create">create</a>
            <form action="/update_process" method="POST">
    <p><input type="text" name = "title" placeholder = "title" value= "${title}"></p>
    <p>
        <textarea name="description" placeholder = "description">${description}</textarea>
    </p>
    <p><input type="hidden" name = "id" value = "${result[0].id}"></p>
    <p>
        ${tag}
    </p>
    <p>
        <input type="submit">
    </p>
</form>`, ``);
                        response.writeHead(200);
                        response.end(html);
                    });
                });
            });

    }
    else if (pathname === '/update_process') {
        var body = '';
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            // var oldFile = qs.parse(body).id;
            // var newFile = qs.parse(body).title;
            // fs.rename(`./data/${oldFile}`, `./data/${newFile}`, function () {
            //     console.log('file creation successed');
            //     fs.writeFile(`./data/${newFile}`, qs.parse(body).description, 'utf8', function () {
            //         console.log('file writing is terminated...');
            //         response.writeHead(302, { Location: `/?id=${newFile}` });
            //         response.end();
            //     });
            // });
            db.query(`update topic set title=?, description=?, author_id=? where id=?`, [post.title, post.description, post.author, post.id], function(error, result){
                if(error) throw error;
                response.writeHead(302, { Location: `/?id=${post.id}` });
                response.end();
            });
        });
    }
    else if (pathname == "/delete_process") {
        var body = '';
        request.on('data', function (data) {
            body = body + data;
        });
        request.on('end', function () {
            var post = qs.parse(body);
            // var id = qs.parse(body).id;
            // var filteredId = path.parse(id).base;
            // fs.unlink(`./data/${filteredId}`, function () {
            //     console.log('file is deleted...');
            //     response.writeHead(302, { Location: '/' });
            //     response.end();
            // })
            db.query(`delete from topic where id=?`, [post.id], function(error, result){
                if(error) throw error;
                response.writeHead(302, {Location : '/'});
                response.end();
            });
        });

    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }

});
app.listen(80);