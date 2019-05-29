const express = require('express')
const router = express.Router()

const Utils = require('../../../../modules/utils/utils')
const CODE = require('../../../../modules/utils/statusCode')
const MSG = require('../../../../modules/utils/responseMessage')
const encryptionManager = require('../../../../modules/utils/encryptionManager')
const dbManager = require('../../../../modules/utils/dbManager')

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
router.post('/', async (req, res) => {
    const inputId = req.body.id
    const inputName = req.body.name
    const inputPwd = req.body.password
    if (inputId == undefined ||
        inputName == undefined ||
        inputPwd == undefined) {
        res.status(200).send(Utils.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
        return
    }
    const validCheck = await dbManager.selectUser(inputId)
    if (validCheck === false) {
        res.status(200).send(Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_USER))
        return
    }
    if (validCheck !== null) {
        res.status(200).send(Utils.successFalse(CODE.BAD_REQUEST, MSG.ALREADY_USER))
        return
    }
    const salt = await encryptionManager.makeRandomByte()
    const hashedPwd = await encryptionManager.encryption(inputPwd, salt)
    const jsonData = {
        id: inputId,
        name: inputName,
        password: hashedPwd,
        salt: salt
    }
    const result = await dbManager.insertUser(jsonData)
    if (!result) {
        console.log(result)
        res.status(200).send(Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_USER))
        return
    }
    res.status(200).send(Utils.successTrue(CODE.OK, MSG.CREATED_USER))
})

module.exports = router