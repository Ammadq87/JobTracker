require('dotenv').config()
const mysql = require('mysql')

const sql = mysql.createConnection({
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: process.env.mysql_database
})

module.exports = sql