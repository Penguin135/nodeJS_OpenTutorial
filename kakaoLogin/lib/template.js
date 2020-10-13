var template = {
  html: function (title, list, body, control, authStatusUI=`<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>`) {
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
      <a href="/author">author</a>
      <ol>
        ${list}
      </ol>
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list: function (topics) {
    var list = '';
    topics.forEach((topic) => {
      list = list + `<li><a href="/page/${topic.id}">${topic.title}</a></li>`;
    });
    return list;
  },
  author: function (authors, author_id) {
    var tag = ``;
    var selected = '';
    authors.forEach(author => {
      if (author_id === author.id) {
        selected = ' selected';
      } else {
        selected = '';
      }
      tag = tag + `<option value="${author.id}" ${selected}>${author.name}</option>\n`;
    });
    return `<select name="author">
                ${tag}
              </select>`;
  },
  authorTable: function (authors) {
    var table = `<table border="1px" style="border-collapse: collapse;">
                <tr>
                    <td>이름</td>
                    <td>프로필</td>
                    <td>수정</td>
                    <td>삭제</td>`;
    authors.forEach(function (author) {
      table += `<tr>
                    <td>${author.name}</td>
                    <td>${author.profile}</td>
                    <td><a href="/author/update?id=${author.id}">update</a></td>
                    <td>
                      <form action="/author/delete_process" method="POST">
                        <input type="hidden" name="id" value="${author.id}">
                        <input type="submit" value="delete">
                      </form>
                    </td></tr>`
    });
    table += `</table>`;
    return table;
  }
}
module.exports = template;