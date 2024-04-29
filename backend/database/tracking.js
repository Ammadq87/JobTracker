const mysql = require('mysql')

require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: process.env.mysql_database
})

async function addJobApplication(job, uid) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Job VALUES (uuid(), ?, ?, ?, ?, ?, ?)`
        connection.query(query, [
            uid, job['Role'], job['Company'], job['Date_Applied'], job['Location'], 0  
        ], (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

module.exports = {addJobApplication}