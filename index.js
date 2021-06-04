const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express()


const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({
    extended: false
}))

let secret = `theMostSecretStringYouWillEverSee`

app.post('/create-token', (req, res) => {
    const {
        firstName,
        lastName,
        id
    } = req.body
    if (!firstName || !lastName || !id) {
        return res.status(400).json({
            message: 'sorry must include firstName, lastName, & id field'
        })
    }
    jwt.sign(req.body, secret, {
        expiresIn: '60 mins'
    }, (err, token) => {
        if (err) return res.status(500).json({
            message: err.message
        })
        res.json({
            token
        })
    })
})

app.get('/decode-token', (req, res) => {
    if (!req.headers.authorization) return res.status(403).json({
        message: 'token required'
    })
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.status(500).json({
            message: err.message
        })
        res.json(decoded)
    })
})

app.listen(PORT, () => {
    console.log(`Server listening @ http://localhost:${PORT}`)
})