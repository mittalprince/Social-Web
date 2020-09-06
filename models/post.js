const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const PostSchema = new mongoose.Schema({
    authorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    author:{
        type: String,
        required: true
    },
    topic:{
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    },
    comments:[{
        text:{
            type: String,
        },
        replies:[{
            text:{
                type: String,
            },
            likes:{
                type: Number,
                default: 0
            },
            author:{
                type:String
            }
        }],
        likes:{
            type: Number,
            default: 0
        },
        author:{
            type:String
        }
    }],
    likes:{
        type: Number,
        default: 0
    },
    image:{
        type: String
    }
})

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;