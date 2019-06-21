const MSG = require('../modules/utils/responseMessage')
const CODE = require('../modules/utils/statusCode')
const Utils = require('../modules/utils/utils')
const errorMsg = require('../modules/utils/errorUtils')
const db = require('../modules/utils/pool')
const dbManager = require('../modules/utils/sqlManager')
const TABLE_COMICS = dbManager.TABLE_COMICS

const convertComics = (comicsData) => {
    return {
        comics_idx: comicsData.comicsIdx,
        title: comicsData.title,
        writer: comicsData.writer,
        likes: comicsData.likes,
        thumbnail: comicsData.thumbnail,
        datetime: comicsData.writetime.replace(/-/g, "."),
        isfinished: comicsData.isFinished == 1
    }
}

module.exports = class Comics {
    constructor(title, writer, thumbnail) {
        this.title = title
        this.writer = writer
        this.thumbnail = thumbnail
    }
    async insertComics() {
        const jsonData = {
            title: this.title,
            writer: this.writer,
            thumbnail: this.thumbnail
        }
        const result = await dbManager.db_insert(db.queryParam_Parse, TABLE_COMICS, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_COMICS))
        }
        return result
    }
    static async selectComics(whereJson) {
        const result = await dbManager.db_select(db.queryParam_Parse, TABLE_COMICS, whereJson)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_COMICS))
        }
        if (result.length == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.NO_COMICS))
        }
        return convertComics(result[0])
    }
    static async selectComicsAll(whereJson, orderBy) {
        const result = await dbManager.db_select(db.queryParam_Parse, TABLE_COMICS, whereJson, orderBy)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_COMICS_ALL))
        }
        return result.map(it => convertComics(it))
    }
}