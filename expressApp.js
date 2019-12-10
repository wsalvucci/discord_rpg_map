const express = require('express')
const app = express()
var cors = require('cors')

app.use(cors())

app.listen(5000)

module.exports = app