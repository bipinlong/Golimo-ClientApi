const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "golimo",
    // host: "97.74.83.78",
    // user: "api_boston",
    // password: "z1u$AVqzOG#N",
    // database: "api_boston",
    // port: 3306,
});

conn.connect((err) => {
    if (err) {
        console.error("Database connection failed. Error:", err.message);
        return;
    }
    console.log("Connected to MySql database");
});

module.exports = conn;