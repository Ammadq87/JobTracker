const sql = require('../lib/mysql')

class DocsDAL {

    /**
     * 
     * @param {string} uID 
     * @param {string} name 
     * @returns 
     */
    static async doesCategoryExist(uID, name) {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT COUNT(*) AS Found FROM DocumentCategory dc 
            INNER JOIN User u ON dc.UserID = u.UserID
            WHERE u.UserID = ? and dc.Name = ?`
            sql.query(query, [uID, name], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            })
        })
    }

    /**
     * 
     * @param {string} uID 
     * @param {string} name 
     * @returns 
     */
    static async createNewCategory(uID, name) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO DocumentCategory VALUES (uuid(), ?, ?)`
            sql.query(query, [uID, name], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            })
        })
    }
}

module.exports = DocsDAL