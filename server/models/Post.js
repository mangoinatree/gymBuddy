const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        tags: [{
            type: String,
            required: true
        }],
        image: {
            type: String
        }
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('Post', postSchema)