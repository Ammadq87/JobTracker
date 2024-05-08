const express = require('express')
const router = express()
const StatsController = require('../controllers/stats')

router.get('/', async (req, res) => {
    try {
        const uID = req.session?.user?.UserID
        const response = await StatsController.getApplicationStats(uID);
        res.render('stats', {applicationStatsData: response})
        return
    } catch (e) {
        console.error(e)
    }

    res.render('stats', {applicationStatsData: []})
})

module.exports = router