'use strict'

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Post = require('../models/post');

const passport = require('../passport/passport-local');

router.post('/signup', (req, res) =>{
    User.findOne({
        $or:[
            {email:req.body.email},
            {username: req.body.username}
        ]
    }).exec((err, found_user)=>{
        if(err){
            console.log("error in /signup");
            return res.send(undefined);
        }
        if(found_user){
            console.log("Already exist detail in /signup");
            return res.send(undefined);
        }

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            name: req.body.name,
            password: newUser.encryptPassword(req.body.password)
        })

        User.create(newUser, (err, new_user)=>{
            if(err){
                console.log("error in /signup while creating");
                return res.send(undefined);
            }
            if(!new_user){
                console.log("no user in /signup while creating")
            }
            console.log(new_user);
            return res.send(new_user);
        })
    })
})


router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login/failure',
    successRedirect: '/login/success'
}));

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
})

router.get('/failure',(req,res)=>{
    console.log('Failed to Login');
    res.redirect('/login');
})

router.get('/success',(req,res)=>{
    console.log('Login Successful');
    res.redirect('/profile')
})


module.exports = router;