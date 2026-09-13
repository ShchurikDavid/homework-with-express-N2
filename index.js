import express from 'express'
import moment from 'moment'

const app = express()

const HOST = 'localhost'
const PORT = 3000

app.get('/health', (req, res) => {
    res.status(200).json({
        "status": 'ok'
    })
})

app.get('/stats', (req, res) => {
    res.status(200).json({
        "uptime": Math.floor(process.uptime()),
        "nodeVersion": process.version,
        "timestamp": moment()

    })
})



app.listen(PORT,HOST, () => {
    console.log(`http://${HOST}:${PORT}`)
})