const express = require('express')
const router = express()
const bcrypt = require('bcrypt')

const controller = require('../controllers/auth')

router.post('/login', async (req, res) => {
    const {email, password} = req.body    
    try {
        const response = await controller.login(email, password)
        res.send(response)
    } catch (e) {
        console.log(e)
        res.send('[Error] -- Could not SignUp')
    }
})

router.post('/signUp', async (req, res) => {
    const {email, password, fullName} = req.body    

    try {
        const salt = await bcrypt.genSalt(5)
        const hashedPassword = await bcrypt.hash(password, salt)
        const response = await controller.signUp(email, hashedPassword, fullName)
        res.send(response)
    } catch (e) {
        console.log(e)
        res.send('[Error] -- Could not SignUp')
    }
})



module.exports = router