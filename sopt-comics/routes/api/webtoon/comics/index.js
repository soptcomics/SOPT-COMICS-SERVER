var express = require('express')
var router = express.Router()

router.use('/likes', require('./likes'))
router.use('/', require('./comics'))

module.exports = router