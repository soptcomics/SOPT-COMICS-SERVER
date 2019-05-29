const express = require('express')
const router = express.Router()

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
router.post('/', async (req, res) => {
    const inputComicsIdx = req.body.comics_idx
    const inputUserIdx = req.body.user_idx
    if (inputComicsIdx == undefined |
        inputUserIdx == undefined) {
            res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
            return
    }
    const validCheckUser = await dbManager.selectUser({userIdx: inputUserIdx})
    if (validCheckUser === null) {
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.NO_USER))
        return
    }
    if (validCheckUser == false) {
        res.status(200).send(UTILS.successFalse(CODE.DB_ERROR, MSG.FAIL_LIKE_COMICS))
        return
    }
    const validCheckComics = await dbManager.selectComics({comicsIdx: inputComicsIdx})
    if (validCheckComics === null) {
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.NO_COMICS))
        return
    }
    if (validCheckComics == false) {
        console.log(validCheckComics)
        res.status(200).send(UTILS.successFalse(CODE.DB_ERROR, MSG.FAIL_LIKE_COMICS))
        return
    }
    const jsonData = {
        comicsIdx: inputComicsIdx,
        userIdx: inputUserIdx
    }
    const validCheckLikes = await dbManager.selectLikes(jsonData)
    if(validCheckLikes != false){
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.ALREADY_LIKE_COMICS))
        return
    }
    const result = await dbManager.insertLikes(jsonData)
    if(result == false){
        res.status(200).send(UTILS.successFalse(CODE.INTERNAL_SERVER_ERROR, MSG.FAIL_LIKE_COMICS))
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
router.delete('/', async (req, res) => {
    const inputComicsIdx = req.body.comics_idx
    const inputUserIdx = req.body.user_idx
    if (inputComicsIdx == undefined |
        inputUserIdx == undefined) {
            res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
            return
    }
    const validCheckUser = await dbManager.selectUser({userIdx: inputUserIdx})
    if (validCheckUser === null) {
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.NO_USER))
        return
    }
    if (validCheckUser == false) {
        res.status(200).send(UTILS.successFalse(CODE.DB_ERROR, MSG.FAIL_UNLIKE_COMICS))
        return
    }
    const validCheckComics = await dbManager.selectComics({comicsIdx: inputComicsIdx})
    if (validCheckComics === null) {
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.NO_COMICS))
        return
    }
    if (validCheckComics == false) {
        console.log(validCheckComics)
        res.status(200).send(UTILS.successFalse(CODE.DB_ERROR, MSG.FAIL_UNLIKE_COMICS))
        return
    }
    const jsonData = {
        comicsIdx: inputComicsIdx,
        userIdx: inputUserIdx
    }
    const validCheckLikes = await dbManager.selectLikes(jsonData)
    if(validCheckLikes == false){
        console.log(validCheckLikes)
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.ALREADY_UNLIKE_COMICS))
        return
    }
    const result = await dbManager.deleteLikes(jsonData)
    if(result == false){
        res.status(200).send(UTILS.successFalse(CODE.INTERNAL_SERVER_ERROR, MSG.FAIL_UNLIKE_COMICS))
        return
    }
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.UNLIKE_COMICS))
})

module.exports = router