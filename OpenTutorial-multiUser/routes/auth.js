var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var template = require('../lib/template');
var shortid = require('shortid');
var db = require('../lib/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports=function(passport){
    router.get('/login', (req, res) => {
            var fmsg = req.flash();
            var message='';
            if(fmsg.message){
                message=fmsg.message;
            }
            var title = 'Login';
            var description = '';
            var topics = db.get("topics").value();
            var list = template.list(topics);
                    var html = template.html(title, list, `<h2>${title}</h2>
                    <p>
                        ${message}
                    </p>
                    <form action="/auth/login_process" method='POST'>
                        <p>
                            <input type="text" name="email" placeholder="email">
                        </p>
                        <p>
                            <input type="password" name="pwd" placeholder="password">
                        </p>
                        <input type="submit" value="로그인">
                    </form>${description}`, ``);
            res.send(html);
    });

    router.post('/login_process', function (req, res, next) {
        console.log(req.body);
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.session.save(function () {
                    req.flash('message', info.message);
                    return req.session.save(function () {
                        res.redirect('/auth/login');
                    });
                });
            }
            req.logIn(user, function (err) {
                if (err) { return next(err); }
                req.session.save(function () {
                    res.redirect('/');
                    return;
                });
            });
        })(req, res, next);
    });
    
    router.get('/logout', (req,res)=>{
        req.logOut();
        req.session.save(function(err){
            if(err) throw err;
            res.redirect('/');
        })
    })

    router.get('/register', (req, res) => {

            var fmsg = req.flash();
            var message='';
            if(fmsg.message){
                message=fmsg.message;
            }
            var title = 'Register';
            var description = '';
            var topics = db.get('topics').value();
            var list = template.list(topics);
                    var html = template.html(title, list, `<h2>${title}</h2>
                    <p>
                        ${message}
                    </p>
                    <form action="/auth/register_process" method='POST'>
                        <p>
                            <input type="text" name="email" placeholder="email" value="rudwns@naver.com">
                        </p>
                        <p>
                            <input type="password" name="pwd" placeholder="password" value="12345">
                        </p>
                        <p>
                            <input type="password" name="pwd2" placeholder="confirm" value="12345">
                        </p>
                        <p>
                            <input type="text" name="displayName" placeholder="display name" value="person">
                        </p>
                        <input type="submit" value="회원가입">
                    </form>${description}`, ``);
            res.send(html);
    });

    router.post('/register_process', (req, res) => {
        var post = req.body;
        var email = post.email;
        var pwd = post.pwd;
        var pwd2 = post.pwd2;
        var nickname = post.displayName;
        var sid = shortid.generate();

        // 패스워드 두 개가 일치하지 않으면, 에러 출력
        if(pwd != pwd2){
            req.flash('message', 'Password not same');
            req.session.save(function () {
                res.redirect('/auth/register');
            });
        }else{
            bcrypt.hash(pwd, saltRounds, function(err, hash) {
                var user = {
                    id:sid,
                    email:email,
                    password:hash,
                    displayName:nickname
                };
                db.get('users').push(user).write();
                req.login(user, function(err){
                    req.session.save(function(err){
                        if(err) throw err;
                        res.redirect('/');
                    })
                });    
            });
            
        }
        
    });

    return router;
}

//module.exports = router;


// router.post('/login_process', (req, res)=>{
//     if(req.body.email == authData.email && req.body.pwd == authData.password){
//         console.log(req.session);
//         req.session.is_logined = true;
//         req.session.nickname = authData.nickname;
//         req.session.save(function(){
//             res.redirect('/');
//         });
        
        
//     }else{
//         res.send('login failed');
//     }
// })


// router.get('/create', (req, res) => {
//     db.query('SELECT * FROM topic', function (error, topics) {
//         if (error) throw error;
//         db.query('SELECT * FROM author', function (error2, authors) {
//             if (error2) throw error2;
//             var title = 'Create';
//             var description = '';
//             var list = template.list(topics);
//             var authorOptions = '';

