const MSG = require('../modules/utils/responseMessage')
const CODE = require('../modules/utils/statusCode')
const Utils = require('../modules/utils/utils')
const errorMsg = require('../modules/utils/errorUtils')
const db = require('../modules/utils/pool')
const dbManager = require('../modules/utils/sqlManager')
const TABLE_USER = dbManager.TABLE_USER

module.exports = class User {
    constructor(id, name, password, salt) {
        this.id = id
        this.name = name
        this.password = password
        this.salt = salt
    }
    async insertUser() {
        const jsonData = {
            id: this.id,
            name: this.name,
            password: this.password,
            salt: this.salt
        }
        const result = await dbManager.db_insert(db.queryParam_Parse, TABLE_USER, jsonData)
        if (!result) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_CREATED_USER))
        }
        return result
    }
    static async selectUser(whereJson) {
        const result = await dbManager.db_select(db.queryParam_Parse, TABLE_USER, whereJson)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_USER))
        }
        if (result.length == 0) {
            return new errorMsg(true, Utils.successFalse(CODE.BAD_REQUEST, MSG.NO_USER))
        }
        return result[0]
    }
    static async existUser (whereJson) {
        const result = await dbManager.db_select(db.queryParam_Parse, TABLE_USER, whereJson)
        if (result.length == undefined) {
            return new errorMsg(true, Utils.successFalse(CODE.DB_ERROR, MSG.FAIL_READ_USER))
        }
        return result.length != 0 ? true : false
    }
    static async updateUserRefreshToken(refreshToken, userIdx) {
        const result = await dbManager.db_update(db.queryParam_Parse, TABLE_USER, {
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
    } 
}