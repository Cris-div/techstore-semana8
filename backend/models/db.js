const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'techstore'
});

connection.connect((err) => {
    if (err) {
        console.error('Error DB:', err);
    } else {
        console.log('MySQL conectado');
    }
});

module.exports = connection;