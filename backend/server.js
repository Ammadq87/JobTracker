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
app.use('/application', application);
app.use(requireLogin); // applies middleware function to all routes  

app.get('/', (req, res) => {
    res.redirect('/index');
});

// Handle favicon requests
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // Return empty response (No Content)
});

app.get('/:href', (req, res) => {
    const href = req.params.href;
    const pageObj = {};

    console.log(`log -- on ${href}`);

    if (!href || href === 'index') {
        pageObj['errors'] = [];
        pageObj['msg'] = `Welcome back`;
        res.render('index', pageObj);
        return;
    } else if (href === 'feed') {
        // Handle feed logic
    } else if (href === 'stats') {
        // Handle stats logic
    } else if (href === 'tracking') {
        pageObj['errors'] = [];
        pageObj['msg'] = '';
    } else if (href === 'docs') {
        // Handle docs logic
    } else if (href === 'profile') {
        // Handle profile logic
    }
    res.render(href, { pageObj });
});

app.listen(process.env.PORT , function(){
    console.log(`Listening on PORT ${process.env.PORT}`);
});
