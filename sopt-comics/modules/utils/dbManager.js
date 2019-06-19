const db = require('./pool')
const MSG = require('../../modules/utils/responseMessage')
const CODE = require('../utils/statusCode')
const Utils = require('../../modules/utils/utils')
const errorMsg = require('./errorUtils')
const TABLE_USER = 'user'
const TABLE_COMICS = 'comics'
const TABLE_EPISODE = 'episode'
const TABLE_COMMENT = 'comment'
const TABLE_LIKED = 'liked'

const convertWriteTime = (dateTime) => {
    return dateTime.replace(/-/g, ".")
}

const convertEpisode = (episodeData) => {
    return {
        episode_idx: episodeData.episodeIdx,
        title: episodeData.title,
        thumbnail: episodeData.thumbnail,
        hits: episodeData.hits,
        datetime: convertWriteTime(episodeData.writetime),
        image_url: episodeData.imageUrl
    }
}

const convertComics = (comicsData) => {
    return {
        comics_idx: comicsData.comicsIdx,
        title: comicsData.title,
        writer: comicsData.writer,
        likes: comicsData.likes,
        thumbnail: comicsData.thumbnail,
        datetime: convertWriteTime(comicsData.writetime),
        isfinished: comicsData.isFinished == 1
    }
}

const dbManager = {
    insertUser: async (jsonData) => {
        const result = await db_insert(TABLE_USER, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_USER))
        }
        return result
    },
    selectUser: async (whereJson) => {
        const result = await db_select(TABLE_USER, whereJson)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_USER))
        }
        if (result.length == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, MSG.NO_USER))
        }
        return result[0]
    },
    existUser: async (whereJson) => {
        const result = await db_select(TABLE_USER, whereJson)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_USER))
        }
        if (result.length != 0) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, MSG.ALREADY_USER))
        }
        return true
    },
    updateUserRefreshToken: async (refreshToken, userIdx) => {
        const result = await db_update(TABLE_USER, {
            refreshToken: refreshToken
        }, {
            userIdx: userIdx
        })
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, FAIL_MSG.READ_USER))
        }
        if (result.length == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, FAIL_MSG.READ_USER))
        }
        return result[0]
    },
    selectLikes: async (jsonData) => {
        const result = await db_select(TABLE_LIKED, jsonData)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_LIKE_COMICS))
        }
        return result
    },
    insertLikes: async (jsonData) => {
        const result = await db_insert(TABLE_LIKED, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_LIKE_COMICS))
        }
        return result
    },
    deleteLikes: async (jsonData) => {
        const result = await db_delete(TABLE_LIKED, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_UNLIKE_COMICS))
        }
        return result
    },
    insertComics: async (jsonData) => {
        const result = await db_insert(TABLE_COMICS, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_COMICS))
        }
        return result
    },
    selectComics: async (whereJson) => {
        const result = await db_select(TABLE_COMICS, whereJson)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_COMICS))
        }
        if (result.length == 0){   
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.NO_COMICS))
        }
        return convertComics(result[0])
    },
    selectComicsAll: async (whereJson, orderBy) => {
        const result = await db_select(TABLE_COMICS, whereJson, orderBy)
        if (result.length == undefined){
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_COMICS_ALL))
        }
        const convertedResult = []
        for (const i in result) {
            const comicsData = result[i]
            convertedResult.push(convertComics(comicsData))
        }
        return convertedResult
    },
    insertEpisode: async (jsonData) => {
        const result = await db_insert(TABLE_EPISODE, jsonData)
        if (!result){
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_EPISODE))
        }
        return result
    },
    selectEpisode: async (whereJson, orderBy) => {
        const result = await db_select(TABLE_EPISODE, whereJson, orderBy)
        if (result.length == undefined){
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_EPISODE_ALL))
        }
        if (result.length == 0){
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.NO_EPISODE))
        }
        return convertEpisode(result[0])
    },
    selectEpisodeAll: async (whereJson, orderBy) => {
        const result = await db_select(TABLE_EPISODE, whereJson, orderBy)
        if (result.length == undefined){
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_EPISODE_ALL))
        }
        const convertedResult = []
        for (const i in result) {
            const episodeData = result[i]
            convertedResult.push(convertEpisode(episodeData))
        }
        return convertedResult
    },
    insertComments: async (jsonData) => {
        const result = await db_insert(TABLE_COMMENT, jsonData)
        if (!result){
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_COMICS))
        }
        return result
    },
    selectCommentsAll: async (whereJson, orderBy) => {
        const result = await db_select(TABLE_COMMENT, whereJson, orderBy)
        if (result.length == undefined){
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
                datetime: convertWriteTime(comment.writetime),
                image_url_list: imageArray,
                episode_idx: comment.episodeIdx,
                user_idx: comment.userIdx
            })
        }
        return convertedResult
    }
}

function makeOrderByQuery(orderBy) {
    if (orderBy == undefined) return ""
    let orderByStr = "ORDER BY"
    for (let key in orderBy) {
        orderByStr = `${orderByStr} ${key} ${orderBy[key]}`
    }
    return orderByStr
}

function makeWhereQuery(whereJson) {
    if (whereJson == undefined) return ""
    let conditions = ""
    for (let key in whereJson) {
        const condition = `${key} = '${whereJson[key]}'`
        conditions = `${conditions} AND ${condition}`
    }
    whereStr = `WHERE ${conditions.substring(5)}`
    return whereStr
}

function makeConditions(whereJson) {
    let conditions = ""
    for (let key in whereJson) {
        const condition = `${key} = '${whereJson[key]}'`
        conditions = `${conditions},${condition}`
    }
    return conditions.substring(1)
}

function makeFields(fieldArr) {
    let fields = ""
    for (let i in fieldArr) {
        fields = fields + "," + fieldArr[i]
    }
    return fields.substring(1)
}

function makeFieldsValueQuery(jsonData) {
    const values = []
    let fields = ""
    let questions = ""
    for (let key in jsonData) {
        const column = key
        const value = jsonData[key]
        fields = fields + "," + column
        values.push(value)
        questions = questions + ",?"
    }
    return {
        fields: fields.substring(1),
        questions: questions.substring(1),
        values: values
    }
}

async function db_select(table, whereJson, orderBy) {
    let whereStr = makeWhereQuery(whereJson, ' AND ')
    let orderByStr = makeOrderByQuery(orderBy)
    const query = `SELECT * FROM ${table} ${whereStr} ${orderByStr}`
    console.log(query)
    const result = await db.queryParam_None(query)
    if (result == null) return false
    return result
}

async function db_insert(table, jsonData) {
    const resultQuery = makeFieldsValueQuery(jsonData)
    const values = resultQuery.values
    const fields = resultQuery.fields
    const questions = resultQuery.questions

    const query = `INSERT INTO ${table}(${fields}) values(${questions})`
    const result = await db.queryParam_Parse(query, values)
    if (result == null) return false
    return result
}

async function db_delete(table, whereJson) {
    let whereStr = makeWhereQuery(whereJson)
    const query = `DELETE FROM ${table} ${whereStr}`
    const result = await db.queryParam_None(query)
    if (result == null) return false
    return result
}

async function db_update(table, setJson, whereJson) {
    const setConditions = makeConditions(setJson)
    const whereStr = makeWhereQuery(whereJson)
    const query = `UPDATE ${table} SET ${setConditions} ${whereStr}`
    const result = await db.queryParam_None(query)
    if (result == null) return false
    return result
}

module.exports = dbManager