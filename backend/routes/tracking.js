const express = require('express')
const router = express()
const redis = require('../lib/redis')

const TrackingController = require('../controllers/tracking')

router.get('/', async (req, res) => {
    const uid = await getUID(req)
    const jobs = await getAllJobs(uid)
    // res.redirect('back')        
    res.render('tracking', {jobs: jobs})
})

router.post('/edit', async (req, res) => {
    const uid = await getUID(req)
    await TrackingController.editJobApplication(req.body, uid)
    const jobs = await getAllJobs(uid)
    res.redirect('back')
    // res.redirect('')
    // res.render('tracking', {jobs: jobs})
})

router.post('/delete/:jobID', async (req, res) => {
    const jobID = req.params.jobID
    const uid = await getUID(req)
    await TrackingController.deleteJobById(jobID, uid)
    const jobs = await getAllJobs(uid)
    res.redirect('back')
    // res.render('tracking', {jobs: jobs})
})

router.post('/manual', async (req, res) => {
    try {
        const uid = await getUID(req)
        await TrackingController.manualJobApplication(req.body, uid);
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
        const result = await TrackingController.getAllJobs(uid)
        jobs = result ? result.data : []
        redis.set(`Jobs:uID:${uid}`, new String(JSON.stringify(jobs)))
        redis.expire(`Jobs:uID:${uid}`, 3600)
    } else {
        jobs = JSON.parse(jobs)
    }

    return jobs
}

module.exports = router