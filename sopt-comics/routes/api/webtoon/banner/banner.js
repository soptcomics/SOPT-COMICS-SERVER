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
    const responseJson = [{
        image_url: "https://novel-phinf.pstatic.net/20190204_63/novel_1549247832193trLMN_JPEG/EC9BB9EC868CEC84A4_PC_697X320.jpg?type=q90",
        href: "https://novel.naver.com/webnovel/list.nhn?novelId=734365"
    },
    {
        image_url: "https://novel-phinf.pstatic.net/20190501_253/novel_1556639778714jSLS6_PNG/pc_home_697x320.png?type=q90",
        href: "https://comic.naver.com/contest/greatest/webnovel.nhn"
    },
    {
        image_url: "https://novel-phinf.pstatic.net/20181003_85/novel_1538495904509CxNwO_JPEG/EC9BB9EC868CEC84A4_PC_697X320.jpg?type=q90",
        href: "https://novel.naver.com/webnovel/list.nhn?novelId=759176"
    }]
    
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.READ_BANNER, responseJson))
})

module.exports = router