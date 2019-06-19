const express = require('express')
const router = express.Router()

const authUtil = require('../../../../modules/utils/authUtils')
const UTILS = require('../../../../modules/utils/utils')
const CODE = require('../../../../modules/utils/statusCode')
const MSG = require('../../../../modules/utils/responseMessage')
const dbManager = require('../../../../modules/utils/dbManager')
const upload = require('../../../../config/multer')

const FLAG_LIKE = 0
const FLAG_RECENT = 1
const FLAG_FINISHED = 2

/*
메인화면 만화 목록
METHOD      : GET
URL         : /webtoon/comics/sort/:flag
PARAMETER   : 0 = 인기순(default), 1 = 최신순, 2 = 완결 목록
*/
router.get('/sort/:flag', async (req, res) => {
    const flag = req.params.flag
    let orderBy
    let whereJson
    switch(Number(flag)){
        case FLAG_LIKE:
            orderBy = {likes: 'DESC'}
            break
        case FLAG_RECENT:
            orderBy = {writetime: 'DESC'}
            break
        case FLAG_FINISHED:
            whereJson = {isFinished: 1}
            orderBy = {writetime: 'DESC'}
            break
        default:
            //파라미터(flag) 체크 => 실패시 CODE: 400, MSG : OUT_OF_VALUE
            res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
            return
    }
    const result = await dbManager.selectComicsAll(whereJson, orderBy)
    if(result === null){
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.NO_COMICS))
        return
    }
    if(result === false){
        res.status(200).send(UTILS.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_COMICS_ALL))
        return
    }
    const responseJson = result
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.READ_COMICS_ALL, responseJson))
})

/*
만화 상세 보기
METHOD      : GET
URL         : /webtoon/comics/:comicsIdx
PARAMETER   : comicsIdx = comics index
*/
router.get('/:comicsIdx', authUtil.checkToken, async (req, res) => {
    const inputComicsIdx = req.params.comicsIdx

    const decodedToken = req.decoded
    let inputUserIdx = decodedToken ? decodedToken.userIdx :  -1
    if (inputComicsIdx == undefined) {
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
        return
    }
    const resultCheckComicsIdx = await dbManager.selectComics({comicsIdx: inputComicsIdx})
    if(!resultCheckComicsIdx){
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.NO_COMICS))
        return
    }
    const resultEpisodeArray = await dbManager.selectEpisodeAll({
        comicsIdx: inputComicsIdx
    }, {
        episodeIdx: "DESC"
    })
    if (resultEpisodeArray === false) {
        res.status(200).send(UTILS.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_COMICS))
        return
    }
    if(inputUserIdx == -1){
        const responseJson = {
            liked: false,
            episode_list: resultEpisodeArray
        }
        res.status(200).send(UTILS.successTrue(CODE.OK, MSG.READ_COMICS_OFFLINE, responseJson))
        return
    }
    const jsonData = {
        comicsIdx: inputComicsIdx,
        userIdx: inputUserIdx
    }
    const validCheckLikes = await dbManager.selectLikes(jsonData)
    const resultLiked = validCheckLikes != false
    const responseJson = {
        liked: resultLiked,
        episode_list: resultEpisodeArray
    }
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.READ_COMICS, responseJson))
})

/*
만화 등록 하기
METHOD      : POST
URL         : /webtoon/comics
BODY        : {
    "title" : "만화 제목",
    "writer" : "작가 이름",
    "thumbnail" : "이미지 url"
}
*/
router.post('/', upload.single('thumbnail'), (req, res) => {
    const inputThumbnail = req.file.location
    if (inputThumbnail == undefined) {
        console.log(req.file)
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
        return
    }
    const inputTitle = req.body.title
    const inputWriter = req.body.writer
    if (inputTitle == undefined ||
        inputWriter == undefined) {
        console.log(req.body)
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
        return
    }
    const jsonData = {
        title: inputTitle,
        writer: inputWriter,
        thumbnail: inputThumbnail
    }
    const result = dbManager.insertComics(jsonData)
    if (result == false) {
        res.status(200).send(UTILS.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_COMICS))
        return
    }
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.CREATED_COMICS))
})

module.exports = router