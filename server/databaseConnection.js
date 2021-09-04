const mysql = require("mysql");

const con = mysql.createConnection({
    host: "s124.cyber-folks.pl",
    user: "dakwmndatt_brunchbox",
    password: "***** ***",
    database: "dakwmndatt_brunchbox"
});

module.exports = con;
