const db = require('../database/tracking')
const redis = require('../lib/redis')
const uuid = require('uuid')

/**
 * 
 * @param {JSON} job 
 * @param {string} uid
 */
async function manualJobApplication(job, uid) {
    try {
        // Clean fields
        job['Company'] = job['Company'].trim()
        job['Role'] = job['Role'].trim()
        // ToDo -- clean other fields like location 

        // Update Job object
        const jobId = uuid.v4()
        job['JobID'] = jobId
        job['UserID'] = uid 
        job['Location'] = null
        job['StatusID'] = 0
        job['Status'] = 'Applied'
        job['DateApplied'] = new Date()

        // Add to db
        await db.addJobApplication(job, uid)

        // update cache with new job
        const jobs = await getAllJobsFromCache(uid)
        jobs.push(job)
        redis.set(`Jobs:uID:${uid}`, new String(JSON.stringify(jobs)))
    } catch (e) {
        console.error(`Error: ${e}`)
    }
}

async function editJobApplication(job) {
    try {
        await db.editJobApplication(job)
    } catch (e) {
        console.error(e)
    }
}

async function getAllJobs(UserID) {
    try {
        const result = await db.getAllJobs(UserID)
        return {status: 200, data: result}
    } catch (e) {
        console.error(e)
    }
}

/**
 * gets all jobs based on userID
 * @returns array of JSON of jobs
 */
async function getAllJobsFromCache(uid) {
    let jobs = await redis.get(`Jobs:uID:${uid}`)

    if (!jobs) {
        console.log(`log == on get all jobs : cache miss`)
        const result = await applicationController.getAllJobs(uid)
        jobs = result ? result.data : []
        redis.set(`Jobs:uID:${uid}`, new String(JSON.stringify(jobs)))
    } else {
        console.log(`log == on get all jobs : cache hit`)
        jobs = JSON.parse(jobs)
    }

    return jobs
}

/**
 * 
 * @param {string} link 
 * @param {string} tags 
 */
function getJobInfo(link, tags) {
    let filters = sanitizeTags(tags)
    const role = parseLinkV2(link, filters)
    // const company = todo 

    const notFound = []
    if (role === '') notFound.push('Role')
    // if (company === '') notFound.push('Company')

    console.log(role)

    return {Role: role, Company: 'N/A', notFound: notFound}
}

/**
 * 
 * @param {string} link 
 * @param {string} filters 
 */
function parseLinkV2(link, filters = []) {
    link = link.replace(/%2f/gi, ' ')
    link = link.replace(/[^a-zA-Z]/g, ' '); // Replace any character that is not a letter with an empty string
    let words = link.trim().split(' ')
    words = words.filter((w) => {if (w !== '') return w})    
    
    let jobTitle = ''

    for (let i = 0; i < words.length; i++) {
        const word = words[i].toLowerCase()
        for (let j = 0; j < filters.length; j++) {
            const filter = filters[j].toLowerCase()
            if (word == filter || word.includes(filter)) {
                jobTitle += filter + ' '
            }
        }
    }

    return jobTitle

}

/**
 * ToDo -- values are hidden via ? and % symbols. need to isolate those
 * Parse job link and retreive job title 
 * @param {string} link 
 * @param {string[]} filters optional 
 * @returns Job Title 
*/
function parseLink(link, filters = []) {

    if (!link)
        return 'Link cannot be empty'

    const elements = link.split('/')

    if (filters.length === 0)
        return 'Error'

    for (let i = 0; i < elements.length; i++) {
        const e = elements[i].toLowerCase()
        if (e.includes('-')) {
            const arr = e.split('-')
            let jobTitle = ''

            for (let j = 0; j < arr.length; j++) {
                const a = arr[j].toLowerCase()
                
                for (let k = 0; k < filters.length; k++) {
                    const f = filters[k].toLowerCase()
                    if ((a === f || a.includes(f)) && !jobTitle.includes(a))
                        jobTitle += f + ' '
                }
                
            }

            // most likely the first hyphenated element is the jobTitle
            return jobTitle

        } else {
            filters.forEach((f, j) => {
                if (e.includes(f))
                    return e
            })
        }
    }
}


/**
 * Cleans the tags 
 * @param {string} tags 
 * @returns array of tags (string)
 */
function sanitizeTags(tags) {
    let input = tags.split(',')
    input = input.map((f) => {return f.trim()})
    return input;
}

module.exports = {manualJobApplication, getAllJobs, editJobApplication}