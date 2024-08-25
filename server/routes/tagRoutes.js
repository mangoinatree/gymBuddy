const express = require('express')
const router = express.Router()
const tagsController = require('../controllers/tagsController')

// CRUD operations 
router.route('/')
    .get(tagsController.getAllTags)
    .post(tagsController.createNewTag)
    .patch(tagsController.updateTag)
    .delete(tagsController.deleteTag)

module.exports = router 