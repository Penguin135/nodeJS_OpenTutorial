const db = require('./db');
const userdb = require('./userdb');
module.exports = function (app) {
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        if (user) {
            console.log('serializeUser', user);
            done(null, user.id);
        }
    });

    passport.deserializeUser(function (id, done) {
        console.log('deserializeUser', id);
        var user = userdb.get('users').find({id:id}).value();
        console.log(user);
        done(null, user);
    });

    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'pwd'
        },
        function (useremail, userpassword, done) {
            console.log('localStrategy', useremail, userpassword);
            var user = userdb.get('users').find({email:useremail, password:userpassword}).value();
            //db.get('topic').find({title:'lowddb'}).value()
            console.log('login user', user);
            if(user){
                return done(null,user, {
                    message: 'Welcom'
                });
            }else{
                return done(null, false, {
                    message: 'Incorrect user info'
                });
            }
        }
    ));
    return passport;
}