'use strict'

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Post = require('../models/post');
const { route } = require('.');

// get posts of all users
router.get('/posts/all', (req, res)=>{
    Post.find({}).sort({updatedAt: 'desc'})
    .exec((err, found_posts)=>{
        if(err){
            console.log('Error in user/posts/all', err);
            return res.send(undefined);
        }
        if(!found_posts){
            console.log("Posts not found in user/posts/all");
            return res.send(undefined);
        }
        return res.send(found_posts);
    })
})

// create post

module.exports = router;