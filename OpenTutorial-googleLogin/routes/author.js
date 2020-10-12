var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var db = require('../lib/db');
var auth = require('../lib/auth');

router.get('/', (req, res) => {
    db.query('SELECT * FROM topic', function (error1, topics) {
        if (error1) throw error1;
        db.query('SELECT * FROM author', function (error2, authors) {
            if (error2) throw error2;
            var title = 'Authors';
            var list = template.list(topics);
            var description = '';
            var authorList = template.authorTable(authors);
            var html = template.html(title, list, `<h2>${title}</h2>`, authorList,auth.statusUI(req,res)
            );
            res.send(html);
        });
    });

});

module.exports=router;