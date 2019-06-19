var express = require('express')
var router = express.Router()
const authUtil = require('../../../../../modules/utils/authUtils')

router.use('/', require('./likes'))

module.exports = router