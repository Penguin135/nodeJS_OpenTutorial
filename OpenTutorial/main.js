var http = require('http');
var fs = require('fs');
var url = require('url') // url 모듈을 사용한다

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(request.url, true).query;
  var pathname = url.parse(_url, true).pathname;

  // 루트 디렉토리 (/)로부터 존재하는 페이지를 요청하면 페이지 표시
  if (pathname === '/') {
    fs.readFile('data/' + queryData.id, 'utf8', function (err, description) {
      var title = queryData.id;
      if (queryData.id === undefined) { // 없는 값을 호출하려고 하면 javascript는 undefined라고 한다.(약속)
        title = 'Welcome';
        description = 'Hello, Node.js';
      }

      fs.readdir('./data', function (error, filelist) {
        var list = '<ul>';
        for(var i=0; i<filelist.length; i++){
          list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        }
        
        list = list + '</ul>';

        var template = `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <h2>${title}</h2>
          <p>
            ${description}
          </p>
        </body>
        </html>    
        `;

        //response.end(fs.readFileSync(__dirname + url));
        response.writeHead(200); // 200을 전송하면, 파일을 잘 전송했다고 하는 약속
        response.end(template);
      });
    });


  } else { // 없는 페이지를 요청하면 404 에러
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(80);