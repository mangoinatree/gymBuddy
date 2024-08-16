const express = require('express')
const router = express.Router()
const quotesController = require('../controllers/quotesController')

// CRUD operations 
router.route('/')
    .get(quotesController.getAllQuotes)
    .post(quotesController.createNewQuote)
    .patch(quotesController.updateQuote)
    .delete(quotesController.deleteQuote)

module.exports = router 