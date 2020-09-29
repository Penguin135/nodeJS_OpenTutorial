const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const localStrategy = require("passport-local").Strategy;
const FileStore = require('session-file-store')(session);
const app = express();
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "pyh",
    store: new FileStore(),
    cookie: {
      httpOnly: true,
      secure: false
    }
  })
);

passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "pwd"
    },
    (email, pwd, done) => {
      const user = {
        email: "rudwns273@naver.com",
        pwd: "12345",
        nickname: "rudwns273"
      };

      if (email === user.email && pwd === user.pwd) {
        done(null, user);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('serial', user);
  done(null, user.email); //  user.id가 session(req.session.passport.user)에 저장됨
});

// 메모리에 한번만 저장
passport.deserializeUser((id, done) => {
  // 매개변수 id는 req.session.passport.user에 저장된 값
  console.log(id);
  done(null, id); // req.user에 idr값 저장
});

app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => {
  res.send(`
    
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - Login</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    <h2>Login</h2>
              <form action="/login_process" method='POST'>
                  <p>
                      <input type="text" name="email" placeholder="email">
                  </p>
                  <p>
                      <input type="password" name="pwd" placeholder="password">
                  </p>
                  <input type="submit" value="로그인">
              </form>
  </body>
  </html>
  `)
});

//passportConfig(passport);



// app.post("/login_process", (req, res, next) => {
//   passport.authenticate("local", (authError, User, info) => {
//     console.log('login_process user');

//     req.login(User, loginError => {
//       if (loginError) {
//         console.error(loginError);
//         return;
//       }
//       console.log('----12312456234', req.user);
//       req.session.save(function(){
//         res.redirect('/');
//       })
//     });
//   })(req, res, next);

//   // res.redirect("/success");
// });

app.post('/login_process',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    console.log(req.user);
    req.session.save(function(){
      console.log('success');
      res.redirect('/');
    })
  });

// app.post('/login_process',
//   passport.authenticate('local',{
//     successRedirect: '/',
//     failureRedirect: '/'
//   }));

app.get("/success", (req, res, next) => {
  res.send('success');
});
app.listen(3000, () => {
  console.log("server running on 3000port");
});
