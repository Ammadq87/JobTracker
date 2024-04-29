const db = require('../database/tracking')

/**
 * 
 * @param {JSON} job 
 * @param {string} uid
 */
async function manualJobApplication(job, uid) {
    try {
        job['Company'] = job['Company'].trim()
        job['Role'] = job['Role'].trim()
        // ToDo -- clean other fields like location 
    
        await db.addJobApplication(job, uid)
    } catch (e) {
        console.error(`Error: ${e}`)
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

module.exports = {manualJobApplication, getAllJobs}