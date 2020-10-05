module.exports = function (app) {
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        if (user) {
            done(null, user.email);
        }
    });

    passport.deserializeUser(function (id, done) {
        const authData = {
            email: 'rudwns273@naver.com',
            password: '12345',
            nickname: 'rudwns'
        }
        done(null, authData);
    });

    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'pwd'
        },
        function (username, password, done) {
            const authData = {
                email: 'rudwns273@naver.com',
                password: '12345',
                nickname: 'rudwns'
            }
            if (username == authData.email) {
                if (password == authData.password) {
                    done(null, authData);
                } else {

                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
            } else {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
        }
    ));
    return passport;
}