const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const PostSchema = new mongoose.Schema({
    authorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authoer:{
        type: String,
        required: true
    },
    topic:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    comments:[{
        text:{
            type: String,
            required: true
        },
        replies:[{
            text:{
                type: String,
                required: true
            },
            likes:{
                type: Number,
                default: 0
            }
        }],
        likes:{
            type: Number,
            default: 0
        }
    }],
    likes:{
        type: Number,
        default: 0
    }
})

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;