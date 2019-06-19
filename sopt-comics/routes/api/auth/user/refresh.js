const express = require('express')
const router = express.Router()

const Utils = require('../../../../modules/utils/utils')
const CODE = require('../../../../modules/utils/statusCode')
const MSG = require('../../../../modules/utils/responseMessage')
const dbManager = require('../../../../modules/utils/dbManager')
const jwtUtils = require('../../../../modules/utils/jwt')
const authUtils = require('../../../../modules/utils/authUtils')

router.post('/', async (req, res) => {
    const inputToken = req.headers.token
    const inputRefreshToken = req.headers.refresh_token
    if(inputToken == undefined || inputRefreshToken == undefined){
        res.status(200).send(Utils.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
        return
    }
    const payload = jwtUtils.getPayload(inputToken)
    const resultJson = await dbManager.selectUser({userIdx: payload.userIdx})
    if(resultJson === undefined){
        res.status(200).send(Utils.successFalse(CODE.DB_ERROR, FAIL_MSG.READ_USER))
        return
    }
    if (resultJson == false) {
        res.status(200).send(Utils.successFalse(CODE.BAD_REQUEST, MSG.NO_USER))
        return
    }
    if (resultJson.refreshToken != inputRefreshToken){
        res.status(200).send(Utils.successFalse(CODE.BAD_REQUEST, MSG.INVALID_TOKEN))
        return
    }
    const newToken = jwtUtils.refresh(resultJson)
    res.status(200).send(Utils.successTrue(CODE.OK, MSG.REFRESH_TOKEN, {token : newToken}))
})

module.exports = router