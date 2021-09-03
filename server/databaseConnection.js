const mysql = require("mysql");

const con = mysql.createConnection({
    host: "s124.cyber-folks.pl",
    user: "dakwmndatt_brunchbox",
    password: "Brunch#Box!xyzSkyl@123",
    database: "dakwmndatt_brunchbox"
});

// const con = mysql.createConnection({
//     host: "18421_brunchbox.skylo-pl.atthost24.pl",
//     user: "18421_brunchbox",
//     password: "SwinkaPeppa-31",
//     database: "18421_brunchbox"
// });

module.exports = con;
