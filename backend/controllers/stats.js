const statsDAL = require('../database/stats')

class StatsController{

    /**
     * 
     * @param {string} uID 
     * @returns list of application status along with its count
     */
    static async getApplicationStats(uID) {
        try {
            const response = await statsDAL.getApplicationStats(uID)
            return response
        } catch (e) {
            console.error('err -- getApplicationStats failed...')
            console.error(e)
        }
        return []
    }
}

module.exports = StatsController