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
            ref: 'User',
        },
        username:{
            type: String,
            default: ''
        }
    }],
    followings:[{
        followingPersonId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        username: {
            type: String,
            default: ''
        }
    }],
    posts:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Posts'
    }],
    pimage:{
        type:String,
        default: 'user.png'
    }
})

UserSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.validUserPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;