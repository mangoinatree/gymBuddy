require('dotenv').config() // uses it in all the files 
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const multer = require('multer')
const postsController = require('./controllers/postsController')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV) // logs environment

connectDB()

app.use(logger)

app.use(cors(corsOptions))
// built-in middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
//third- party middleware
app.use(cookieParser())

// Set up Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Handle file uploads with post creation
app.post('/posts', upload.single('file'), postsController.createNewPost)

// __dirname looks inside of the folder we are in
// where to find static files  
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/posts', require('./routes/postRoutes'))
app.use('/quotes', require('./routes/quoteRoutes'))
app.use('/tags', require('./routes/tagRoutes'))

// everything that reaches here, catch all 
app.all('*', (req, res)=>{
    res.status(404)
    if (req.accepts('html')) {~
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found'})
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', ()=> {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
}
)
