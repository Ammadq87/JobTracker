const express = require('express')
const router = express()
const bcrypt = require('bcrypt')

const controller = require('../controllers/auth')

router.get('/login', (req, res) => {
    res.render(
        'login', 
        {title: 'Trackr'}
    )
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body    
    try {
        const response = await controller.login(email, password)
        
        // Set session variable
        req.session.user = response.data

        res.render(
            'login',
            {title: 'Job Trackr', response: response}
        )
    } catch (e) {
        console.log(e)
        res.send('[Error] -- Could not SignUp')
    }
})

router.get('/register', (req, res) => {
    res.render(
        'register',
        {title: 'Trackr'}
    )
})

router.post('/register', async (req, res) => {
    const {email, password, fullName} = req.body    

    try {
        const salt = await bcrypt.genSalt(5)
        const hashedPassword = await bcrypt.hash(password, salt)
        const response = await controller.signUp(email, hashedPassword, fullName)
        res.render('register', {response: response})
    } catch (e) {
        console.log(e)
        res.send('[Error] -- Could not SignUp')
    }
})



module.exports = router