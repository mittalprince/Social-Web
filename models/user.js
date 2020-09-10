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
    followers:[{ // jo mereko follow karnge
        follwerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        username:{
            type: String,
            default: ''
        }
    }],
    followings:[{ // jinko mein follow karunga
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
        default: 'https://github.com/mittalprince/Social-Web/blob/master/public/images/user.jpg'
    },
    country:{
        type:String,
        default:'India'
    }
}, {
    timestamps:{
        createdAt: 'joined'
    }
});

UserSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.validUserPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;