const express = require('express')
const router = express.Router()

const UTILS = require('../../../../modules/utils/utils')
const CODE = require('../../../../modules/utils/statusCode')
const MSG = require('../../../../modules/utils/responseMessage')
const dbManager = require('../../../../modules/utils/dbManager')

/*
로그인
METHOD      : POST
URL         : /auth/user/signin
BODY    : {
    "id" : "hello",
    "password" : "1234"
}
*/
router.post('/signin', (req, res) => {
    // 1. 파라미터 체크 => 실패시 CODE: 400, MSG : OUT_OF_VALUE
    // 2. id 체크 (존재하는 회원인지 확인)  => 실패시 CODE: 400, MSG : NO_USER_ID
    // 3. password 암호화 (암호 맞는지 확인)  => 실패시 CODE: 400, MSG : MISS_MATCH_PASSWORD
    // 4. 로그인 성공, userIdx 반환 
    const userIdx = 1
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.READ_USER, {user_idx: userIdx}))
})

/*
회원가입
METHOD      : POST
URL         : /auth/user/signup
BODY        : {
    "id" : "hello",
    "password" : "1234",
    "name" : "윤희성"
}
*/
router.post('/signup', (req, res) => {
    // 1. 파라미터 체크 => 실패시 CODE: 400, MSG : OUT_OF_VALUE
    // 2. id 체크 (존재하는 회원인지 확인)  => 실패시 CODE: 400, MSG : ALREADY_USER_ID
    // 3. password 암호화 (암호 맞는지 확인)  => 실패시 CODE: 400, MSG : MISS_MATCH_PASSWORD
    // 4. DB에 저장 => 실패시 CODE: 500, MSG: SIGN_UP_FAIL
    // 4. 회원가입 성공
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.CREATED_USER))
})

module.exports = router
