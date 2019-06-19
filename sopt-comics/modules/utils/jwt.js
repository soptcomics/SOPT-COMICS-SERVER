var randToken = require('rand-token')
const jwt = require('jsonwebtoken')
const secretKey = require('../../config/secret.key')
const dbManager = require('../../modules/utils/dbManager')
const secretOrPrivateKey = secretKey.secretOrPrivateKey
const options = secretKey.jwtOptions
const refreshOptions = secretKey.jwtRefreshOptions

module.exports = {
    sign: (user) => {
        const payload = {
            userIdx: user.userIdx,
            name: user.name
        }
        const result = {
            token: jwt.sign(payload, secretOrPrivateKey, options),
            refresh_token: randToken.uid(256) //발급받은 refreshToken은 반드시 디비에 저장해야 한다.
        }
        //refreshToken을 만들 때에도 다른 키를 쓰는게 좋다.
        //대부분 2주로 만든다.
        return result
    },
    verify: (token) => {
        let decoded;
        try {
            decoded = jwt.verify(token, secretOrPrivateKey);
        } catch (err) {
            if (err.message === 'jwt expired') {
                console.log('expired token');
                return this.TOKEN_EXPIRED;
            } else if (err.message === 'invalid token') {
                console.log('invalid token');
                return this.TOKEN_INVALID;
            } else {
                console.log("invalid token");
                return this.TOKEN_INVALID;
            }
        }
        return decoded;
    },
    getPayload: (token) => {
        const decoded = jwt.verify(token, secretOrPrivateKey,{ignoreExpiration: true})
        return decoded
    },
    refresh: (user) => {
        const payload = {
            userIdx: user.userIdx,
            name: user.name
        }
        return jwt.sign(payload, secretOrPrivateKey, options);
    },
    TOKEN_EXPIRED : -3,
    TOKEN_INVALID : -2,
};