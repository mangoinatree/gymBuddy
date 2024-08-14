const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async(message, logFileName) => {
    const dateTime = format(new Date(), 'yyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        const logsPath = path.join(__dirname, '..', 'logs')
        // make path if does not exist 
        if (!fs.existsSync(logsPath)) {
            await fsPromises.mkdir(logsPath)
        }
        // create or append to existing file 
        await fsPromises.appendFile(path.join(logsPath, logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

const logger = (req, res, next) => {
    // this would get full very fast, logs every request 
    // origin undefined for localhost 
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    // moves on to the next middleware
    next()
}

module.exports = { logEvents , logger }