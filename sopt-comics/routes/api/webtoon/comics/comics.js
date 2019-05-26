var express = require('express')
var router = express.Router()


/*
메인화면 만화 목록
METHOD      : GET
URL         : /webtoon/comics/sort/:flag
PARAMETER   : 0 = 인기순(default), 1 = 최신순, 2 = 완결 목록
*/
router.get('/sort/:flag' , (req, res) => {
    // 1. 파라미터(flag) 체크 => 실패시 CODE: 400, MSG : OUT_OF_VALUE
    // 2. DB에서 가져오기 => 실패시 CODE: 500, MSG: FAIL_
    // 3. DB에서 가져온 정보 가공하기
    // 4. 응답 보내기
    res.status(200).send("/webtoon/comics/sort/:flag")
})
/*
만화 상세 보기
METHOD      : GET
URL         : /webtoon/comics/:comicsIdx
PARAMETER   : comicsIdx = comics's index
*/
router.get('/:idx', (req, res) => {
    const comicsIdx = req.params.comicsIdx
    // 1. 파라미터(idx) 체크 => 실패시 CODE: 400, MSG : OUT_OF_VALUE
    // 2. DB에서 가져오기 
    //    a. comics 가져오기 
    //    b. comicsIdx로 episode 리스트 가져오기
    //      => 존재하지 않는 경우 CODE 400: MSG_NO_COMICS 
    //          실패시 CODE: 500, MSG: FAIL_
    // 3. DB에서 가져온 정보 가공하기
    // 4. 응답 보내기
    res.status(200).send("/webtoon/comics/:idx")
})

module.exports = router