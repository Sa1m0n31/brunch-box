const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");

con.connect(err => {
    /* Add date */
    router.post("/add", (request, response) => {
       const { hours, day } = request.body;

       const values = [`${day.year}-${day.month}-${day.day}`];
       console.log(values[0]);
       const query = 'INSERT INTO dates_excluded VALUES (NULL, STR_TO_DATE(?, "%Y-%m-%d"))';
       con.query(query, values, (err, res) => {
           console.log("FIRST ERROR: " + err);
          if(res) {
              const insertedId = res.insertId;
              hours.forEach((item, index, array) => {
                 const values = [insertedId, item];
                 const query = 'INSERT INTO hours_excluded VALUES (NULL, ?, ?)';
                 con.query(query, values);
                 if(index === array.length-1) {
                     response.send({
                         result: 1
                     });
                 }
              });
          }
          else {
              response.send({
                  result: 0
              });
          }
       });
    });

    /* Get all dates and hours */
    router.get("/get-all", (request, response) => {
       const query = 'SELECT h.id, d.date + INTERVAL 1 DAY as day, h.hour_start FROM dates_excluded d JOIN hours_excluded h ON d.id = h.day_id';
       con.query(query, (err, res) => {
          if(res) {
              response.send({
                  result: res
              });
          }
          else {
              response.send({
                  result: 0
              });
          }
       });
    });

    /* Remove date */
    router.post("/delete", (request, response) => {
        const { id } = request.body;
        const values = [id];
        const query = 'DELETE FROM hours_excluded WHERE id = ?';
        con.query(query, values, (err, res) => {
           if(res) {
               response.send({
                   result: 1
               });
           }
           else {
               response.send({
                   result: 0
               });
           }
        });
    });
});

module.exports = router;
