var express = require('express')
var router = express.Router({mergeParams: true})

router.use('/comics/episodes/:episodeIdx/comments', require('./comments'))
router.use('/comics/episodes', require('./episodes'))
router.use('/comics', require('./comics'))

module.exports = router
