var template = {
  html: function (title, list, body, control) {
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
  list: function (topics) {
    var list = '';
    topics.forEach((topic) => {
      list = list + `<li><a href="/?id=${topic.id}">${topic.title}</a></li>`;
    });
    return list;
  },
  author: function (authors, author_id) {
    var tag = ``;
    var selected = '';
    authors.forEach(author => {
      if (author_id === author.id) {
        selected = ' selected';
      }else{
        selected = '';
      }
      tag = tag + `<option value="${author.id}" ${selected}>${author.name}</option>\n`;
    });
    return `<select name="author">
                ${tag}
              </select>`;
  }
}
module.exports = template;