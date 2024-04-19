const express = require('express')
const app = express()

const pug = require('pug')
app.set('view engine', 'pug')

app.get('/', function(req, res) {
    res.render(
        'sample',
        {title: 'Express Pug', message: ' there'}
    )
})

app.listen(3000, function(){
    console.log('Listening on PORT 3000')
})