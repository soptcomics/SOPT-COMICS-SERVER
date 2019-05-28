const express = require('express')
const router = express.Router()

const UTILS = require('../../../../modules/utils/utils')
const CODE = require('../../../../modules/utils/statusCode')
const MSG = require('../../../../modules/utils/responseMessage')
const dbManager = require('../../../../modules/utils/dbManager')
const upload = require('../../../../config/multer')

const convertEpisodeJson = (json) => {
    let dateTime = json.writetime
    json.writetime = dateTime.replace(/-/g,".")
}
/*
NOTHING
METHOD      : GET
URL         : /webtoon/comics/episodes/
*/
router.get('/', (req, res) => {  
    res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
})
/*
에피소드 보기
METHOD      : GET
URL         : /webtoon/comics/episodes/:idx
PARAMETER   : episodeIDx = episode's index
*/
router.get('/:episodeIdx', async (req, res) => {
    const inputEpisodeIdx = req.params.episodeIdx
    // 1. 파라미터(idx) 체크 => 실패시 CODE: 400, MSG : OUT_OF_VALUE
    if (inputEpisodeIdx == undefined) {
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
        return
    }
    const result = await dbManager.selectEpisode({episodeIdx: inputEpisodeIdx})
    if(result == false) {
        res.status(200).send(UTILS.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_EPISODE))
        return
    }
    convertEpisodeJson(result)
    const responseJson = result
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.READ_EPISODE, responseJson))
})

/*
에피소드 쓰기
METHOD      : Multipart/form-data
URL         : /webtoon/comics/episodes/
BODY        : {
    "title" : "에피소드 제목",
    "comics_idx" : 4,
    "thumbnail" : "썸네일 주소",
    "imageUrl" : "만화 주소"
}
*/
router.post('/', upload.array('images'), async (req, res) => {
    console.log(req.files)
    if (req.files.length < 1) {
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
        return
    }
    const inputThumbnail = req.files[0].location
    const inputImages = req.files.splice(1)
    const inputImageUrl = inputImages[0].location
    if (inputThumbnail == undefined || inputImages == undefined) {
        console.log(req.files)
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
        return
    }
    const inputTitle = req.body.title
    const inputComicsIdx = req.body.comics_idx
    if (inputTitle == undefined || inputComicsIdx == undefined) {
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
        return
    }
    const jsonData = {
        title: inputTitle,
        comicsIdx: inputComicsIdx,
        thumbnail: inputThumbnail,
        imageUrl: inputImageUrl
    }
    const result = await dbManager.insertEpisode(jsonData)
    if(result == false) {
        console.log(result)
        res.status(200).send(UTILS.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_EPISODE))
        return
    }
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.CREATED_EPISODE))
})

/*
에피소드 수정하기
METHOD      : PUT
URL         : /webtoon/comics/episodes/
BODY        : {
    
}
*/
router.put('/', (req, res) => {
    res.status(200).send("[PUT]/webtoon/comics/episodes")
})


/*
에피소드 지우기
METHOD      : DELETE
URL         : /webtoon/comics/episodes/
BODY        : {
    
}
*/
router.delete('/', (req, res) => {
    res.status(200).send("[DELETE]/webtoon/comics/episodes")
})
module.exports = router