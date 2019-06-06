var express = require('express')
var router = express.Router()

router.use('/', require('./episode'))

module.exports = router
