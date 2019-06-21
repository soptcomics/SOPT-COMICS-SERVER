const express = require('express')
const router = express.Router()

const authUtil = require('../../../../modules/utils/authUtils')
const UTILS = require('../../../../modules/utils/utils')
const CODE = require('../../../../modules/utils/statusCode')
const MSG = require('../../../../modules/utils/responseMessage')
const upload = require('../../../../config/multer')
const Comics = require('../../../../models/Comics')
const Like = require('../../../../models/Like')
const Episode = require('../../../../models/Episode')

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
            res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
            return
    }
    const result = await Comics.selectComicsAll(whereJson, orderBy)
    if(result.isError == true){
        res.status(200).send(result.jsonData)
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
    const existComics = await Comics.selectComics({comicsIdx: inputComicsIdx})
    if(existComics.isError == true){
        res.status(200).send(existComics.jsonData)
        return
    }
    const resultEpisodeArray = await Episode.selectEpisodeAll({
        comicsIdx: inputComicsIdx
    }, {
        episodeIdx: "DESC"
    })
    if (resultEpisodeArray.isError == true) {
        res.status(200).send(resultEpisodeArray.jsonData)
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
    const existLike = await Like.selectLikes(jsonData)
    if(existLike.isError == true){
        res.status(200).send(existLike.jsonData)
        return
    }
    const resultLiked = existLike != false
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
    const comics = new Comics(inputTitle, inputWriter, inputThumbnail)
    const result = comics.insertComics()
    if (result == false) {
        res.status(200).send(UTILS.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_COMICS))
        return
    }
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.CREATED_COMICS))
})

module.exports = router