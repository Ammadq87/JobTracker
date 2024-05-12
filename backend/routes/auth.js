const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const redis = require('../lib/redis')
const uuid = require('uuid')

const AuthController = require('../controllers/auth')

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;    
    try {
        const response = await AuthController.login(email, password);
        if (response.status === 401)
            res.render('login', { response: response });
        else {
            req.session.SessID = uuid.v4()
            await redis.set(`sessionID:${req.session.SessID}`, JSON.stringify(response.data))
            
            // ToDo -- change exiparation time
            await redis.expire(`sessionID:${req.session.SessID}`, 3600)
            console.log(`log -- ${email} logged at ${new Date()}`);
            console.log(`log -- session id: ${req.session.SessID}`);
            res.redirect('/')
        }
    } catch (e) {
        console.error(e);
        res.send('[Error] -- Could not login');
    }
});


router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { email, password, fullName } = req.body;  
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
