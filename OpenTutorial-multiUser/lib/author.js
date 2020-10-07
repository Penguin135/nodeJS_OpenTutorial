var db = require('./db');
var template = require('./template');
var qs = require('querystring');
var url = require('url');
const { request } = require('http');
exports.home = function (request, response) {
    db.query('SELECT * FROM topic', function (error, topics) {
        if (error) throw error;
        db.query(`select * from author`, function (error2, authors) {
            if (error2) throw error2;
            var title = 'author list';
            var list = template.list(topics);
            var description = template.authorTable(authors);

            var html = template.html(title, list, `<h2>${title}</h2>${description}
            <form action="/author/create_process" method="POST">
                <p>
                    <input type="text" name="name" placeholder="name"/>
                </p>
                    <textarea name="profile" placeholder="profile"></textarea>
                <p>
                    <input type="submit"/>
                </p>
            </form>
            `, ``);

            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create_process = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        qsData = qs.parse(body);
        db.query(`INSERT INTO author (name, profile) values(?, ?)`, [qsData.name, qsData.profile], function (error, result) {
            if (error) throw error;
            response.writeHead(302, { Location: '/author' });
            response.end();
        });

    });

}

exports.update = function (request, response) {
    db.query('SELECT * FROM topic', function (error, topics) {
        if (error) throw error;
        db.query(`select * from author`, function (error2, authors) {
            if (error2) throw error2;
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query(`select * from author where id=?`, [queryData.id], function (error3, result) {
                if (error3) throw error3;
                var title = 'author list';
                var list = template.list(topics);
                var description = template.authorTable(authors);
                var html = template.html(title, list, `<h2>${title}</h2>${description}
            <form action="/author/update_process" method="POST">
                <input type="hidden" name="id" value="${result[0].id}">
                <p>
                    <input type="text" name="name" value = "${result[0].name}">
                </p>
                    <textarea name="profile">${result[0].profile}</textarea>
                <p>
                    <input type="submit"/>
                </p>
            </form>
            `, ``);

                response.writeHead(200);
                response.end(html);
            })


        });
    });
}

exports.update_process = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });

    request.on('end', function () {
        var post = qs.parse(body);
        db.query(`update author set name=?, profile=? where id=?`, [post.name, post.profile, post.id], function (error, result) {
            if (error) throw error;
            response.writeHead(302, { Location: `/author` });
            response.end();
        });
    })

}

exports.delete_process = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body += data;
    });
    request.on('end', function () {
        var post = qs.parse(body);
        db.query(`delete from topic where author_id=?`, [post.id], function (error, result) {
            if (error) throw error;
            db.query(`delete from author where id=?`, [post.id], function (error2, result) {
                if (error2) throw error2;
                response.writeHead(302, { Location: '/author' });
                response.end();
            });
        });
    })
}