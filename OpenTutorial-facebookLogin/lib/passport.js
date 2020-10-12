const db = require('./db');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const saltRounds = 10;
module.exports = function (app) {
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        if (user) {
            console.log('serializeUser', user);
            done(null, user.id);
        }
    });

    passport.deserializeUser(function (id, done) {
        var user = db.get('users').find({ id: id }).value();
        done(null, user);
    });

    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'pwd'
        },
        function (useremail, userpassword, done) {
            var user = db.get('users').find({ email: useremail }).value();

            if (user) {
                bcrypt.compare(userpassword, user.password, function (err, res) {
                    if (res) {
                        return done(null, user, {
                            message: 'Welcom'
                        });
                    } else {
                        return done(null, false, {
                            message: 'Password is not correct'
                        });
                    }
                });

            } else {
                return done(null, false, {
                    message: 'Email is not correct'
                });
            }
        }
    ));

    var facebookCredential = require('../config/facebook.json');
    facebookCredential.profileFields = ['id', 'emails', 'name', 'displayName'];
    passport.use(new FacebookStrategy(facebookCredential,
        function (accessToken, refreshToken, profile, done) {
            console.log('facebook strategy', accessToken, refreshToken, profile);
            var email = profile.emails[0].value;
            var user = db.get('users').find({ email: email }).value();
            if (user) {
                user.facebookId = profile.id;
                db.get('users').find({email:email}).assign(user).write();
            } else {
                user = {
                    id: shortid.generate(),
                    email: email,
                    displayName: profile.displayName,
                    facebookId: profile.id
                }
                db.get('users').push(user).write();
            }
            done(null, user);
            // User.findOrCreate(..., function(err, user) {
            //   if (err) { return done(err); }
            //   done(null, user);
            // });
        }
    ));

    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));
    // app.get('/auth/facebook/callback',
    //     passport.authenticate('facebook', {
    //         successRedirect: '/',
    //         failureRedirect: '/auth/login'
    //     }));

    app.get('/auth/facebook/callback', function (req, res, next) {
        passport.authenticate('facebook', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.session.save(function () {
                    req.flash('message', info.message);
                    return req.session.save(function () {
                        res.redirect('/auth/login');
                    });
                });
            }
            req.logIn(user, function (err) {
                if (err) { return next(err); }
                req.session.save(function () {
                    res.redirect('/');
                    return;
                });
            });
        })(req, res, next);
    });
    return passport;
}