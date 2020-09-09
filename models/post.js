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
            comment_reply_author: {
                username: String,
                user_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            },
            authors_like_reply: [mongoose.Schema.Types.ObjectId],

        }],
        likes:{
            type: Number,
            default: 0
        },
        comment_author:{
            username:String,
            user_id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        },
        authors_like_comment: [mongoose.Schema.Types.ObjectId],
    }],
    likes:{
        type: Number,
        default: 0
    },
    authors_like_post: [mongoose.Schema.Types.ObjectId],
    image:{
        type: String
    }
})

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;