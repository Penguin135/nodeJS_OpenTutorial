var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var template = require('./lib/template')
var cookie = require('cookie');
//정리용 함수



function authIsOwner(request, response){
    var isOwner = false;

    var cookies={};
    if (request.headers.cookie) {
        cookies = cookie.parse(request.headers.cookie);
        
    }

    if(cookies.email =='rudwns273@naver.com' && cookies.password =='111'){
        isOwner = true;
    }
    
    return isOwner;
}

function authStatusUI(isOwner){
    var UI = `<a href='/login'>login</a>`;
    if(isOwner){
        UI = `<a href='/logout_process'>logout</a>`
    }
    return UI;
}

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    
    var isOwner = authIsOwner(request, response);
    console.log(isOwner);

    
    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('./data', function (err, filelist) {
                var title = 'Welcome';
                var list = template.list(filelist);
                var description = 'Hello, Node.js';
                var html = template.html(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`, authStatusUI(isOwner));
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
                    </form>`, authStatusUI(isOwner));
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if(pathname ==='/create'){
        if(!authIsOwner(request, response)){
            response.end('You need to login');
            return false;
        }
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
</form>`, ``, authStatusUI(isOwner));
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
        if(!authIsOwner(request, response)){
            response.end('You need to login');
            return false;
        }
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
</form>`, ``, authStatusUI(isOwner));
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
        if(!authIsOwner(request, response)){
            response.end('You need to login');
            return false;
        }
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
    else if(pathname=="/login"){
        fs.readdir('./data', function(error, filelist){
            var title = 'Login';
            var list = template.list(filelist);
            var html = template.html(title, list, `
                <form action="login_process" method="POST">
                    <p>
                        <input type="text" name="email" placeholder="email">
                    </p>
                    <p>
                        <input type="password" name="password" placeholder="passowrd">
                    </p>
                    <p>
                        <input type="submit" vale="로그인">
                    </p>
                </form>
            `, `<h2>Login</h2>`, authStatusUI(isOwner));
            response.writeHead(200);
            response.end(html);
        });
    }
    else if(pathname=="/login_process"){
        var body='';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            if(post.email == 'rudwns273@naver.com' && post.password=='111'){
                console.log('loging...');
                response.writeHead(302, {
                    'Set-Cookie':[
                        `email=${post.email}`,
                        `password=${post.password}`,
                        `nickname=rudwns`
                    ],
                    Location:'/'
                });
                response.end();
            }else{
                response.end('Login failed');
            }
        });
    }
    else if(pathname=='/logout_process'){
        response.writeHead(302, {
            'Set-Cookie':[
                `email=; Max-Age=0`,
                `password=; Max-Age=0`,
                `nickname=; Max-Age=0`
            ],
            Location : '/'
        });
        response.end();
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }

});
app.listen(80);