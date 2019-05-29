const db = require('./pool')
const MSG = require('../../modules/utils/responseMessage')

const TABLE_USER = 'user'
const TABLE_COMICS = 'comics'
const TABLE_EPISODE = 'episode'
const TABLE_COMMENT = 'comment'
const TABLE_LIKED = 'liked'

const dbManager = {
    insertUser: async (jsonData) => {
        const result = await db_insert(TABLE_USER, jsonData)
        return result
    },
    selectUser: async (whereJson) => {
        const result = await db_select(TABLE_USER, whereJson)
        if (result.length == undefined) return false
        if (result.length == 0) return null
        if (result == null) return false
        return result[0]
    },
    selectLikes: async (jsonData) => {
        const result = await db_select(TABLE_LIKED, jsonData)
        return result
    },
    insertLikes: async (jsonData) => {
        const result = await db_insert(TABLE_LIKED, jsonData)
        return result
    },
    deleteLikes: async (jsonData) => {
        const result = await db_delete(TABLE_LIKED, jsonData)
        return result
    },
    insertComics: async (jsonData) => {
        const result = await db_insert(TABLE_COMICS, jsonData)
        return result
    },
    selectComics: async (whereJson) => {
        const result = await db_select(TABLE_COMICS, whereJson)
        if (result.length == undefined) return false
        if (result.length == 0) return null
        return result[0]
    },
    selectComicsAll: async (whereJson, orderBy) => {
        const result = await db_select(TABLE_COMICS, whereJson, orderBy)
        return result
    },
    insertEpisode: async (jsonData) => {
        const result = await db_insert(TABLE_EPISODE, jsonData)
        return result
    },
    selectEpisode: async (whereJson, orderBy) => {
        const result = await db_select(TABLE_EPISODE, whereJson, orderBy)
        if (result.length == 0) return null
        return result[0]
    },
    selectEpisodeAll: async (whereJson, orderBy) => {
        const result = await db_select(TABLE_EPISODE, whereJson, orderBy)
        return result
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