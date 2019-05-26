var express = require('express')
var router = express.Router({mergeParams: true})


/*
댓글 전체 읽기
METHOD      : GET
URL         : /webtoon/comics/episodes/:episodeIdx/comments
PARAMETER   : episodeIdx = Episode'sindex
*/
router.get('/', (req, res) => {
    const episodeIdx = req.params.episodeIdx
    res.status(200).send("/webtoon/comics/episodes/:episodeIdx/comments")
})

/*
댓글 쓰기
METHOD      : POST
URL         : /webtoon/comics/episodes/:idx/comments
BODY        : {

}
*/
router.post('/', (req, res) => {
    res.status(200).send("/webtoon/comics/episodes/:idx/comments")
})
module.exports = router
