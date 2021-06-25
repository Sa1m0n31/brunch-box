const mysql = require("mysql");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "lolpol",
    database: "e-commerce"
});

// const con = mysql.createConnection({
//     host: "18421_brunchbox.skylo-pl.atthost24.pl",
//     user: "18421_brunchbox",
//     password: "SwinkaPeppa-31",
//     database: "18421_brunchbox"
// });

module.exports = con;
