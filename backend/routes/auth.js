const express = require('express')
const router = express()
const bcrypt = require('bcrypt')

const controller = require('../controllers/auth')

router.get('/login', (req, res) => {
    res.render(
        'login', 
        {title: 'Welcome'}
    )
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body    
    try {
        const response = await controller.login(email, password)
        
        req.session.user = response.data
        console.log(`log -- ${email} logged at ${new Date()}`)
        res.redirect('/home')
    } catch (e) {
        console.log(e)
        res.send('[Error] -- Could not SignUp')
    }
})

router.get('/register', (req, res) => {
    res.render(
        'register',
        {title: 'Yippie!'}
    )
})

router.post('/register', async (req, res) => {
    const {email, password, fullName} = req.body    

    try {
        const salt = await bcrypt.genSalt(5)
        const hashedPassword = await bcrypt.hash(password, salt)
        const response = await controller.signUp(email, hashedPassword, fullName)
        console.log(`log -- ${email} regsitered at ${new Date()}`)
        res.render('register', {response: response})
    } catch (e) {
        console.log(e)
        res.send('[Error] -- Could not SignUp')
    }
})



module.exports = router