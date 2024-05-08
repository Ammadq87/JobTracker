const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const redisClient = require('../lib/redis')
const AuthController = require('../controllers/auth')

router.get('/login', (req, res) => {
    res.render(
        'login', 
        { title: 'Welcome' }
    );
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;    
    try {
        const response = await AuthController.login(email, password);
        if (response.status === 401)
            res.render('login', { response: response });
        else {
            // Set session data in Redis with expiration (60 seconds)
            req.session.user = response.data
            console.log(`log -- ${email} logged at ${new Date()}`);
            console.log(`log -- session id: ${req.session.id}`);
            res.redirect('/')
        }
    } catch (e) {
        console.error(e);
        res.send('[Error] -- Could not login');
    }
});

router.get('/register', (req, res) => {
    res.render(
        'register',
        { title: 'Yippie!' }
    );
});

router.post('/register', async (req, res) => {
    const { email, password, fullName } = req.body;  
    console.log(req.body)  
    try {
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(password, salt);
        const response = await AuthController.signUp(email, hashedPassword, fullName);
        console.log(`log -- ${email} registered at ${new Date()}`);
        res.render('register', { response: response });
    } catch (e) {
        console.error(e);
        res.send('[Error] -- Could not signUp');
    }
});

module.exports = router;
