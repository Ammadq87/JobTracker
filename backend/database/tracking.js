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

async function getAllJobs(uid) {
    return new Promise((resolve, reject) => {
        const query = `
        select JobID, UserID, Role, Company, DateApplied, Location, StatusID,
case
	when StatusID = 0 then 'Applied'
    when StatusID = 1 then 'Interview'
    when StatusID = 2 then 'Offer'
    when StatusID = 3 then 'Accepted'
    else 'Rejected'
end as Status from Job j WHERE j.UserID = ?`
        connection.query(query, [uid], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

module.exports = {addJobApplication, getAllJobs}