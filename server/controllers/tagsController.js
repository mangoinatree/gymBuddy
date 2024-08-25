const Tag = require('../models/Tag')
const asyncHandler = require('express-async-handler') // keeps us from using so many try catch blocks 

// @desc Get all tags 
// @route GET /tags
// @access Private 
const getAllTags = asyncHandler(async (req, res) => {
    const tags = await Tag.find().lean() //leans gives us doc w/o operations
    if (!tags?.length) { // checks if quotes exist before !length
        return res.status(400).json({ message: 'no tags found'})
    }
    res.json(tags)
})

// @desc Create new tags
// @route POST /tags
// @access Private 
const createNewTag = asyncHandler(async (req, res) => {
    const { name } = req.body

    //Confirming data
    if (!name) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const tagObject = { name }

    // Create and store new tag
    const tag = await Tag.create(tagObject)

    if (tag) { // created
        res.status(201).json( { message: `New tag created`})
    }else {
        res.status(400).json({ message: 'Invalid tag data recieved'})
    }
}) 

// @desc Update a tag
// @route PATCH /tag
// @access Private 
const updateTag = asyncHandler(async (req, res) => {
    const { id, name } = req.body 

    // Confirming data
    if(!name) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const tag = await Tag.findById(id).exec()
    if (!tag) {
        return res.status(400).json({ message: 'Tag not found'})
    } 
    tag.name = name
    const updatedTag = await tag.save()
    res.status(201).json( { message: `Tag updated`})
    
})

// @desc Delete a Tag
// @route DELETE /tag
// @access Private 
const deleteTag = asyncHandler(async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'Tag ID Required'})
    }

    const tag = await Tag.findById(id).exec()

    if(!tag) {
        return res.status(400).json({ message: 'Tag not found'})
    }
    const result = await tag.deleteOne()
    const reply = `Tag deleted`
    res.json(reply)
})

module.exports = {
    getAllTags,
    createNewTag,
    updateTag,
    deleteTag
}

