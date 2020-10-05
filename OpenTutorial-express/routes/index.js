var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var template = require('../lib/template');
var auth = require('../lib/auth');


//get은 route, routing
router.get('/', (req, res) => {
    db.query('SELECT * FROM topic', function (error, topics) {
        //console.log('/', req.user);
        if (error) throw error;
        var description = 'Hello, Node.js';
        var title = 'Welcome';
        var list = template.list(topics);

        var html = template.html(title, list, `<h2>${title}</h2>
        ${description}
        `, `<a href="/page/create">create</a>`,
        auth.statusUI(req, res));
        res.send(html);

    });
});

module.exports = router;