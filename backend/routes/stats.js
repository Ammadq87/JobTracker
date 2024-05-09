const express = require('express')
const router = express()
const redis = require('../lib/redis')
const StatsController = require('../controllers/stats')

router.get('/', async (req, res) => {
    try {
        const uID = await getUID(req)
        const response = await StatsController.getApplicationStats(uID);
        res.render('stats', {applicationStatsData: response})
        return
    } catch (e) {
        console.error(e)
    }

    res.render('stats', {applicationStatsData: []})
})

async function getUID(req) {
    let uid = await redis.get(`sessionID:${req.session.SessID}`)
    uid = (JSON.parse(uid))['UserID']
    return uid
}

module.exports = router