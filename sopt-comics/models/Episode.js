const MSG = require('../modules/utils/responseMessage')
const CODE = require('../modules/utils/statusCode')
const Utils = require('../modules/utils/utils')
const errorMsg = require('../modules/utils/errorUtils')
const db = require('../modules/utils/pool')
const dbManager = require('../modules/utils/sqlManager')
const TABLE_EPISODE = dbManager.TABLE_EPISODE

const convertEpisode = (episodeData) => {
    return {
        episode_idx: episodeData.episodeIdx,
        title: episodeData.title,
        thumbnail: episodeData.thumbnail,
        hits: episodeData.hits,
        datetime: episodeData.writetime.replace(/-/g, "."),
        image_url: episodeData.imageUrl
    }
}

module.exports = class Episode {
    constructor(title, comicsIdx, thumbnail, imageUrl) {
        this.title = title
        this.comicsIdx = comicsIdx
        this.thumbnail = thumbnail
        this.imageUrl = imageUrl
    }
    async insertEpisode() {     
        const jsonData = {
            title: this.title,
            comicsIdx: this.comicsIdx,
            thumbnail: this.thumbnail,
            imageUrl: this.imageUrl
        }
        const result = await dbManager.db_insert(db.queryParam_Parse, TABLE_EPISODE, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_EPISODE))
        }
        return result
    }
    static async selectEpisode(whereJson, orderBy) {
        const result = await dbManager.db_select(db.queryParam_Parse,TABLE_EPISODE, whereJson, orderBy)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_EPISODE_ALL))
        }
        if (result.length == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.NO_EPISODE))
        }
        return convertEpisode(result[0])
    }
    static async selectEpisodeAll(whereJson, orderBy) {
        const result = await dbManager.db_select(db.queryParam_Parse,TABLE_EPISODE, whereJson, orderBy)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_EPISODE_ALL))
        }
        return result.map(it => convertEpisode(it))
    }
}