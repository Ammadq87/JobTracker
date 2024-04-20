const express = require('express')
const app = express()
const bodyParser = require('body-parser');

require('dotenv').config();

const pug = require('pug')
app.set('view engine', 'pug')

const auth = require('./routes/auth')

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function(req, res) {

    /**
     * If session not availbe, redirect to login, else redirect to home
     */

    res.render(
        'login',
        {title: 'Job Trackr'}
    )
})

app.use('/auth', auth)



app.listen(process.env.PORT , function(){
    console.log(`Listening on PORT ${process.env.PORT}`)
})
