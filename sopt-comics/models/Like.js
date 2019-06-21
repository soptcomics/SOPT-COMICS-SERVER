const MSG = require('../modules/utils/responseMessage')
const CODE = require('../modules/utils/statusCode')
const Utils = require('../modules/utils/utils')
const errorMsg = require('../modules/utils/errorUtils')
const db = require('../modules/utils/pool')
const dbManager = require('../modules/utils/sqlManager')
const TABLE_LIKED = dbManager.TABLE_LIKED

module.exports = class Like {
    constructor(comicsIdx, userIdx) {
        this.comicsIdx = comicsIdx
        this.userIdx = userIdx
    }
    async insertLikes() {   
        const jsonData = {
            comicsIdx: this.comicsIdx,
            userIdx: this.userIdx
        }
        const result = await dbManager.db_insert(db.queryParam_Parse, TABLE_LIKED, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_LIKE_COMICS))
        }
        return result
    }
    static async selectLikes(jsonData) {
        const result = await dbManager.db_select(db.queryParam_Parse, TABLE_LIKED, jsonData)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_LIKE_COMICS))
        }
        return result
    }
    static async deleteLikes(jsonData) {
        const result = await dbManager.db_delete(db.queryParam_Parse, TABLE_LIKED, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_UNLIKE_COMICS))
        }
        return result
    }
}

