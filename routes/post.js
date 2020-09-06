'use strict'

const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');


const User = require('../models/user');
const Post = require('../models/post');
const { route, post } = require('.');


// Setup Multer---------------------
const storage = multer.diskStorage({
    diskStorage: './public/post_uploads',
    filename: function (req, file, callback) {
        callback(null, file.fieldname+'-'+Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage:storage,
    limits:{fileSize: 1000000 },
    fileFilter: function(req,file,callback){
        checkFileType(file,callback);
    }
}).single('post_image')

function checkFileType(file, callback){
    const filetype = /jpeg|jpg|png|gif/;
    const extname = filetype.test(path.extname(file.originalname).toLowerCase())
    const mimetype =filetype.test(file.mimetype)

    if(extname && mimetype){
        return callback(null,true)
    }
    else{
        callback('Error : Images only')
    }

}
//----------------------------------


// get posts of all users
router.get('/all', (req, res)=>{
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

// to create new post
router.post('/', (req, res)=>{
    let create_post = function(){
        Post.create({
            authorId: req.user._id,
            author: req.user.username,
            topic: req.body.topic,
            text: req.body.text,
            image: req.file.filename,
        }, function(err,created_post){
            if(err){
                console.log("Error while adding in /post/ ", err);
                return undefined;
            }
    
            if(created_post){
                console.log("post created successfully in /post");
                return docs;
            } else {
                console.log("Can not create /post/");
                return undefined;
            }
        })
    }

    if(req.body.post_image){
        upload(req,res,(err)=>{
            if(err){
                console.log("Error occured in /post/");
                return res.send(undefined);
            } else {
                if(req.file === undefined){
                    console.log("file not uploaded in /post/");
                    return res.send(undefined);
                } else {
                    console.log("Picture successfully uploaded");
                    let docs = create_post();
                    return res.send(docs);
                }
            }
        })
    }
    else{
        let docs = create_post();
        return res.send(docs);
    }
})

// incremnet like of a post
router.put('/likes', (req, res)=>{
    Post.findOneAndUpdate({
        _id: req.query.post._id
    },{
        $inc:{
            likes: 1
        }
    },{
        new:true
    }).exec((err, updated_post)=>{
        if(err){
            console.log("erron in update /like ", err);
            return res.send(undefined);
        }
        if(updated_post){
            return res.send(post);
        }
        console.log("No post found");
        return res.send(undefined);   
    })
})

// to add a new comment on post
router.post('/comments', (req, res)=>{
    Post.findOneAndUpdate({
        _id: req.body.post._id
    },{
        $addToSet:{
            comments:{
                text:req.body.comment.text,
                author: req.body.comment.username,
            }
        }
    },{
        new:true
    }).exec((err, updated_post)=>{
        if(err){
            console.log("erron in update /comment ", err);
            return res.send(undefined);
        }
        if(updated_post){
            return res.send(post);
        }
        console.log("No post found");
        return res.send(undefined);   
    })
})

// to increment like of a comment
router.put('/comments/likes', (req, res)=>{
    Post.findOneAndUpdate({
        _id: req.query.post._id,
        comments:{
            $elemMatch:{
                _id: req.query.comment._id
            }
        }
    },{
        $inc:{
            likes:1
        }
    },{
        new:true
    }).exec((err, updated_post)=>{
        if(err){
            console.log("erron in update /comment/like ", err);
            return res.send(undefined);
        }
        if(updated_post){
            return res.send(post);
        }
        console.log("No post commennt like found");
        return res.send(undefined);   
    })
})

// to add new reply on prev comment
router.post('/comments/reply', (req, res)=>{
    let update_query = {
        'comments.reply':{
            text: req.body.comment.text,
            author: req.body.comment.username,
        }
    }
    Post.findOneAndUpdate({
        _id: req.query.post._id,
        comments:{
            $elemMatch:{
                _id: req.query.comment._id
            }
        }
    },{
        $push: {update_query}
    },{
        new:true
    }).exec((err, updated_post)=>{
        if(err){
            console.log("erron in update /comment/reply ", err);
            return res.send(undefined);
        }
        if(updated_post){
            return res.send(post);
        }
        console.log("No post commennt reply found");
        return res.send(undefined);   
    })
})


module.exports = router;