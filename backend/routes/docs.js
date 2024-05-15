const express = require('express')
const router = express()
const DocsController = require('../controllers/docs')
const Utils = require('../lib/utils')

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
        if (result.status === 400) {
            res.render('docs', {
                docsData: {
                    alertMsg: result.msg,
                    resultStatus: result.status
                }
            }) 

            return
        }
        
        console.log(`log -- category '${req.body.Name}' created`)
        res.render('docs', {
            DocumentCategory: [],
            statusMsg: result.msg
        })
    } catch (e) {
        console.error(e)
    }
})

module.exports = router