//             authors.forEach((author) => {
//                 authorOptions += `<option value = ${author.id}>${author.name}</option>`;
//             });
//             var html = template.html(title, list, `<h2>${title}</h2><form action="/page/create_process" method='POST'>
//         <p>
//            <input type="text" name="title" placeholder="title">
//         </p>
//         <p>
//             <textarea name="description" placeholder="description"></textarea>
//         </p>
//         <p>
//             <select name="author">
//                 ${authorOptions};
//             </select>
//         </p>
//         <input type="submit" value="전송">
//     </form>${description}`, ``);
//             res.send(html);
//         });

//     });
// });


// router.post('/create_process', (req, res) => {
//     var title = req.body.title;
//     var description = req.body.description;
//     var authorId = req.body.author;
//     db.query(`INSERT INTO topic (title, description, created, author_id) values (?, ?, now(), ?);`, [title, description, authorId], function (error, result) {
//         if (error) throw error;
//         res.redirect(`/page/${result.insertId}`);
//     });
// });

// router.post('/delete_process', (req, res) => {
//     db.query(`DELETE FROM topic WHERE topic.id = ?`, [req.body.id], (error, result) => {
//         res.redirect('/');
//     });
// });

// router.get('/update/:topicId', (req, res) => {
//     db.query('SELECT * FROM topic', function (error1, topics) {
//         if (error1) throw error1;
//         db.query('SELECT * FROM topic WHERE id = ?', [req.params.topicId], function (error2, topic) {
//             if (error2) throw error2;
//             db.query('SELECT * FROM author', (error3, authors) => {
//                 var list = template.list(topics);
//                 var title = topic[0].title;
//                 var description = topic[0].description;
//                 var tag = template.author(authors, topic[0].author_id);
//                 var html = template.html(title, list, `<h2>${title}</h2>
//             <form action="/page/update_process" method='POST'>
//             <p>
//                <input type="text" name="title" value="${title}">
//             </p>
//             <p>
//                 <textarea name="description">${description}</textarea>
//             </p>
//             <p>
//                 <input type="hidden" name="id" value="${topic[0].id}">
//             </p>
//             <p>
//                 ${tag}
//             <p>
//             <input type="submit" value="수정">
//         </form>`, ``);
//                 res.send(html);
//             });
//         });
//     });
// });

// router.post('/update_process', (req, res) => {
//     db.query('UPDATE topic SET title=?, description=?, author_id=? where topic.id = ?', [req.body.title, req.body.description, req.body.author, req.body.id], function (error1, result) {
//         if (error1) throw error1;
//         res.redirect(`/page/${req.body.id}`);
//     });
// });

// //상세 보기 페이지
// router.get('/:pageId', (req, res, next) => {
//     //console.log(req.params.pageId);
//     db.query('SELECT * FROM topic', function (error, topics) {
//         if (error) next(error);
//         db.query('SELECT * FROM topic WHERE topic.id = ?', [req.params.pageId], function (error2, topic) {
//             if (error2) next(error2);
//             try {
//                 db.query('SELECT * FROM author WHERE id = ?', [topic[0].author_id], function (error3, author) {
//                     if (error3) {
//                         console.log('error3 occured!!');
//                         next(error3);
//                     }
//                     else {
//                         var description = topic[0].description;
//                         var title = topic[0].title;
//                         var list = template.list(topics);

//                         var html = template.html(title, list, `<h2>${title}</h2>${description}<p>by ${author[0].name}</p>`, `<a href="/page/create">create</a>
//                 <a href="/page/update/${topic[0].id}">update</a>
//                 <form action="/page/delete_process" method="POST">
//                     <input type="hidden" name="id" value="${topic[0].id}">
//                     <input type="submit" value="삭제">
//                 </form>`);
//                         res.send(html);
//                     }
//                 });
//             } catch (err) {
//                 if (err) {
//                     console.log('err occured!!');
//                     next(err);
//                 }
//             }
//         });
//     });
// });

