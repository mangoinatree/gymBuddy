const Post = require('../models/Post')
const asyncHandler = require('express-async-handler') // keeps us from using so many try catch blocks


// @desc Get all posts 
// @route GET /posts
// @access Private 
const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().lean() //leans gives us doc w/o operations
    if (!posts?.length) { // checks if posts exist before !length
        return res.status(400).json({ message: 'no posts found'})
    }
    res.json(posts)
})

// @desc Create new post
// @route POST /posts
// @access Private 
const createNewPost = asyncHandler(async (req, res) => {
    const { title, body, tags } = req.body
    const file = req.file
    //Confirming data
    if (!title || !body || !tags) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const postObject = { title, body, tags: JSON.parse(tags), filePath: file ? `/images/${file.filename}` : null}

    // Create and store new post
    const post = await Post.create(postObject)

    if (post) { // created
        res.status(201).json( { message: `New post '${title}' created`})
    }else {
        res.status(400).json({ message: 'Invalid post data recieved'})
    }
}) 

// @desc Update a post
// @route PATCH /post
// @access Private 
const updatePost = asyncHandler(async (req, res) => {
    const { id, title, body, tags } = req.body 

    // Confirming data
    if(!title || !body || !tags || !Array.isArray(tags) || !tags.length) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const post = await Post.findById(id).exec()
    if (!post) {
        return res.status(400).json({ message: 'Post not found'})
    } 
    post.title = title
    post.body = body 
    post.tags = tags 

    const updatedPost = await post.save()
    res.status(201).json( { message: `Post "${updatedPost.title}" updated`})
    
})

// @desc Delete a post 
// @route DELETE /posts
// @access Private 
const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'Post ID Required'})
    }

    const post = await Post.findById(id).exec()

    if(!post) {
        return res.status(400).json({ message: 'Post not found'})
    }
    const result = await post.deleteOne()
    const reply = `Post '${post.title}' deleted`
    res.json(reply)
})

module.exports = {
    getAllPosts,
    createNewPost,
    updatePost,
    deletePost
}

