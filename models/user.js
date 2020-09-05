const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username:{
        required:true,
        unique:true,
        type: String,
        trim: true
    },
    email:{
        required: true,
        type: String,
        unique: true,
        trim: true
    },
    name:{
        required:true,
        type: String,

    },
    password:{
        type:String,
        required:true
    },
    followers:[{
        follwerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    followings:[{
        followingPersonId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    posts:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Posts'
    }]
})

const User = mongoose.model('User', UserSchema);
module.exports = User;