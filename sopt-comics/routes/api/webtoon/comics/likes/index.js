var express = require('express')
var router = express.Router()

router.use('/', require('./likes'))

module.exports = router