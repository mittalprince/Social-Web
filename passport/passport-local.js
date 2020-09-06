'use strict'

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {// saved to session, req.session.passport.user = user_id
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
  User.findOne({
    username: username
  }).exec((err, user) =>{
    if(err || !user){
      return done(err || new Error("Np Such User Exist"));
    }
    // user -> user object attaches to the request as req.user
    return done(null, user);
  })
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username or such user exist' });
      }
      if (!user.validUserPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));