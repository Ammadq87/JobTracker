const express = require('express')
const router = express()

const applicationController = require('../controllers/tracking')

router.get('/', async (req, res) => {
    const uid = req.session?.user?.UserID
    const result = await applicationController.getAllJobs(uid)
    const jobs = result.data
    res.render('tracking', {jobs: jobs})

})

// router.post('/tracker', (req, res) => {
//     const {link, tags} = req.body

//     const result = applicationController.getJobInfo(link, tags)

//     if (result.notFound.length > 0) {
//         console.log('err -- Automatic Application failed for @' + req.session.user?.UserID)
//         res.render('tracking', {status: 401, msg: 'Some attributes could not be found', errors: result.notFound, link: link})
//     } else {
//         console.log('suc -- Automatic Application successful for @' + req.session.user?.UserID)
//         res.render('tracking', {status: 200, errors: [], msg: `Applied for ${result.Role} @ N/A`})
//     }
// })

router.post('/manual', async (req, res) => {
    try {
        const uid = req.session?.user?.UserID
        await applicationController.manualJobApplication(req.body, uid);
        res.redirect('/tracking')
    } catch (e) {
        console.error(`Error: ${e}`)
    }
})

module.exports = router