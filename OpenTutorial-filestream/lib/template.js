var template = {
    html : function (title, list, body, control, authStatusUI = `<a href='/login'>login</a>`) {
        return `
        <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      ${authStatusUI}
      <h1><a href="/">WEB</a></h1>
      <ol>
        ${list}
      </ol>
      ${control}
      ${body}
      </p>
    </body>
    </html>
    `;
    },
    list : function (filelist) {
        var list = '';
        filelist.forEach((file) => {
            list = list + `<li><a href="/?id=${file}">${file}</a></li>`;
        });
        return list;
    }
}
module.exports = template;