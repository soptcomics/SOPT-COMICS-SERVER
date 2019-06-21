const express = require('express')
const router = express.Router()

const Utils = require('../../../../modules/utils/utils')
const CODE = require('../../../../modules/utils/statusCode')
const MSG = require('../../../../modules/utils/responseMessage')
const encryptionManager = require('../../../../modules/utils/encryptionManager')
const jwtUtils = require('../../../../modules/utils/jwt')
const sealUtils = require('../../../../modules/utils/errorUtils')
const User = require('../../../../models/User')

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
    const resultJson = await User.selectUser({id: inputId})
    if (resultJson.isError == true) {
        res.status(200).send(resultJson.jsonData)
        return
    }
    const hashedPwd = await encryptionManager.encryption(inputPwd, resultJson.salt)
    if (resultJson.password != hashedPwd) {
        res.status(200).send(Utils.successFalse(CODE.BAD_REQUEST, MSG.MISS_MATCH_PW))
        return
    }   
    const tokens = jwtUtils.sign(resultJson)
    const resultData = tokens
    const resultUpdate = User.updateUserRefreshToken(tokens.refresh_token, resultJson.userIdx)
    if (resultUpdate.isError == true) {
        res.status(200).send(resultData.jsonData)
        return
    }
    res.status(200).send(Utils.successTrue(CODE.OK, MSG.READ_USER, resultData))
    return
})

module.exports = router