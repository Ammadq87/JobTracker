const express = require('express')
const router = express()
const DocsController = require('../controllers/docs')
const Utils = require('../lib/utils')
const Notification = require('../../models/notification')

router.get('/', (req, res) => {
    // Get the categories
    res.render('docs', {
        DocumentCategory: []
    })
})

// Post
router.post('/newCategory', async (req, res) => {
    try {
        const result = await DocsController.createNewCategory(req)
        const notification = new Notification(result.status, result.msg)
        const DocPageObj = {
            notification: notification
        }

        if (result.status === 400) {
            res.render('docs', DocPageObj) 
            return
        }
        
        console.log(`log -- category '${req.body.Name}' created`)
        
        res.render('docs', DocPageObj) 

    } catch (e) {
        console.error(e)
    }
})

module.exports = router