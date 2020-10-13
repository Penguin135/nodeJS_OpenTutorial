const db = require('./db');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const saltRounds = 10;
module.exports = function (app) {
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var KakaoStrategy = require('passport-kakao').Strategy;
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

    var kakaoCredential = require('../config/kakao.json');

    passport.use(new KakaoStrategy(kakaoCredential,
      (accessToken, refreshToken, profile, done) => {
          console.log(profile._json.kakao_account.email);
          var email = profile._json.kakao_account.email;
          if(email){
            var user = db.get('users').find({email: email}).value();
            if(user){
                user.kakaoId = profile.id;
                db.get('users').find({email:email}).assign(user).write();
            }else{
                user = {
                    id:shortid.generate(),
                    email:email,
                    displayName: profile.displayName,
                    kakaoId: profile.id
                }
                db.get('users').push(user).write();
            }
            done(null, user);
          }else{
            req.session.save(function () {
                req.flash('message', 'Please agree email');
                return req.session.save(function () {
                    res.redirect('/auth/login');
                });
            });
          }
        // 사용자의 정보는 profile에 들어있다.
        // User.findOrCreate(..., (err, user) => {
        //   if (err) { return done(err) }
        //   return done(null, user)
        // })
      }
    ));

    app.get('/auth/kakao', passport.authenticate('kakao'));

    app.get('/auth/kakao/callback', function(req, res, next){
        console.log('/auth/kakao/callback');
        passport.authenticate('kakao', function(err, user, info){
            console.log('authenticate', user);
            if(err){
                return next(err);
            }
            if(!user){
                req.session.save(function(){
                    req.flash('message', info.message);
                    return req.session.save(function(){
                        res.redirect('/auth/login');
                    });
                });
            }
            req.login(user, function(err){
                if(err){
                    return next(err);
                }
                req.session.save(function(){
                    res.redirect('/');
                    return;
                })
            })
        })(req, res, next);
    });
    return passport;
}