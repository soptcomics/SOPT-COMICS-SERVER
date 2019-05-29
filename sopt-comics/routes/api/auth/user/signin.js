const express = require('express')
const router = express.Router()

const Utils = require('../../../../modules/utils/utils')
const CODE = require('../../../../modules/utils/statusCode')
const MSG = require('../../../../modules/utils/responseMessage')
const encryptionManager = require('../../../../modules/utils/encryptionManager')
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
router.post('/', async (req, res) => {
    const inputId = req.body.id
    const inputPwd = req.body.password
    if (inputId == undefined) {
        res.status(200).send(Utils.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
        return
    }
    const resultJson = await dbManager.selectUser(inputId)
    if (resultJson === false) {
        res.status(200).send(Utils.successFalse(CODE.INTERNAL_SERVER_ERROR, FAIL_MSG.READ_USER))
        return
    }
    if (resultJson == undefined) {
        res.status(200).send(Utils.successFalse(CODE.BAD_REQUEST, MSG.NO_USER))
        return
    }
    const hashedPwd = await encryptionManager.encryption(inputPwd, resultJson.salt)
    console.log(hashedPwd)
    console.log(resultJson.password)
    if (resultJson.password != hashedPwd) {
        res.status(200).send(Utils.successFalse(CODE.BAD_REQUEST, MSG.MISS_MATCH_PW))
        return
    }
    const resultData = {
        user_idx: resultJson.userIdx
    }
    res.status(200).send(Utils.successTrue(CODE.OK, MSG.LOGIN_SUCCESS, resultData))
    return
})

module.exports = router