const mysql = require('mysql');
const Job = require('../../models/job');

require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: process.env.mysql_database
})

async function addJobApplication(job, uid) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Job VALUES (?, ?, ?, ?, ?, ?, ?)`
        connection.query(query, [
            job['JobID'], uid, job['Role'], job['Company'], job['Date_Applied'], job['Location'], 0  
        ], (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

async function editJobApplication(job) {

    return new Promise((resolve, reject) => {
        const query = `UPDATE Job SET Company=?, DateApplied=?, Role=?, StatusID=? WHERE JobID=?`
        connection.query(query, [job['Company'], job['DateApplied'], job['Role'], parseInt(job['StatusID']), job['JobID']], 
            (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

async function getJobById(jobId) {
    return new Promise((resolve, reject) => {
        const query = `
        select JobID, UserID, Role, Company, DateApplied, Location, StatusID,
case
	when StatusID = 0 then 'Applied'
    when StatusID = 1 then 'Interview'
    when StatusID = 2 then 'Offer'
    when StatusID = 3 then 'Accepted'
    else 'Rejected'
end as Status from Job j WHERE j.jobID = ?`
        connection.query(query, [jobId], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
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

async function deleteJobById(jobID) {
    return new Promise((resolve, reject) => {
        const query = `delete from Job where JobID = ?`
        connection.query(query, [jobID], (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

module.exports = {addJobApplication, getAllJobs, editJobApplication, deleteJobById}