const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    userModel = require('../models/user');

passport.use(new LocalStrategy({
    usernameField : 'email',
    passwordField: 'password'
},
    function(email,password,done){
        userModel.findOne({
            email:email
        })
        .then(user=>{
            if(!user)
            return done(null,false,{message:"Email is not registered"});

            if(user.password === password)
            return done(null,user);
        })
        .catch((error)=>{console.log(error)});
    }));

passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
passport.deserializeUser(function(id, done) {
        userModel.findById(id, function(err, user) {
          done(err, user);
        });
      });