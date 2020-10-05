const express = require('express')
const app = express()
const port = 80
var compression = require('compression')
var bodyParser = require('body-parser');
var pageRouter = require('./routes/page');
var indexRouter = require('./routes/index');
var authorRouter = require('./routes/author');
var authRouter = require('./routes/auth');
var helmet = require('helmet')
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var flash = require('connect-flash');

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

app.use(session({
    secret: 'sknfienf123',
    resave: false,
    saveUninitialized: true,
    store:new FileStore()
}));

app.use(flash());


app.get('/flash', function(req, res){
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash('info', 'Flash is back!')
  res.send('flash');
});

app.get('/flash-display', function(req, res){
  var fmsg = req.flash();
  console.log(fmsg);
  res.send(fmsg);
});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    
    if(user){
        done(null, user.email);
    }
});

passport.deserializeUser(function (id, done) {
    console.log('deserialize', id);
    const authData = {
        email:'rudwns273@naver.com',
        password:'12345',
        nickname:'rudwns'
    }
    done(null, authData);
});

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'pwd'
    },
    function (username, password, done) {
        const authData = {
            email:'rudwns273@naver.com',
            password:'12345',
            nickname:'rudwns'
        }
        console.log(username, password);
        if(username==authData.email){
            if(password==authData.password){
                console.log(1);
                done(null, authData);
            }else{

                return done(null, false, {
                    message: 'Incorrect password.'
                });    
            }
        }else{
            return done(null, false, {
                message: 'Incorrect username.'
            });
        }
    }
));

// app.post('/auth/login_process',
//   passport.authenticate('local', { 
//     successRedirect: '/',
//     failureRedirect: '/auth/login' }
// ));

// app.post('/auth/login_process', passport.authenticate('local'), function (req, res, ) {
//     req.session.save(function () {
//         console.log('session save....');
//         res.redirect('/');
//     })
// });

// app.post('/auth/login_process', passport.authenticate('local', 
//     {
//         failureRedirect: '/auth/login',
//         failureFlash: true
//     }), 
//     function(req, res){
//     req.session.save(function(){
//         console.log('session save...');
//         res.redirect('/');
//     })
// })

// app.post('/auth/login_process', passport.authenticate('local', 
//     {
//         failureRedirect: '/auth/login',
//         failureFlash: true
//     }), 
//     function(req, res){
//     req.session.save(function(){
//         console.log('session save...');
//         res.redirect('/');
//     })
// })

app.post('/auth/login_process', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.session.save(function () {
                console.log('info', info.message);
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

app.use('/page', pageRouter);
app.use('/author', authorRouter);
app.use('/auth', authRouter);
app.use('/',indexRouter);



// app.get('*', function (req, res, next) {
//     db.query('SELECT * FROM topic', function (error, topics) {
//         req.topics = topics;
//         next();
//     });

// });


app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!');
})

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