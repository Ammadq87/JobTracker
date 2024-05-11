const sql = require('../lib/mysql')
class TrackingDAL {
    static async addJobApplication(job, uid) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO Job VALUES (?, ?, ?, ?, ?, ?, ?)`
            sql.query(query, [
                job['JobID'], uid, job['Role'], job['Company'], job['DateApplied'], job['Location'], 0  
            ], (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }

    static async editJobApplication(job) {

        return new Promise((resolve, reject) => {
            const query = `UPDATE Job SET Company=?, DateApplied=?, Role=?, StatusID=? WHERE JobID=?`
            sql.query(query, [job['Company'], job['DateApplied'], job['Role'], parseInt(job['StatusID']), job['JobID']], 
                (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }

    static async getJobById(jobId) {
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
            sql.query(query, [jobId], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }

    static async getAllJobs(uid) {
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
            sql.query(query, [uid], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }

    static async deleteJobById(jobID) {
        return new Promise((resolve, reject) => {
            const query = `delete from Job where JobID = ?`
            sql.query(query, [jobID], (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }

}

module.exports = TrackingDAL