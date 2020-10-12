const db = require('./db');
const bcrypt = require('bcrypt');
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
        var user = db.get('users').find({id:id}).value();
        done(null, user);
    });

    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'pwd'
        },
        function (useremail, userpassword, done) {
            var user = db.get('users').find({email: useremail}).value();
        
            if(user){
                bcrypt.compare(userpassword, user.password, function(err, res){
                    if(res){
                        return done(null,user, {
                            message: 'Welcom'
                        });
                    }else{
                        return done(null, false, {
                            message: 'Password is not correct'
                        });
                    }
                });
                
            }else{
                return done(null, false, {
                    message: 'Email is not correct'
                });
            }
        }
    ));
    
    var facebookCredential = require('../config/facebook.json');
    passport.use(new FacebookStrategy(facebookCredential,
      function(accessToken, refreshToken, profile, done) {
        // User.findOrCreate(..., function(err, user) {
        //   if (err) { return done(err); }
        //   done(null, user);
        // });
      }
    ));
    return passport;
}