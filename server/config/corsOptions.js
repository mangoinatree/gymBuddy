const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        // !origin allows things like postman to work 
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true) // Allow the origin 
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions