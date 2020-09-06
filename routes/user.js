// API related to general user, fetch detail, followers, following, posts, 

'use strict'

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Post = require('../models/post');
const { route } = require('.');

// get detail of req.query.username
router.get('/details', (req,res)=>{
    User.findOne({
        username: req.query.username
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

// get posts of req.query.username
router.get('/posts', (req,res)=>{
    Post.find({
        author: req.query.username
    }).exec((err, found_posts)=>{
        if(err){
            console.log('Error in user/posts', err);
            return res.send(undefined);
        }
        if(!found_posts){
            console.log("Posts not found in user/posts");
            return res.send(undefined);
        }
        return res.send(found_posts);
    })
})

// get followers of req.query.username
router.get('/followers', (req, res)=>{
    User.findOne({
        username: res.query.username
    }).populate('followers.follwerId')
    .exec((err, found_user)=>{
        if (err) {
            console.log('Error in user/followers', err);
            return res.send(undefined);
        }
        if (!found_user) {
            console.log("User not found in user/followers");
            return res.send(undefined);
        }
        return res.send(found_user);
    })
})

// get followings of req.query.username
router.get('/following', (req, res)=>{
    User.findOne({
        username: res.query.username
    }).populate('followings.followingPersonId')
    .exec((err, found_user)=>{
        if (err) {
            console.log('Error in user/following', err);
            return res.send(undefined);
        }
        if (!found_user) {
            console.log("User not found in user/following");
            return res.send(undefined);
        }
        return res.send(found_user);
    })
})

module.exports = router;