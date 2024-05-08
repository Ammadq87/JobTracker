const sql = require('../lib/mysql')

class AuthDAL {
    
    static async getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM User WHERE email = ? ';
            sql.query(query, [email], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }
    
    static async validateLogin(email, password) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) AS Found FROM User WHERE email = ? AND password = ?';
            sql.query(query, [email, password], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }
    
    static async signUp(email, password, fullName) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO User VALUES (uuid(), ?, ?, ?)`;
            sql.query(query, [email, password, fullName], (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }
    
    
    //#region Helper functions
    static async isUnqiueEmail(email) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) AS Found FROM User WHERE email = ?';
            sql.query(query, [email], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }
}

module.exports = AuthDAL