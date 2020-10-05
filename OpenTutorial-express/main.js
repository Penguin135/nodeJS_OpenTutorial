const express = require('express')
const app = express()
const port = 80
var compression = require('compression')
var bodyParser = require('body-parser');
var pageRouter = require('./routes/page');

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
var passport = require('./lib/passport')(app);

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


var indexRouter = require('./routes/index');
var authorRouter = require('./routes/author');
var authRouter = require('./routes/auth')(passport);

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