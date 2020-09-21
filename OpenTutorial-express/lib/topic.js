var db = require('./db');
var template = require('./template');
var url = require('url');
var qs = require('querystring');
exports.home = function(){
    db.query('SELECT * FROM topic', function (error, topics) {
        if (error) throw error;
    
        var description = 'Hello, Node.js';
        var title = 'Welcome';
        var list = template.list(topics);
        var html = template.html(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
    
        // response.writeHead(200);
        // response.end(html);
        return html;    
    });
    
}

exports.page = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
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

exports.create = function(response){
    db.query('SELECT * FROM topic', function (error, topics) {
        db.query(`select*from author`, function (error, authors) {
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

exports.create_process = function(request, response){
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
                , [title, description, postData.author], function (error, result) {
                    if (error) throw error;
                    response.writeHead(302, { Location: `/?id=${result.insertId}` });
                    response.end();
                });
        });
}

exports.update=function(request, response){
    db.query(`select * from topic`, function (error, topics) {
        if (error) throw error;
        var _url = request.url;
        var queryData = url.parse(_url, true).query;
        db.query(`select * from topic where id=?`, [queryData.id], function (error2, result) {
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

exports.update_process=function(request, response){
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
            db.query(`update topic set title=?, description=?, author_id=? where id=?`, [post.title, post.description, post.author, post.id], function (error, result) {
                if (error) throw error;
                response.writeHead(302, { Location: `/?id=${post.id}` });
                response.end();
            });
        });
}

exports.delete_process = function(request, response){
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
            db.query(`delete from topic where id=?`, [post.id], function (error, result) {
                if (error) throw error;
                response.writeHead(302, { Location: '/' });
                response.end();
            });
        });
}