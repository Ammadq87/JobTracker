const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const session = require('express-session')

require('dotenv').config();

const pug = require('pug')
app.set('view engine', 'pug')

const auth = require('./routes/auth')

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));


function requireLogin(req, res, next) {
    if (!req.session.user)
        res.redirect('/auth/login')
    else
        next()
}

app.use('/auth', auth)
app.use(requireLogin)

app.get('/', (req, res) => {
    res.redirect('/home')
})

app.get('/home', (req, res) => {
    const Page = 'Hi, ' + req.session.user.FullName + '!'
    res.render('home', {Page: Page})
})

app.listen(process.env.PORT , function(){
    console.log(`Listening on PORT ${process.env.PORT}`)
})
