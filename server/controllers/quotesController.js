const Quote = require('../models/Quote')
const asyncHandler = require('express-async-handler') // keeps us from using so many try catch blocks 

// @desc Get all quotes 
// @route GET /quotes
// @access Private 
const getAllQuotes = asyncHandler(async (req, res) => {
    const quotes = await Quote.find().lean() //leans gives us doc w/o operations
    if (!quotes?.length) { // checks if quotes exist before !length
        return res.status(400).json({ message: 'no quotes found'})
    }
    res.json(quotes)
})

// @desc Create new quote
// @route POST /quotes
// @access Private 
const createNewQuote = asyncHandler(async (req, res) => {
    const { text, author } = req.body

    //Confirming data
    if (!text || !author) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const quoteObject = { text, author}

    // Create and store new quote
    const quote = await Quote.create(quoteObject)

    if (quote) { // created
        res.status(201).json( { message: `New quote created`})
    }else {
        res.status(400).json({ message: 'Invalid quote data recieved'})
    }
}) 

// @desc Update a quote
// @route PATCH /quote
// @access Private 
const updateQuote = asyncHandler(async (req, res) => {
    const { text, author } = req.body 

    // Confirming data
    if(!text, !author) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const quote = await Post.findById(id).exec()
    if (!quote) {
        return res.status(400).json({ message: 'Quote not found'})
    } 
    quote.text = text
    quote.author = author

    const updatedQuote = await post.save()
    res.status(201).json( { message: `Quote updated`})
    
})

// @desc Delete a quote
// @route DELETE /quote
// @access Private 
const deleteQuote = asyncHandler(async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'Quote ID Required'})
    }

    const quote = await Quote.findById(id).exec()

    if(!quote) {
        return res.status(400).json({ message: 'Quote not found'})
    }
    const result = await quote.deleteOne()
    const reply = `Quote deleted`
    res.json(reply)
})

module.exports = {
    getAllQuotes,
    createNewQuote,
    updateQuote,
    deleteQuote
}

