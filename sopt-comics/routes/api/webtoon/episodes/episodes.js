var express = require('express')
var router = express.Router()

/*
에피소드 보기
METHOD      : GET
URL         : /webtoon/comics/episodes/:idx
PARAMETER   : episodeIDx = episode's index
*/
router.get('/:idx', (req, res) => {
    // 1. 파라미터(idx) 체크 => 실패시 CODE: 400, MSG : OUT_OF_VALUE
    // 2. [DB]episode 가져오기 
    //      => 존재하지 않는 경우 CODE 400: MSG_NO_COMICS 
    //          실패시 CODE: 500, MSG: FAIL_
    // 3. DB에서 가져온 정보 가공하기
    // 4. 응답 보내기
    res.status(200).send("/webtoon/comics/episodes/:idx")
})

/*
에피소드 쓰기
METHOD      : POST
URL         : /webtoon/comics/episodes/
BODY        : {

}
*/
router.post('/', (req, res) => {
    res.status(200).send("[POST]/webtoon/comics/episodes")
})

/*
에피소드 수정하기
METHOD      : PUT
URL         : /webtoon/comics/episodes/
BODY        : {
    
}
*/
router.put('/', (req, res) => {
    res.status(200).send("[PUT]/webtoon/comics/episodes")
})


/*
에피소드 쓰기
METHOD      : DELETE
URL         : /webtoon/comics/episodes/
BODY        : {
    
}
*/
router.delete('/', (req, res) => {
    res.status(200).send("[DELETE]/webtoon/comics/episodes")
})
module.exports = router