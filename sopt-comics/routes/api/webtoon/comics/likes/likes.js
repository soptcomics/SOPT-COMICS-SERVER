const express = require('express')
const router = express.Router()

const authUtil = require('../../../../../modules/utils/authUtils')
const UTILS = require('../../../../../modules/utils/utils')
const CODE = require('../../../../../modules/utils/statusCode')
const MSG = require('../../../../../modules/utils/responseMessage')
const Like = require('../../../../../models/Like')
const User = require('../../../../../models/User')
const Comics = require('../../../../../models/Comics')

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
    const resultUser = await User.selectUser({userIdx: inputUserIdx})
    if (resultUser.isError == true) {
        res.status(200).send(resultUser.jsonData)
        return
    }
    const resultComics = await Comics.selectComics({comicsIdx: inputComicsIdx})
    if (resultComics.isError == true) {
        res.status(200).send(resultComics.jsonData)
        return
    }
    const jsonData = {
        comicsIdx: inputComicsIdx,
        userIdx: inputUserIdx
    }
    const existLike = await Like.selectLikes(jsonData)
    if(existLike.isError == true){
        res.status(200).send(existLike.jsonData)
        return
    }
    if(existLike.length > 0) {
        res.status(200).send(UTILS.successTrue(CODE.OK, MSG.ALREADY_LIKE_COMICS))
        return
    }
    const like = new Like(inputComicsIdx, inputUserIdx)
    const result = await like.insertLikes(jsonData)
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
    if (inputComicsIdx == undefined) {
            res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
            return
    }
    const existUser = await User.selectUser({userIdx: inputUserIdx})
    if (existUser.isError == true) {
        res.status(200).send(existUser.JsonData)
        return
    }
    const existComics = await Comics.selectComics({comicsIdx: inputComicsIdx})
    if (existComics.isError == true) {
        res.status(200).send(existComics.jsonData)
        return
    }
    const jsonData = {
        comicsIdx: inputComicsIdx,
        userIdx: inputUserIdx
    }
    const existLike = await Like.selectLikes(jsonData)
    if(existLike.isError == true){
        res.status(200).send(existLike.jsonData)
        return
    }
    if(existLike.length == 0) {
        res.status(200).send(UTILS.successTrue(CODE.OK, MSG.ALREADY_UNLIKE_COMICS))
        return
    }
    const result = await Like.deleteLikes(jsonData)
    if(result.isError == true){
        res.status(200).send(result.jsonData)
        return
    }
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.UNLIKE_COMICS))
})

module.exports = router