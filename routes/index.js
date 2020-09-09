'use strict'

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Post = require('../models/post');

const passport = require('../passport/passport-local');


router.post('/signup', (req, res) =>{
    // console.log(req.body.user);

    User.find({
        email:req.body.user.email,
        username: req.body.user.username
    }).exec((err, found_user)=>{
        if(err){
            console.log("error in /signup");
            let error = {
                message: 'Something goes wrong. Please try again Later',
                errorExist:true
            }
            return res.send(error);
        }
        if(found_user){
            console.log("Already exist detail in /signup");
            let error = {
                message: 'Username or email already exist.',
                errorExist: true
            }
            
            return res.send(error);
        }
        
        const newUser = new User()
        newUser.username= req.body.user.username,
        newUser.email= req.body.user.email,
        newUser.name= req.body.user.name,
        newUser.password= newUser.encryptPassword(req.body.user.password)

        User.create(newUser, (err, new_user)=>{
            if(err){
                console.log("error in /signup while creating");
                let error = {
                    message: 'Something goes wrong. Please try again Later',
                    errorExist: true
                }
                return res.send(error);
            }
            if(!new_user){
                let error = {
                    message: 'No User created',
                    errorExist: true
                }
                console.log("no user in /signup while creating")
                return res.send(error);
            }
            
            return res.send(new_user);
        })
    })
})

/*
app.get('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});
*/

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login/failure',
    successRedirect: '/login/success'
}));

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
})

router.get('/login/failure',(req,res)=>{
    console.log('Failed to Login');
    let error ={
        message: 'Invalid Username or Password',
        errorExist:true
    }
    res.send(error);
})

router.get('/login/success',(req,res)=>{
    console.log('Login Successful');
    res.send(req.user);
})

router.get('/logout', (req, res)=>{
    req.logOut();
    console.log("Logged Out Succefully");
    res.redirect('/login');
})

module.exports = router;