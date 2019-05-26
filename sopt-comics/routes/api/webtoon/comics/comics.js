const express = require('express')
const router = express.Router()

const UTILS = require('../../../../modules/utils/utils')
const CODE = require('../../../../modules/utils/statusCode')
const MSG = require('../../../../modules/utils/responseMessage')
const dbManager = require('../../../../modules/utils/dbManager')

/*
메인화면 만화 목록
METHOD      : GET
URL         : /webtoon/comics/sort/:flag
PARAMETER   : 0 = 인기순(default), 1 = 최신순, 2 = 완결 목록
*/
router.get('/sort/:flag', (req, res) => {
    const flag = req.params.flag
    console.log(flag)
    // 1. 파라미터(flag) 체크 => 실패시 CODE: 400, MSG : OUT_OF_VALUE
    if (!(flag >= 0 && flag <= 2)) {
        res.status(200).send(UTILS.successFalse(CODE.BAD_REQUEST, MSG.OUT_OF_VALUE))
        return
    }
    // 2. DB에서 가져오기 => 실패시 CODE: 500, MSG: FAIL_
    // 3. DB에서 가져온 정보 가공하기
    // 4. 응답 보내기

    const comicsListDummy = [
        [{
                "comics_idx": 4,
                "title": "대학일기",
                "writer": "자까",
                "likes": 997,
                "thumbnail": "https://shared-comic.pstatic.net/thumb/webtoon/679519/thumbnail/title_thumbnail_20160601180804_t83x90.jpg",
                "datetime": "2019.05.28 07:04:23",
                "isfinished": true
            },
            {
                "comics_idx": 2,
                "title": "돼지우리",
                "writer": "김칸비/천범식",
                "likes": 995,
                "thumbnail": "https://shared-comic.pstatic.net/thumb/webtoon/724854/thumbnail/thumbnail_IMAG10_828301ec-6d0c-4b1b-83d5-8c12b13575de.jpg",
                "datetime": "2019.04.01 20:00:43",
                "isfinished": false
            },
            {
                "comics_idx": 1,
                "title": "조의 영역",
                "writer": "조성",
                "likes": 994,
                "thumbnail": "https://shared-comic.pstatic.net/thumb/webtoon/697656/thumbnail/thumbnail_IMAG06_3318fd14-6fc0-4945-9f3a-378b43cc8955.jpg",
                "datetime": "2018.09.12 19:00:23",
                "isfinished": false
            },
            {
                "comics_idx": 3,
                "title": "약한영웅",
                "writer": "서패스/김진석",
                "likes": 990,
                "thumbnail": "https://shared-comic.pstatic.net/thumb/webtoon/710751/thumbnail/thumbnail_IMAG10_eed99ea4-5908-4445-b89a-d3881797f909.jpghttps://shared-comic.pstatic.net/thumb/webtoon/724854/thumbnail/thumbnail_IMAG10_828301ec-6d0c-4b1b-83d5-8c12b13575de.jpg",
                "datetime": "2019.05.26 07:04:23",
                "isfinished": false
            }
        ],
        //최신순
        [{
                "comics_idx": 4,
                "title": "대학일기",
                "writer": "자까",
                "likes": 997,
                "thumbnail": "https://shared-comic.pstatic.net/thumb/webtoon/679519/thumbnail/title_thumbnail_20160601180804_t83x90.jpg",
                "datetime": "2017.05.28 07:04:23",
                "isfinished": true
            },
            {
                "comics_idx": 1,
                "title": "조의 영역",
                "writer": "조성",
                "likes": 994,
                "thumbnail": "https://shared-comic.pstatic.net/thumb/webtoon/697656/thumbnail/thumbnail_IMAG06_3318fd14-6fc0-4945-9f3a-378b43cc8955.jpg",
                "datetime": "2018.09.12 19:00:23",
                "isfinished": false
            },
            {
                "comics_idx": 2,
                "title": "돼지우리",
                "writer": "김칸비/천범식",
                "likes": 995,
                "thumbnail": "https://shared-comic.pstatic.net/thumb/webtoon/724854/thumbnail/thumbnail_IMAG10_828301ec-6d0c-4b1b-83d5-8c12b13575de.jpg",
                "datetime": "2019.04.01 20:00:43",
                "isfinished": false
            },
            {
                "comics_idx": 3,
                "title": "약한영웅",
                "writer": "서패스/김진석",
                "likes": 990,
                "thumbnail": "https://shared-comic.pstatic.net/thumb/webtoon/710751/thumbnail/thumbnail_IMAG10_eed99ea4-5908-4445-b89a-d3881797f909.jpghttps://shared-comic.pstatic.net/thumb/webtoon/724854/thumbnail/thumbnail_IMAG10_828301ec-6d0c-4b1b-83d5-8c12b13575de.jpg",
                "datetime": "2019.05.26 07:04:23",
                "isfinished": false
            },
        ],
        //완결
        [{
            "comics_idx": 4,
            "title": "대학일기",
            "writer": "자까",
            "likes": 997,
            "thumbnail": "https://shared-comic.pstatic.net/thumb/webtoon/679519/thumbnail/title_thumbnail_20160601180804_t83x90.jpg",
            "datetime": "2017.05.28 07:04:23",
            "isfinished": true
        }]
    ]
    const responseJson = {
        "banner_list": ["https://image-comic.pstatic.net/webtoon/697656/thumbnail/thumbnail_IMAG02_adce99b6-2075-4250-bd6f-20eb7998dc15.jpg", "https://image-comic.pstatic.net/webtoon/724854/thumbnail/thumbnail_IMAG02_d1de1696-0e44-4270-b9d0-9fd09ebc6e6e.jpg",
            "https://image-comic.pstatic.net/webtoon/710751/thumbnail/thumbnail_IMAG02_45ab7791-bb2b-4be4-bd1c-468b21fe4dd2.jpg"
        ],
        "comics_list": comicsListDummy[flag]
    }
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.READ_COMICS_ALL, responseJson))
})
/*
만화 상세 보기
METHOD      : GET
URL         : /webtoon/comics/:comicsIdx
PARAMETER   : comicsIdx = comics's index
*/
router.get('/:comicsIdx', (req, res) => {
    const comicsIdx = req.params.comicsIdx
    // 1. 파라미터(idx) 체크 => 실패시 CODE: 400, MSG : OUT_OF_VALUE
    // 2. DB에서 가져오기 
    //    a. comics 가져오기 
    //    b. comicsIdx로 episode 리스트 가져오기
    //      => 존재하지 않는 경우 CODE 400: MSG_NO_COMICS 
    //          실패시 CODE: 500, MSG: FAIL_
    // 3. DB에서 가져온 정보 가공하기
    // 4. 응답 보내기

    const responseJson = {
        "liked": false,
        "episode_list": [{
                "episode_idx": 2,
                "title": "2화",
                "thumbnail": "https://shared-comic.pstatic.net/thumb/webtoon/724854/3/optimized_thumbnail_202x120_c1d16419-c3a8-419c-bf0c-4b9962a0187c.jpg",
                "hits": 700,
                "datetime": "2019.03.16 10:00:23"
            },
            {
                "episode_idx": 1,
                "title": "1화",
                "thumbnail": "https://shared-comic.pstatic.net/thumb/webtoon/724854/2/optimized_thumbnail_202x120_dd5205f0-d8c2-46c9-986f-d1d824ee66b4.jpg",
                "hits": 999,
                "datetime": "2019.03.09 10:00:23"
            },
            {
                "episode_idx": 1,
                "title": "프롤로그",
                "thumbnail": "https://shared-comic.pstatic.net/thumb/webtoon/724854/1/thumbnail_202x120_f8cde808-d1c9-4d77-aaa9-251464bb4554.jpg",
                "hits": 1024,
                "datetime": "2019.03.02 19:00:23"
            }
        ]
    }
    res.status(200).send(UTILS.successTrue(CODE.OK, MSG.READ_COMICS, responseJson))
})

module.exports = router