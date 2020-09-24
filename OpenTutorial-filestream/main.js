var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var template = require('./lib/template')
//정리용 함수



var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    

    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', function (err, filelist) {
                var title = 'Welcome';
                var list = template.list(filelist);
                var description = 'Hello, Node.js';
                var html = template.html(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html);
            });
        }
        else {
            fs.readdir('./data', function (err, filelist) {
                var filteredId = path.parse(queryData.id).base; // 경로 탐색 차단
                fs.readFile(`./data/${filteredId}`, function (err, description) {
                    var title = sanitizeHtml(queryData.id);
                    var list = template.list(filelist);
                    var html = template.html(title, list, `<h2>${title}</h2>${sanitizeHtml(description)}`, 
                    `<a href="/create">create</a>
                    <a href="/update?id=${title}">update</a>
                    <form action="/delete_process" method="POST" onsubmit="y?">
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" value="delete">
                    </form>`);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if(pathname ==='/create'){
        fs.readdir('./data', function (err, filelist) {
            var title = 'WEB - create';
            var list = template.list(filelist);
            
            var html = template.html(title, list, `<h2>${title}</h2>
            <form action="/create_process" method="POST">
    <p><input type="text" name = "title" placeholder = "title"></p>
    <p>
        <textarea name="description" placeholder = "description"></textarea>
    </p>
    <p>
        <input type="submit">
    </p>
</form>`, ``);
            response.writeHead(200);
            response.end(html);
        });
    }
    else if(pathname==='/create_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
            if(body.length > 1e6)request.connection.destroy();
        });
        request.on('end', function(){
            var postData = qs.parse(body);
            var title=postData.title;
            var description = postData.description;
            fs.writeFile(`./data/${title}`, description, 'utf8', function(err){
                console.log('file creating...');
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });
        });
        
    }
    else if (pathname === `/update`) {
        fs.readdir('./data', function (err, filelist) {
            var filteredId = path.parse(queryData.id).base; // 경로 탐색 차단
            fs.readFile(`./data/${filteredId}`, 'utf8', function (err, description) {
                var title = queryData.id;
                var list = template.list(filelist);

                var html = template.html(title, list, `<h2>${title}</h2>
            <form action="/update_process" method="POST">
    <p><input type="text" name = "title" placeholder = "title" value= "${title}"></p>
    <p>
        <textarea name="description" placeholder = "description">${description}</textarea>
    </p>
    <p><input type="hidden" name = "id" value = "${title}"></p>
    <p>
        <input type="submit">
    </p>
</form>`, ``);
            response.writeHead(200);
            response.end(html);
            });
        });

    }
    else if(pathname ==='/update_process'){
        var body='';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            console.log(qs.parse(body));
            var oldFile = qs.parse(body).id;
            var newFile = qs.parse(body).title;
            fs.rename(`./data/${oldFile}`, `./data/${newFile}`, function(){
                console.log('file creation successed');
                fs.writeFile(`./data/${newFile}`, qs.parse(body).description, 'utf8', function(){
                    console.log('file writing is terminated...');
                    response.writeHead(302, {Location : `/?id=${newFile}`});
                    response.end();
                });
            });

        });
    }
    else if(pathname=="/delete_process"){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var id = qs.parse(body).id;
            var filteredId = path.parse(id).base;
            fs.unlink(`./data/${filteredId}`, function(){
                console.log('file is deleted...');
                response.writeHead(302, {Location : '/'});
                response.end();
            })
        });
        
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }

});
app.listen(80);