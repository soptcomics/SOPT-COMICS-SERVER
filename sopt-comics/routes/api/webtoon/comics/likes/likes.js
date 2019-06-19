const express = require('express')
const router = express.Router()

const authUtil = require('../../../../../modules/utils/authUtils')
const UTILS = require('../../../../../modules/utils/utils')
const CODE = require('../../../../../modules/utils/statusCode')
const MSG = require('../../../../../modules/utils/responseMessage')
const dbManager = require('../../../../../modules/utils/dbManager')

/*
좋아요
METHOD      : POST
URL         : /webtoon/comics/likes
BODY        : {
    "comics_idx" : "만화 id",
    "user_idx" : "유저 id"
}
*/
router.post('/', authUtil.isLoggedin, async (req, res) => {
    const inputComicsIdx = req.body.comics_idx
    const inputUserIdx = req.decoded.userIdx
    if (inputComicsIdx == undefined |
        inputUserIdx == undefined) {
            res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
            return
    }
    const existUser = await dbManager.selectUser({userIdx: inputUserIdx})
    if (existUser.isError == true) {
        res.status(200).send(existUser.jsonData)
        return
    }
    const existComics = await dbManager.selectComics({comicsIdx: inputComicsIdx})
    if (existComics.isError == true) {
        res.status(200).send(existComics.jsonData)
        return
    }
    const jsonData = {
        comicsIdx: inputComicsIdx,
        userIdx: inputUserIdx
    }
    const existLike = await dbManager.selectLikes(jsonData)
    if(existLike.isError == true){
        res.status(200).send(existLike.jsonData)
        return
    }
    if(existLike.length > 0) {
        res.status(200).send(UTILS.successTrue(CODE.OK, MSG.ALREADY_LIKE_COMICS))
        return
    }
    const result = await dbManager.insertLikes(jsonData)
    if(result.isError == true){
        res.status(200).send(result.jsonData)
        return
    }
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.LIKE_COMICS))
})

/*
좋아요 취소
METHOD      : POST
URL         : /webtoon/comics/likes
BODY        : {
    "comics_idx" : "만화 id",
    "user_idx" : "유저 id"
}
*/
router.delete('/', authUtil.isLoggedin, async (req, res) => {
    const inputComicsIdx = req.body.comics_idx
    const inputUserIdx = req.decoded.userIdx
    if (inputComicsIdx == undefined |
        inputUserIdx == undefined) {
            res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
            return
    }
    const existUser = await dbManager.selectUser({userIdx: inputUserIdx})
    if (existUser.isError == true) {
        res.status(200).send(existUser.JsonData)
        return
    }
    const existComics = await dbManager.selectComics({comicsIdx: inputComicsIdx})
    if (existComics.isError == true) {
        res.status(200).send(existComics.jsonData)
        return
    }
    const jsonData = {
        comicsIdx: inputComicsIdx,
        userIdx: inputUserIdx
    }
    const existLike = await dbManager.selectLikes(jsonData)
    if(existLike.isError == true){
        res.status(200).send(existLike.jsonData)
        return
    }
    if(existLike.length == 0) {
        res.status(200).send(UTILS.successTrue(CODE.OK, MSG.ALREADY_UNLIKE_COMICS))
        return
    }
    const result = await dbManager.deleteLikes(jsonData)
    if(result.isError == true){
        res.status(200).send(result.jsonData)
        return
    }
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.UNLIKE_COMICS))
})

module.exports = router