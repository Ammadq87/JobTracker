const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require('dotenv').config();

const pug = require('pug');
app.set('view engine', 'pug');

const auth = require('./routes/auth');
const application = require('./routes/tracking');
const stats = require('./routes/stats')
const profile = require('./routes/profile')

app.use(express.static('views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

// Define the requireLogin middleware
async function requireLogin(req, res, next) {
    if (!req.session.SessID) {
        if (req.path !== '/auth/login' && req.path != '/auth/register')
            res.redirect('/auth/login');
        else if (req.path === '/auth/register')
            res.render('register');
        else
            next();

    }
    else
        next();
}

// Apply requireLogin globally to all routes
app.use(requireLogin);

app.use('/auth', auth);
app.use('/tracking', application);
app.use('/stats', stats)
app.use('/profile', profile)

// Default route
app.get('/', (req, res) => {
    res.render('index');
});

// Handle favicon requests
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // Return empty response (No Content)
});

app.listen(process.env.PORT , function(){
    console.log(`Listening on PORT ${process.env.PORT}`);
});
