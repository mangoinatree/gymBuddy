const mongoose = require('mongoose')

const quoteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
    }
})

module.exports = mongoose.model('Quote', quoteSchema)