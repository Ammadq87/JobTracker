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

// Middleware to parse incoming request bodies
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
app.use(requireLogin); // applies middleware function to all routes  

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
