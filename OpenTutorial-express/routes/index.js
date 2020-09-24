var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var template = require('../lib/template');

//get은 route, routing
router.get('/', (req, res) => {
    db.query('SELECT * FROM topic', function (error, topics) {
        if (error) throw error;
        var description = 'Hello, Node.js';
        var title = 'Welcome';
        var list = template.list(topics);

        var html = template.html(title, list, `<h2>${title}</h2>${description}
        <img src="/image/profile.jpg" style="width:200px; display:block; margin-top:10px;">`, `<a href="/page/create">create</a>`);
        res.send(html);

    });
});

module.exports = router;