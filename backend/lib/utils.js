const redis = require('./redis')

class Utils {
    static async getUID(req) {
        let uid = await redis.get(`sessionID:${req.session.SessID}`)
        uid = (JSON.parse(uid))['UserID']
        return uid
    }
}

module.exports = Utils
