const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const session = require('express-session')

require('dotenv').config();

const pug = require('pug')
app.set('view engine', 'pug')

const auth = require('./routes/auth')
const application = require('./routes/application')

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
app.use('/application', application)
app.use(requireLogin)

app.get('/', (req, res) => {
    res.redirect('/home')
})

app.get('/home', (req, res) => {
    res.render('home', {errors: [], msg: ''})
})

app.listen(process.env.PORT , function(){
    console.log(`Listening on PORT ${process.env.PORT}`)
})
