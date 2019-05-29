var express = require('express')
var router = express.Router()

router.use('/', require('./banner'))

module.exports = router