const sql = require('../lib/mysql')

class ProfileDAL {
    static async getMyProfile(uID) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM User u WHERE u.UserID = ?`
            sql.query(query, [uID], (error, results) => {
                if (error) {
                    reject(error)
                    return
                }
                resolve(results)
            })
        })
    }
}

module.exports = ProfileDAL