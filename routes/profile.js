'use strict'

const express = require('express');
const router = express.Router();
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

// change password
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

// to upload new profile image
router.post('/upload/pimage', (req,res)=>{
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
route.post('/profile_update', (req,res) =>{
    users.findOneAndUpdate({"username":req.user.username},{
        $set:{
            name: req.body.name
        }
    }, {
        new: true
    }, (err,updated_user)=>{
        if(err){
            console.log("Error int /profile/profile_update");
            return res.send(undefined);
        }
        
        return res.send(updated_user);
    })
})


module.exports = router;