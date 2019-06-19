var express = require('express')
var router = express.Router({mergeParams: true})

router.use('/comics/episode/:episodeIdx/comments', require('./comment'))
router.use('/comics/episode', require('./episode'))
router.use('/comics', require('./comics'))
router.use('/banner', require('./banner'))

module.exports = router
