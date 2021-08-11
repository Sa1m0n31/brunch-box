const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");

con.connect((err) => {
    /* UPDATE INFO */
    router.post("/update", (request, response) => {
        let { personal, street, building, flat, postalCode, city, apiKey } = request.body;
        personal = !!personal;

        const values = [street, building, flat, postalCode, city, personal, apiKey];
        const query = 'UPDATE shipping_methods SET street = ?, building = ?, flat = ?, postal_code = ?, city = ?, is_on = ?, google_maps_api_key = ? WHERE id = 1';
        con.query(query, values, (err, res) => {
            console.log(err);
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

    /* GET INFO */
    router.get("/get-info", (request, response) => {
       const query = 'SELECT * FROM shipping_methods';
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
});

module.exports = router;
