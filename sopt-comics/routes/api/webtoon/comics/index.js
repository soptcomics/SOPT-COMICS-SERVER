var express = require('express')
var router = express.Router()

router.use('/', require('./comics'))

module.exports = router