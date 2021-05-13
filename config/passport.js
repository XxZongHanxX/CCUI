//load bcrypt
module.exports = function(passport, user) {
    var bCrypt = require('bcrypt-nodejs');
    //var mysql = require('mysql');
    var LocalStrategy = require('passport-local').Strategy;
    //serialize
    passport.serializeUser(function(user, done) {
        console.log("serializeUser");
        console.log(user);
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        console.log("deserializeUser");
        console.log(id);
        //var User = user;
        user.findOne({
            where: {
                'id': id
            }
        }).then(function(user){
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });
    //LOCAL SIGNIN
    passport.use('local-signin', new LocalStrategy(
    {
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'Student_ID',
        passwordField: 'Student_Password',
        passReqToCallback: true, // allows us to pass back the entire request to the callback
        // 關閉 session
        session: false
    },
    function(req, Student_ID, Student_Password, done) {
        var User = user;
        var isValidPassword = function(userpass, Student_Password) {
            return bCrypt.compareSync(Student_Password, userpass);
        }
        var isPasswordChange = function(userpass, Student_Password) {
            if (userpass!=Student_Password){
                return false;
            }
            else{
                return true;
            }
        }
        User.findOne({
            where: {
                'Student_ID': Student_ID
            }
        }).then(function(user) {
            if (!user) { 
                return done(null, false, {
                    message: 'Student_ID does not exist'
                });
            }
            if (user.Student_Change!=false){
                if (!isValidPassword(user.Student_Password, Student_Password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
            }
            else{
                if(!isPasswordChange(user.Student_Password, Student_Password)) {
                    return done(null,false, {
                        message: 'Incorrect password.'
                    });
                }
            }
            var userinfo = user.get();
            return done(null, userinfo);
        }).catch(function(err) {
            console.log("Error:", err);
            return done(null, false, {
                message: 'Something went wrong with your Signin'
            });
        });
    }));
}
