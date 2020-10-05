var http = require('http');
var cookie = require('cookie');

var app = http.createServer(function (request, response) {
    if (request.headers.cookie != undefined) {
        console.log(cookie.parse(request.headers.cookie));
    }
    // response.writeHead(200, {
    //     'Set-Cookie': ['yummy_cookie=choco', 
    //     'tasty_cooke=strawberry',
    //     `Permanent1=cookies; Expires=Wed, 21 Oct 2021 07:28:00`,
    //     `Permanent2=cookies; Max-Age=${60*60*24}`,
    //     `Secure-cookie=Secure-description; Secure`,
    //     `HttpOnly=HttpOnly; HttpOnly`,
    //     `Path=Path; Path=/cookie`,
    //     `Domain=Domain; Domain=mypage.com`]
    // });
    response.end('hello world');
});

app.listen(80);

