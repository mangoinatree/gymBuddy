const express = require('express')
const router = express.Router()
const path = require('path')

// if the requested slice is only a slash , /index ,or /index.html
// goes up out of the routes and into views
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html' ))
})

module.exports = router 