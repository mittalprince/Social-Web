'use strict'

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Post = require('../models/post');

// get detail of req.user.username
router.get('/', (req,res)=>{
    User.findOne({
        username: req.user.username
    }, (err, found_user)=>{
        if(err){
            console.log('Error in user/details',err);
            return res.send(undefined);
        }
        if(!found_user){
            console.log("User not found in user/details");
            return res.send(undefined);
        }
        return res.send(found_user);
    })
})

router.post('/password/change', (req, res)=>{
    let pass = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null);
    User.findOneAndUpdate({
        username: req.user.username
    },{
        $set:{
            password: pass
        }
    },{
        new: true
    }).exec((err, updated_user)=>{
        if(err){
            console.log('Error in password/change');
            return res.send(undefined);
        }
        if(!updated_user){
            console.log('No user found in password/change');
            return res.send(undefined);
        }
        return res.send(found_user);
    })
})


module.exports = router;