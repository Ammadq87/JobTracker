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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

async function requireLogin(req, res, next) {
    if (!req.session.user)
        res.redirect('/auth/login');
    else
        next();
}

app.use('/auth', auth);
app.use('/tracking', application);

app.get('/', (req, res) => {
    res.render('index');
});

// Apply requireLogin middleware to all routes
app.use(requireLogin);

// Handle favicon requests
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // Return empty response (No Content)
});

app.listen(process.env.PORT , function(){
    console.log(`Listening on PORT ${process.env.PORT}`);
});
