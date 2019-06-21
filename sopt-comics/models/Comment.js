const MSG = require('../modules/utils/responseMessage')
const CODE = require('../modules/utils/statusCode')
const Utils = require('../modules/utils/utils')
const errorMsg = require('../modules/utils/errorUtils')
const db = require('../modules/utils/pool')
const dbManager = require('../modules/utils/sqlManager')
const TABLE_COMMENT = dbManager.TABLE_COMMENT

module.exports = class Comment {
    constructor(name, content, image1, image2, image3, image4, episodeIdx, userIdx) {
        this.name = name
        this.content = content
        this.image1 = image1
        this.image2 = image2
        this.image3 = image3
        this.image4 = image4
        this.episodeIdx = episodeIdx
        this.userIdx = userIdx
    }
    async insertComments() {
        const jsonData = {
            name: this.name,
            content: this.content,
            image1: this.image1,
            image2: this.image2,
            image3: this.image3,
            image4: this.image4,
            episodeIdx: this.episodeIdx,
            userIdx: this.userIdx
        }
        const result = await dbManager.db_insert(db.queryParam_Parse, TABLE_COMMENT, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_COMICS))
        }
        return result
    }
    static async selectCommentsAll(whereJson, orderBy) {
        const result = await dbManager.db_select(db.queryParam_Parse, TABLE_COMMENT, whereJson, orderBy)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_COMMENTS_ALL))
        }
        const convertedResult = []
        for (const comment of result) {
            const imageArray = []
            if (comment.image1) imageArray.push(comment.image1)
            if (comment.image2) imageArray.push(comment.image2)
            if (comment.image3) imageArray.push(comment.image3)
            if (comment.image4) imageArray.push(comment.image4)
            convertedResult.push({
                comment_idx: comment.commentIdx,
                name: comment.name,
                content: comment.content,
                datetime: comment.writetime.replace(/-/g, "."),
                image_url_list: imageArray,
                episode_idx: comment.episodeIdx,
                user_idx: comment.userIdx
            })
        }
        return convertedResult
    }
}