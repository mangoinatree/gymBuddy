const User = require('../models/User')
const Post = require('../models/Post')
const asyncHandler = require('express-async-handler') // keeps us from using so many try catch blocks 
const bcrypt = require('bcrypt')

// @desc Get all users 
// @route GET /users
// @access Private 
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean() //leans gives us doc w/o operations
    if (!users?.length) { // checks if users exist before !length
        return res.status(400).json({ message: 'no users found'})
    }
    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private 
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    //Confirming data
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    // Check for duplicate
    // if you want to recieve a promise back use exec()
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Username not available'})
    }

    // Hash password
    const hashedpwd = await bcrypt.hash(password, 10) // salt rounds 
    const userObject = { username, "password": hashedpwd}

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { // created
        res.status(201).json( { message: `New user ${username} created`})
    }else {
        res.status(400).json({ message: 'Invalid user data recieved'})
    }
}) 

// @desc Update a user
// @route PATCH /users
// @access Private 
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, password } = req.body 

    // Confirming data , password optional
    if(!id || !username) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found'})
    } 
    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()
    // Allow updates to original user, _id is id created by mongoDB
    if (duplicate && duplicate?._id.toString !== id) {
        return res.status(409).json({ message: 'Username not available'})    
    }

    user.username = username
    // password not always required
    if(password) {
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()
    res.status(201).json( { message: `User ${updatedUser.username} updated`})
    
})

// @desc Delete a user 
// @route DELETE /users
// @access Private 
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({ message: 'User ID Required'})
    }

    // TODO: delete all posts related to user 

    const user = await User.findById(id).exec()

    if(!user) {
        return res.status(400).json({ message: 'User not found'})
    }
    const result = await user.deleteOne()
    const reply = `User '${user.username}' with ID ${user._id} deleted`
    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}

