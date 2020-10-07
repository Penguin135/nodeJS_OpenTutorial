var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var template = require('../lib/template');
var auth = require('../lib/auth');
const { response } = require('express');

router.get('/create', (req, res) => {
    db.query('SELECT * FROM topic', function (error, topics) {
        if (error) throw error;
        db.query('SELECT * FROM author', function (error2, authors) {
            if (error2) throw error2;
            var title = 'Create';
            var description = '';
            var list = template.list(topics);
            var authorOptions = '';

            authors.forEach((author) => {
                authorOptions += `<option value = ${author.id}>${author.name}</option>`;
            });
            var html = template.html(title, list, `<h2>${title}</h2><form action="/page/create_process" method='POST'>
        <p>
           <input type="text" name="title" placeholder="title">
        </p>
        <p>
            <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
            <select name="author">
                ${authorOptions};
            </select>
        </p>
        <input type="submit" value="전송">
    </form>${description}`, ``, auth.statusUI(req,res));
            res.send(html);
        });

    });
});


router.post('/create_process', (req, res) => {
    if(!auth.isOwner(req, res)){
        res.redirect('/');
        return false;
    }
    var title = req.body.title;
    var description = req.body.description;
    var authorId = req.body.author;
    db.query(`INSERT INTO topic (title, description, created, author_id) values (?, ?, now(), ?);`, [title, description, authorId], function (error, result) {
        if (error) throw error;
        res.redirect(`/page/${result.insertId}`);
    });
});

router.post('/delete_process', (req, res) => {
    if(!auth.isOwner(req, res)){
        res.redirect('/');
        return false;
    }
    db.query(`DELETE FROM topic WHERE topic.id = ?`, [req.body.id], (error, result) => {
        res.redirect('/');
    });
});

router.get('/update/:topicId', (req, res) => {
    db.query('SELECT * FROM topic', function (error1, topics) {
        if (error1) throw error1;
        db.query('SELECT * FROM topic WHERE id = ?', [req.params.topicId], function (error2, topic) {
            if (error2) throw error2;
            db.query('SELECT * FROM author', (error3, authors) => {
                var list = template.list(topics);
                var title = topic[0].title;
                var description = topic[0].description;
                var tag = template.author(authors, topic[0].author_id);
                var html = template.html(title, list, `<h2>${title}</h2>
            <form action="/page/update_process" method='POST'>
            <p>
               <input type="text" name="title" value="${title}">
            </p>
            <p>
                <textarea name="description">${description}</textarea>
            </p>
            <p>
                <input type="hidden" name="id" value="${topic[0].id}">
            </p>
            <p>
                ${tag}
            <p>
            <input type="submit" value="수정">
        </form>`, ``,auth.statusUI(req,res));
                res.send(html);
            });
        });
    });
});

router.post('/update_process', (req, res) => {
    if(!auth.isOwner(req, res)){
        res.redirect('/');
        return false;
    }
    db.query('UPDATE topic SET title=?, description=?, author_id=? where topic.id = ?', [req.body.title, req.body.description, req.body.author, req.body.id], function (error1, result) {
        if (error1) throw error1;
        res.redirect(`/page/${req.body.id}`);
    });
});

//상세 보기 페이지
router.get('/:pageId', (req, res, next) => {
    //console.log(req.params.pageId);
    db.query('SELECT * FROM topic', function (error, topics) {
        if (error) next(error);
        db.query('SELECT * FROM topic WHERE topic.id = ?', [req.params.pageId], function (error2, topic) {
            if (error2) next(error2);
            try {
                db.query('SELECT * FROM author WHERE id = ?', [topic[0].author_id], function (error3, author) {
                    if (error3) {
                        console.log('error3 occured!!');
                        next(error3);
                    }
                    else {
                        var description = topic[0].description;
                        var title = topic[0].title;
                        var list = template.list(topics);

                        var html = template.html(title, list, `<h2>${title}</h2>${description}<p>by ${author[0].name}</p>`, `<a href="/page/create">create</a>
                <a href="/page/update/${topic[0].id}">update</a>
                <form action="/page/delete_process" method="POST">
                    <input type="hidden" name="id" value="${topic[0].id}">
                    <input type="submit" value="삭제">
                </form>`,`${auth.statusUI(req,res)}`);
                        res.send(html);
                    }
                });
            } catch (err) {
                if (err) {
                    console.log('err occured!!');
                    next(err);
                }
            }
        });
    });
});

module.exports = router;