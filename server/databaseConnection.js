const mysql = require("mysql");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "lolpol",
    database: "e-commerce"
});

module.exports = con;
