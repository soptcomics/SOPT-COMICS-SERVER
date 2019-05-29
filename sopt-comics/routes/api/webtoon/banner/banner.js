const express = require('express')
const router = express.Router()

const UTILS = require('../../../../modules/utils/utils')
const CODE = require('../../../../modules/utils/statusCode')
const MSG = require('../../../../modules/utils/responseMessage')
const dbManager = require('../../../../modules/utils/dbManager')
const upload = require('../../../../config/multer')

/*
메인화면 배너 목록
METHOD      : GET
URL         : /webtoon/comics/banner
*/
router.get('/', async (req, res) => {
    const responseJson = {
        banner_list: ["https://ssl.pstatic.net/tveta/libs/1242/1242177/d668870c8d95508ddbe8_20190527134144766.jpg",
        "https://naverwebtoon-phinf.pstatic.net/20190318_46/1552904291818PgwKT_JPEG/upload_6930048587152288439.JPEG?type=p100",
        "https://ssl.pstatic.net/static/comic/images/bnr_partnership.jpg"]
    }
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.READ_BANNER, responseJson))
})

module.exports = router