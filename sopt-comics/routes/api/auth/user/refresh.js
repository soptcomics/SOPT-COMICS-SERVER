const express = require('express')
const router = express.Router()

const Utils = require('../../../../modules/utils/utils')
const CODE = require('../../../../modules/utils/statusCode')
const MSG = require('../../../../modules/utils/responseMessage')
const jwtUtils = require('../../../../modules/utils/jwt')
const authUtils = require('../../../../modules/utils/authUtils')
const User = require('../../../../models/User')

router.post('/', async (req, res) => {
    const inputToken = req.headers.token
    const inputRefreshToken = req.headers.refresh_token
    if(inputToken == undefined || inputRefreshToken == undefined){
        res.status(200).send(Utils.successFalse(CODE.BAD_REQUEST, MSG.EMPTY_TOKEN))
        return
    }
    const payload = await jwtUtils.getPayload(inputToken)
    console.log(payload)
    if(payload == jwtUtils.TOKEN_INVALID) {
        res.status(200).send(Utils.successFalse(CODE.BAD_REQUEST, MSG.INVALID_TOKEN))
        return
    }
    const resultJson = await User.selectUser({userIdx: payload.userIdx})
    if(resultJson.isError == true){
        res.status(200).send(resultJson.jsonData)
        return
    }
    if (!resultJson.refreshToken){
        res.status(200).send(Utils.successFalse(CODE.BAD_REQUEST, MSG.EMPTY_REFRESH_TOKEN))
        return
    }   
    if (resultJson.refreshToken != inputRefreshToken){
        res.status(200).send(Utils.successFalse(CODE.BAD_REQUEST, MSG.INVALID_REFRESH_TOKEN))
        return
    }
    const newToken = jwtUtils.refresh(resultJson)
    res.status(200).send(Utils.successTrue(CODE.OK, MSG.REFRESH_TOKEN, {token : newToken}))
})

module.exports = router