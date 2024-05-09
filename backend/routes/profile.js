const express = require('express')
const router = express()
const redis = require('../lib/redis')
const ProfileController = require('../controllers/profile')

router.get('/', async (req, res) => {
    try {
        let sessionInfo = await redis.get(`sessionID:${req.session.SessID}`)
        sessionInfo = JSON.parse(sessionInfo)
        const myProfileInformation = await ProfileController.getMyProfile(sessionInfo['UserID'])    
        res.render('profile', {profile: myProfileInformation})
    } catch (e) {
        res.render('profile', {profile: null})
    }
    
})

module.exports = router