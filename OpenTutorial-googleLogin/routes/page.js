var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var template = require('../lib/template');
var auth = require('../lib/auth');
var shortId = require('shortid');
const { request } = require('express');

router.get('/create', (req, res) => {
    console.log(req.user);
    var title = 'Create';
    var description = '';
    var topics = db.get('topics').value();
    var list = template.list(topics);

    var html = template.html(title, list, `<h2>${title}</h2><form action="/page/create_process" method='POST'>
        <p>
           <input type="text" name="title" placeholder="title">
        </p>
        <p>
            <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
            <input type="hidden" name="author" value=${req.user.id}></input>
        </p>
        <input type="submit" value="전송">
    </form>${description}`, ``, auth.statusUI(req, res));
    res.send(html);
});


router.post('/create_process', (req, res) => {
    if(!auth.isOwner(req, res)){
        res.redirect('/');
        return false;
    }
    console.log(req.body);
    var title = req.body.title;
    var description = req.body.description;
    var authorId = req.body.author;
    var topicId = shortId.generate();
    db.get('topics').push({
        id:topicId,
        title:title,
        description:description,
        author:authorId
    }).write();
    res.redirect(`/page/${topicId}`);
});

router.post('/delete_process', (req, res) => {
    if(!auth.isOwner(req, res)){
        res.redirect('/');
        return false;
    }
    var topic = db.get('topics').find({id:req.body.id}).value();
    console.log(topic);
    console.log(req.body);
    if(topic.author != req.user.id){
        req.session.save(function () {
            req.flash('message', 'Not yours');
            return req.session.save(function () {
                res.redirect('/');
            });
        });
    }else{
        db.get('topics').remove({id:topic.id}).write();
        res.redirect('/');
    }
    
});

router.get('/update/:topicId', (req, res) => {

    var topics = db.get('topics').value();
    var topic = db.get('topics').find({ id: req.params.topicId }).value();
    var list = template.list(topics);
    var title = topic.title;
    var description = topic.description;
    //var tag = template.author(authors, topic[0].author_id);
    var html = template.html(title, list, `<h2>${title}</h2>
            <form action="/page/update_process" method='POST'>
            <p>
               <input type="text" name="title" value="${title}">
            </p>
            <p>
                <textarea name="description">${description}</textarea>
            </p>
            <p>
                <input type="hidden" name="id" value="${topic.id}">
            </p>

            <input type="submit" value="수정">
        </form>`, ``, auth.statusUI(req, res));
    res.send(html);


});

router.post('/update_process', (req, res) => {
    if (!auth.isOwner(req, res)) {
        res.redirect('/');
        return false;
    }
    var topic = db.get('topics').find({ id: req.body.id }).value();
    if (topic.author == req.user.id) {
        db.get('topics').find({ id: req.body.id }).assign({ title: req.body.title, description: req.body.description }).write();
        res.redirect(`/page/${req.body.id}`);
    } else {
        req.session.save(function () {
            req.flash('message', 'Not yours');
            return req.session.save(function () {
                res.redirect('/');
            });
        });
    }
});

//상세 보기 페이지
router.get('/:pageId', (req, res, next) => {
    var topics = db.get('topics').value();
    var topic = db.get('topics').find({ id: req.params.pageId}).value();
    var list = template.list(topics);

    var title = topic.title;
    var description = topic.description;
    var authorId = topic.author;

    var author = db.get('users').find({id:authorId}).value();
    
    var html = template.html(title, list, `<h2>${title}</h2>${description}<p>by ${author.displayName}</p>`, `<a href="/page/create">create</a>
                <a href="/page/update/${topic.id}">update</a>
                <form action="/page/delete_process" method="POST">
                    <input type="hidden" name="id" value="${topic.id}">
                    <input type="submit" value="삭제">
                </form>`, `${auth.statusUI(req, res)}`);
    res.send(html); 
});

module.exports = router;