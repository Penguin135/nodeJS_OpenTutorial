var http = require('http');
var fs = require('fs');
var url = require('url') // url 모듈을 사용한다

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(request.url, true).query;
  var title = queryData.id;
  console.log(queryData.id); // 쿼리 스트링 값 확인
  console.log(_url); // url 값 확인
  if (_url == '/') {
    //_url = '\\index.html';
    title = 'Welcome';
  }
  if (_url == '/favicon.ico') {
    response.writeHead(404);
    response.end();
    return;
  }
  response.writeHead(200);
  fs.readFile('data/' + queryData.id, 'utf8', function (err, description) {
    var template = `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ol>
        <li><a href="/?id=HTML">HTML</a></li>
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
      </ol>
      <h2>${title}</h2>
      <p>
        ${description}
      </p>
    </body>
    </html>    
    `;

    //response.end(fs.readFileSync(__dirname + url));
    response.end(template);
  });



});
app.listen(80);