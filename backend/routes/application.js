const express = require('express')
const router = express()

const applicationController = require('../controllers/application')

router.post('/tracker', (req, res) => {
    const {link, tags} = req.body

    const result = applicationController.getJobInfo(link, tags)

    if (result.notFound.length > 0) {
        console.log('err -- Automatic Application failed')
        res.render('home', {status: 401, msg: 'Some attributes could not be found', errors: result.notFound, link: link})
    } else {
        console.log('suc -- Automatic Application successful')
        res.render('home', {status: 200, errors: [], msg: `Applied for ${result.Role} @ N/A`})
    }

})

module.exports = router