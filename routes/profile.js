// API related to loggednIn user, fetch detail, change passowrd, update name, update name, get followers_post

'use strict'

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer  = require('multer');
const fs = require('fs');


const User = require('../models/user');
const Post = require('../models/post');

// Setup Multer---------------------
const storage = multer.diskStorage({
    diskStorage: './public/uploads',
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
}).single('pimage')

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

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        console.log('You are not logged in');
        let error = {
            message: 'You are not logged in',
            errorExist: true,
            loggedIn: false
        }
        res.send(error);
    }
}

router.get('/verify_user', (req,res)=>{
    if(req.user){
        return res.send(req.user);
    }
    return res.send(undefined);
})

// get detail of req.user.username
router.get('/detail', ensureAuthenticated, (req,res)=>{
    // console.log(req.user.username);
    User.findOne({
        username: req.user.username
    }, (err, found_user)=>{
        if(err){
            console.log('Error in user/details',err);
            let error = {
                message: "Something goes wrong please try again later",
                errorExist:true
            }
            return res.send(error);
        }
        if(!found_user){
            console.log("User not found in user/details");
            let error = {
                message: "User not found",
                errorExist:true
            }
            return res.send(error);
        }
        console.log(found_user);
        return res.send(found_user);
    })
})

// change password
router.put('/password', ensureAuthenticated, (req, res)=>{
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
        return res.send(updated_user);
    })
})

// to upload new profile image
router.put('/upload/pimage', ensureAuthenticated, (req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            console.log('error in /upload/image');
            return res.send(undefined);
        }
        else{
            if(req.file == undefined){
                return res.send(undefined);
            }
            else{
                if(req.user.pimage !== 'user.png'){
                    fs.unlink('./public/uploads/'+req.user.pimage , (err) => {
                        if (err){
                            console.log(err);
                            throw err;
                        }
                        console.log('The file has been deleted');
                    });
                }
                req.user.pimage = req.file.filename;
                User.findOneAndUpdate({"username" : req.user.username},{
                    $set:{
                        pimage: req.file.filename
                    }
                },{new:true},(err,updated_user)=>{
                    if(err){
                        console.log("Error Occured while uploading");
                        return res.send(undefined);
                    }
                    return res.send(req.file.filename);
                })
            }
        }
    })
})

// update name in profile section
router.put('/update', ensureAuthenticated, (req,res) =>{
    User.findOneAndUpdate({username:req.user.username},{
        $set:{
            name: req.body.name
        }
    }, {
        new: true
    }).exec((err, updated_user)=>{
        if(err){
            console.log("Error int /profile/profile_update");
            return res.send(undefined);
        }
        
        return res.send(updated_user);
    })
})

// get loggedIn user posts
router.get('/posts', ensureAuthenticated, (req,res)=>{
    Post.find({
        author: req.query.username
    }).exec((err, found_posts)=>{
        if(err){
            console.log('Error in user/posts', err);
            return res.send(undefined);
        }
        return res.send(found_posts);
    })
})

// get posts of user followed by curr user including himself
router.get('/posts/following', ensureAuthenticated, (req, res)=>{
    let followers = req.user.followings.map((followings) =>{
        return followings.followingPersonId
    })
    followers.push(req.user._id);
    
    Post.find({
        authorId:{
            $in: followers
        }
    }).exec((err, found_post)=>{
        if(err){
            console.log("Error in user/post/follower ", err);
            return res.send(undefined);
        }
        return res.send(found_post);
    })
})

// to follow new user
router.put('/follow/user', ensureAuthenticated, (req, res)=>{
    console.log(req.body.user, req.user.username)
    let update_query={
        followingPersonId: mongoose.Types.ObjectId(req.body.user._id),
        username: req.body.user.username
    }

    User.findOneAndUpdate({username:req.user.username},{
        $addToSet: {
            followings: update_query
        }
    },{
        new:true
    }).exec((err, updated_user)=>{
        if(err){
            console.log("Error in put /follow/user ", err);
            return res.send(undefined);
        }
        if(updated_user){
            console.log("updated works")
            User.findOneAndUpdate({
                username: req.body.user.username
            },{ 
                $addToSet:{
                    followers:{
                        follwerId: mongoose.Types.ObjectId(updated_user._id),
                        username: updated_user.username
                    }
                }
            },{
                new:true
            }).exec((err, final_opr_user)=>{
                if (err) {
                    console.log("Error in put /follow/user 2", err);
                    return res.send(undefined);
                }
                if(final_opr_user){
                    console.log(updated_user);
                    console.log(final_opr_user);
                    return res.send(updated_user);
                }
                console.log("Not found any user 2")
                return res.send(undefined);
            })
        }
        else{
            console.log("Not found any user 1");
            return res.send(undefined);
        }
    })
})

// to unfollow a user
router.put('/unfollow/user', ensureAuthenticated, (req, res)=>{
    let update_query={
        followingPersonId: mongoose.Types.ObjectId(req.body.user._id),
        username: req.body.user.username
    }

    User.findOneAndUpdate({
        username:req.user.username
    },{
        $pull:{
            followings:update_query
        }
    },{
        new:true
    }).exec((err, updated_user)=>{
        if(err){
            console.log("Error in put /unfollow/user ", err);
            return res.send(undefined);
        }
        if(updated_user){
            console.log("Update works")
            User.findOneAndUpdate({
                username: req.body.user.username
            },{
                $pull:{
                    followers: {
                        follwerId: mongoose.Types.ObjectId(updated_user._id),
                        username: updated_user.username
                    }
                }
            },{
                new:true
            }).exec((err, final_opr_user)=>{
                if (err) {
                    console.log("Error in put /unfollow/user 2", err);
                    return res.send(undefined);
                }
                if(final_opr_user){
                    console.log(updated_user);
                    console.log(final_opr_user);
                    return res.send(updated_user);
                }
                console.log("Not found any user unfollow 2")
                return res.send(undefined);
            })
        }
        else{
            console.log("Not found any user unfollow 1");
            return res.send(undefined);
        }
    })
})


module.exports = router;