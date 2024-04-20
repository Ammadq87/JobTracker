const mysql = require('mysql')

require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: process.env.mysql_database
})

async function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM User WHERE email = ? ';
        connection.query(query, [email], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function validateLogin(email, password) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS Found FROM User WHERE email = ? AND password = ?';
        connection.query(query, [email, password], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}


async function signUp(email, password, fullName) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO User VALUES (uuid(), ?, ?, ?)`;
        connection.query(query, [email, password, fullName], (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}


//#region Helper functions
async function isUnqiueEmail(email) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS Found FROM User WHERE email = ?';
        connection.query(query, [email], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

//#endregion

module.exports = {signUp, isUnqiueEmail, validateLogin, getUserByEmail}