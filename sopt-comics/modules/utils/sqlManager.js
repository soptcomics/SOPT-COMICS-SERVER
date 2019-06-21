const db = require('./pool')

const TABLE_USER = 'user'
const TABLE_COMICS = 'comics'
const TABLE_EPISODE = 'episode'
const TABLE_COMMENT = 'comment'
const TABLE_LIKED = 'liked'

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

const sqlManager = {
    db_select: async (func, table, whereJson, orderBy) => {
        let whereStr = makeWhereQuery(whereJson, ' AND ')
        let orderByStr = makeOrderByQuery(orderBy)
        const query = `SELECT * FROM ${table} ${whereStr} ${orderByStr}`
        const result = await func(query)
        if (result == null) return false
        return result
    },
    db_insert: async (func, table, jsonData) => {
        const resultQuery = makeFieldsValueQuery(jsonData)
        const values = resultQuery.values
        const fields = resultQuery.fields
        const questions = resultQuery.questions
        const query = `INSERT INTO ${table}(${fields}) values(${questions})`
        const result = await func(query, values)
        if (result == null) return false
        return result
    },
    db_delete: async (func, table, whereJson) => {
        let whereStr = makeWhereQuery(whereJson)
        const query = `DELETE FROM ${table} ${whereStr}`
        const result = await func(query)
        if (result == null) return false
        return result
    },
    db_update: async (func, table, setJson, whereJson) => {
        const setConditions = makeConditions(setJson)
        const whereStr = makeWhereQuery(whereJson)
        const query = `UPDATE ${table} SET ${setConditions} ${whereStr}`
        const result = await func(query)
        if (result == null) return false
        return result
    },
    TABLE_USER: TABLE_USER,
    TABLE_COMICS: TABLE_COMICS,
    TABLE_EPISODE: TABLE_EPISODE,
    TABLE_LIKED: TABLE_LIKED,
    TABLE_COMMENT, TABLE_COMMENT
}
module.exports = sqlManager