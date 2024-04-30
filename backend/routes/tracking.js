const express = require('express')
const router = express()
const redis = require('../lib/redis')

const applicationController = require('../controllers/tracking')

router.get('/', async (req, res) => {
    const uid = req.session?.user?.UserID
    const jobs = await getAllJobs(uid)
    console.log(jobs)
    res.render('tracking', {jobs: jobs})
})

router.post('/edit', async (req, res) => {
    await applicationController.editJobApplication(req.body)
    const uid = req.session?.user?.UserID
    let jobs = await redis.get(`Jobs:uID:${uid}`)
    if (jobs) {
        console.log('log == on edit : cache hit')
        jobs = JSON.parse(jobs)
        
    }

    // const jobs = await getAllJobs(uid)
    res.render('tracking', {jobs: jobs})
})


router.post('/manual', async (req, res) => {
    try {
        const uid = req.session?.user?.UserID
        await applicationController.manualJobApplication(req.body, uid);
        res.redirect('/tracking')
    } catch (e) {
        console.error(`Error: ${e}`)
    }
})

/**
 * gets all jobs based on userID
 * @returns array of JSON of jobs
 */
async function getAllJobs(uid) {
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

module.exports = router