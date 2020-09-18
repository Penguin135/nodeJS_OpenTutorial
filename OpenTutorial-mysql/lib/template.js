var template = {
    html : function (title, list, body, control) {
        return `
        <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
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