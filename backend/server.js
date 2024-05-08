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
    if (!req.session.user && req.path !== '/auth/login')
        res.redirect('/auth/login');
    else
        next();
}

// Apply requireLogin globally to all routes
// app.use(requireLogin);

app.use('/auth', auth);
app.use('/tracking', application);
app.use('/stats', stats)

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
