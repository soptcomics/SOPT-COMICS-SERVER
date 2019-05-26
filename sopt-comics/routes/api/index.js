var express = require('express')
var router = express.Router()

router.use('/auth', require('./auth'))
router.use('/webtoon', require('./webtoon'))

module.exports = router
