const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abcd',
    database: 'users'
})



module.exports ={connection,mysql};