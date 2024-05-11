const Job = require('../../models/job')
const TrackingDAL = require('../database/tracking')
const redis = require('../lib/redis')
const uuid = require('uuid')

class TrackingController {

    /**
     * 
     * @param {JSON} job 
     * @param {string} uid
     */
    static async manualJobApplication(job, uid) {
        try {
            // Clean fields
            job['Company'] = job['Company'].trim()
            job['Role'] = job['Role'].trim()
            // ToDo -- clean other fields like location 

            const x = new Job()
            x.setStatus(job['StatusID'])
            x.setStatusID(job['StatusID'])

            // Update Job object
            const jobId = uuid.v4()
            job['JobID'] = jobId
            job['UserID'] = uid 
            job['Location'] = null
            job['StatusID'] = 0
            job['Status'] = 'Applied'
            
            if (!job['DateApplied'] || job['DateApplied'].length === 0)
                job['DateApplied'] = new Date()
            
            // Add to db
            await TrackingDAL.addJobApplication(job, uid)

            // update cache with new job
            const jobs = await this.getAllJobsFromCache(uid)
            jobs.push(job)
            redis.set(`Jobs:uID:${uid}`, new String(JSON.stringify(jobs)))
            redis.expire(`Jobs:uID:${uid}`, 3600)
        } catch (e) {
            console.error(`Error: ${e}`)
        }

        console.log(`log -- Added new job\n${JSON.stringify(job)}`)
    }

    static async editJobApplication(job, uid) {
        try {

            if (!job['DateApplied'] || job['DateApplied'].length === 0)
                job['DateApplied'] = new Date()

            // Update db
            await TrackingDAL.editJobApplication(job)

            const x = new Job()
            x.setStatus(parseInt(job.StatusID))

            // Update cache
            const jobs = await this.getAllJobsFromCache(uid)
            for (let i=0; i<jobs.length; i++) {
                if (job.JobID === jobs[i].JobID) {
                    jobs[i].Company = job.Company
                    jobs[i].Role = job.Role
                    jobs[i].DateApplied = job.DateApplied
                    jobs[i].StatusID = job.StatusID
                    jobs[i]['Status'] = x.Status;
                    break;
                }
            }

            redis.set(`Jobs:uID:${uid}`, new String(JSON.stringify(jobs)))
            redis.expire(`Jobs:uID:${uid}`, 3600)
            
        } catch (e) {
            console.error(e)
        }

        console.log(`log -- A job was edited\n${JSON.stringify(job)}`)
    }

    static async deleteJobById(jobID, uID) {
        try {
            await TrackingDAL.deleteJobById(jobID)

            // Update cache
            let jobs = await this.getAllJobsFromCache(uID)

            // Find job w ID
            let deleteIndex = -1
            for (let i=0; i<jobs.length; i++) {
                if (jobID === jobs[i].JobID) {
                    deleteIndex = i
                    break;
                }
            }

            if (deleteIndex === -1) { return }

            // Remove job
            const updatedJobs = [...jobs.slice(0, deleteIndex), ...jobs.slice(deleteIndex + 1)];
            await redis.set(`Jobs:uID:${uID}`, new String(JSON.stringify(updatedJobs)))
            redis.expire(`Jobs:uID:${uID}`, 3600)

        } catch (e) {
            console.error(e)
        }
    }

    static async getAllJobs(UserID) {
        try {
            const result = await TrackingDAL.getAllJobs(UserID)
            return {status: 200, data: result}
        } catch (e) {
            console.error(e)
        }
    }

    /**
     * gets all jobs based on userID
     * @returns array of JSON of jobs
     */
    static async getAllJobsFromCache(uid) {
        let jobs = await redis.get(`Jobs:uID:${uid}`)

        if (!jobs) {
            const result = await getAllJobs(uid)
            jobs = result ? result.data : []
            redis.set(`Jobs:uID:${uid}`, new String(JSON.stringify(jobs)))
            redis.expire(`Jobs:uID:${uid}`, 3600)
        } else {
            jobs = JSON.parse(jobs)
        }

        return jobs
    }
}

module.exports = TrackingController