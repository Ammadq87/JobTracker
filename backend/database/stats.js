const sql = require('../lib/mysql')

class StatsDatabase {

    static async getApplicationStats(uID) {
        const query = `select 
            count(*) as Total, j.StatusID, case
                when StatusID = 0 then 'Applied'
                when StatusID = 1 then 'Interview'
                when StatusID = 2 then 'Offer'
                when StatusID = 3 then 'Accepted'
                else 'Rejected'
            end as Status
            from job j
            where j.UserID = ?
            group by j.StatusID
            order by j.StatusID`


        return new Promise((resolve, reject) => {
            sql.query(query, [uID], (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }
}

module.exports = StatsDatabase