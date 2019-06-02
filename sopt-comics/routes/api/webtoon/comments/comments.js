const express = require('express')
const router = express.Router({mergeParams: true})

const UTILS = require('../../../../modules/utils/utils')
const CODE = require('../../../../modules/utils/statusCode')
const MSG = require('../../../../modules/utils/responseMessage')
const dbManager = require('../../../../modules/utils/dbManager')
const upload = require('../../../../config/multer')

/*
댓글 전체 읽기
METHOD      : GET
URL         : /webtoon/comics/episodes/:episodeIdx/comments
PARAMETER   : episodeIdx = Episode'sindex
*/
router.get('/', (req, res) => {
    const episodeIdx = req.params.episodeIdx
    res.status(200).send("/webtoon/comics/episodes/:episodeIdx/comments")
})

/*
댓글 쓰기
METHOD      : POST
URL         : /webtoon/comics/episodes/:episode_idx/comments
BODY        : {
    "name": "이름", // nullable, 익명 댓글 이름
    "image1": "이미지1", //nullable
    "image2": "이미지2",
    "image3": "이미지3",
    "image4": "이미지4",
    "episode_idx": 1,
    "user_idx": 3 //nullable 
}
*/
router.post('/', upload.array('image'), async (req, res) => {
    const inputThumbnail = req.files[0].location  || undefined
    const inputImage1 = inputThumbnail
    const inputImage2 = req.files[1].location || null
    const inputImage3 = req.files[2].location || null
    const inputImage4 = req.files[3].location || null
    const inputUserIdx = req.body.user_idx || null
    let inputName = req.body.name
    const inputContent = req.body.content
    const inputEpisodeIdx = req.body.episode_idx 

    if (inputThumbnail == undefined) {
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
        return
    }
    if (req.files.length > 4) {
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, OUT_OF_IMAGE_LIMIT_4))
        return
    }
    if(!inputName && inputUserIdx) {
        const resultUser = await dbManager.selectUser({userIdx: inputUserIdx})
        inputName = resultUser.name
    }
    if (inputName == undefined ||
        inputContent == undefined ||
        inputEpisodeIdx == undefined) {
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, OUT_OF_VALUE))
        return
    }
    const jsonData = {
        name: inputName,
        content: inputContent,
        image1: inputImage1,
        image2: inputImage2,
        image3: inputImage3,
        image4: inputImage4,
        episodeIdx: inputEpisodeIdx,
        userIdx: inputUserIdx
    }
    const result = await dbManager.insertComments(jsonData)
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.CREATED_COMMENTS))
})
module.exports = router
