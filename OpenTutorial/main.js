var http = require('http');
var fs = require('fs');
var url = require('url'); // url 모듈을 사용한다
var qs = require('querystring');
function templateFiles(filelist) {
  var list = '<ul>';
  for (var i = 0; i < filelist.length; i++) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
  }

  list = list + '</ul>';
  return list;
}

function templateHTML(title, list, body, control) {
  return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB2</a></h1>
      ${list}
      ${control}
      <h2>${title}</h2>
      ${body}
    </body>
    </html>    
  `;
}

// request = 요청할 때 웹브라우저가 보낸 정보, response = 응답할 때 우리가 웹브라우저에게 전송할 정보
var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(request.url, true).query;
  var pathname = url.parse(_url, true).pathname;
  console.log(pathname);
  // 루트 디렉토리 (/)로부터 존재하는 페이지를 요청하면 페이지 표시
  if (pathname === '/') {
    fs.readFile('data/' + queryData.id, 'utf8', function (err, description) {
      var title = queryData.id;
      if (queryData.id === undefined) { // 없는 값을 호출하려고 하면 javascript는 undefined라고 한다.(약속)
        title = 'Welcome';
        description = 'Hello, Node.js';

        fs.readdir('./data', function (error, filelist) {
          var list = templateFiles(filelist);
          var template = templateHTML(title, list, 
            `<p>${description}</p>`, 
            `<a href="/create">create</a>`
          );
  
          //response.end(fs.readFileSync(__dirname + url));
          response.writeHead(200); // 200을 전송하면, 파일을 잘 전송했다고 하는 약속
          response.end(template);
        });
      }else{
        fs.readdir('./data', function (error, filelist) {
          var list = templateFiles(filelist);
          var template = templateHTML(title, list, 
            `<p>${description}</p>`, 
            `<a href="/create">create</a> <a href="/update/?id=${title}">update</a>`
          );
  
          //response.end(fs.readFileSync(__dirname + url));
          response.writeHead(200); // 200을 전송하면, 파일을 잘 전송했다고 하는 약속
          response.end(template);
        });
      }

      
    });


  } else if (pathname === '/create') {
    fs.readdir('./data', function (error, filelist) {
      //response.end(fs.readFileSync(__dirname + url));
      var title = 'WEB- create';
      var list = templateFiles(filelist);

      var template = templateHTML(title, list, `
          <form action="http://localhost:80/create_process" method="POST">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,
        ' ');

      //response.end(fs.readFileSync(__dirname + url));
      response.writeHead(200); // 200을 전송하면, 파일을 잘 전송했다고 하는 약속
      response.end(template);
    });

  } else if(pathname === '/create_process'){
    var body='';
    //POST 방식으로 데이터를 보낼 때, 데이터가 한번에 너무 많으면, 특정한 양(조각)을 수신할 때마다 서버는 콜백 함수를 호출하도록 약속되어 있다.
    request.on('data', function(data){
      body=body+data; // 콜백이 실행될 때마다 데이터를 추가
      if(body.length > 1e6) request.connection.destroy(); // 데이터가 너~무 많으면 연결을 강제로 종료
    });

    //Data가 조각 조각 들어오다가 더이상 데이터가 않오면 이게 실행되고, 콜백 함수가 실행됨
    request.on('end', function(){
      //정보를 qs 모듈로 post라는 객체로 객체화
      var post = qs.parse(body); // 지금까지 저장한 body 데이터를 querystring 모듈의 parse를 사용하면 post데이터의 post 정보가 들어있다.
      var title = post.title;
      var description = post.description;

      // data 디렉토리에 title이름으로 된 description 내용의 파일 생성
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        // writehead의 200은 성공했다는 뜻, 302는 페이지를 다른곳으로 redirection하라는 뜻
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      });
    });

  } else { // 없는 페이지를 요청하면 404 에러
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(80);