const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
    {
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
        filePath: {
            type: String
        }
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('Post', postSchema)