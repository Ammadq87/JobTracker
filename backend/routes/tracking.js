const express = require('express')
const router = express()
const redis = require('../lib/redis')

const applicationController = require('../controllers/tracking')

router.get('/', async (req, res) => {
    const uid = await getUID(req)
    const jobs = await getAllJobs(uid)
    // res.redirect('back')        
    res.render('tracking', {jobs: jobs})
})

router.post('/edit', async (req, res) => {
    const uid = await getUID(req)
    console.log(JSON.stringify(req.body))
    await applicationController.editJobApplication(req.body, uid)
    const jobs = await getAllJobs(uid)
    res.redirect('back')
    // res.redirect('')
    // res.render('tracking', {jobs: jobs})
})

router.post('/delete/:jobID', async (req, res) => {
    const jobID = req.params.jobID
    const uid = await getUID(req)
    await applicationController.deleteJobById(jobID, uid)
    const jobs = await getAllJobs(uid)
    res.redirect('back')
    // res.render('tracking', {jobs: jobs})
})

router.post('/manual', async (req, res) => {
    try {
        const uid = await getUID(req)
        await applicationController.manualJobApplication(req.body, uid);
        res.redirect('back')
        // res.redirect('/tracking')
    } catch (e) {
        console.error(`Error: ${e}`)
    }
})

async function getUID(req) {
    let uid = await redis.get(`sessionID:${req.session.SessID}`)
    uid = (JSON.parse(uid))['UserID']
    return uid
}

/**
 * gets all jobs based on userID
 * @returns array of JSON of jobs
 */
async function getAllJobs(uid) {
    let jobs = await redis.get(`Jobs:uID:${uid}`)

    if (!jobs) {
        // console.log(`log == on get all jobs : cache miss`)
        const result = await applicationController.getAllJobs(uid)
        jobs = result ? result.data : []
        redis.set(`Jobs:uID:${uid}`, new String(JSON.stringify(jobs)))
    } else {
        // console.log(`log == on get all jobs : cache hit`)
        jobs = JSON.parse(jobs)
    }

    return jobs
}

module.exports = router