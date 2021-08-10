const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");
const multer = require("multer");
const path = require("path");
const got = require("got");

con.connect(err => {
    /* CALCULATE DISTANCE */
    router.post("/get-distance", (request, response) => {
       const { city, postalCode, street, building } = request.body;

       const googleMapsAPIKey = "AIzaSyB-v08acGrxo3OEk5qv5dOcT9zk-z-qnFU";
       const originCity = "Warszawa";
       const originPostalCode = "05-075";
       const originStreet = "Polna";
       const originBuilding = "15";

       /* API REQUEST TO GOOGLE MAPS */
       got.post(`https://maps.googleapis.com/maps/api/directions/json?origin=${originStreet}+${originBuilding}+${originPostalCode}+${originCity}&destination=${street}+${building}+${postalCode}+${city}&key=${googleMapsAPIKey}`, {
           responseType: "json"
       })
           .then(res => {
              response.send({
                  result: res.body
              });
           });
    });

    /* GET DELVIERY PRICES */
    router.get("/get-delivery-prices", (request, response) => {
       const query = 'SELECT * FROM delivery_prices';
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
       })
    });

    /* GET DELIVERY PRICE */
    router.post("/get-single-delivery", (request, response) => {
        const { id } = request.body;

        const values = [id];
        const query = 'SELECT * FROM delivery_prices WHERE id = ?';
        con.query(query, values, (err, res) => {
           reponse.send({
               result: res
           });
        });
    });

    /* ADD DELIVERY PRICE */
    router.post("/add-delivery-price", (request, response) => {
       const { kmFrom, kmTo, price } = request.body;

       const values = [kmFrom, kmTo, price];
       const query = 'INSERT INTO delivery_prices VALUES (NULL, ?, ?, ?)';
       con.query(query, values, (err, res) => {
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

    /* UPDATE DELIVERY PRICE */
    router.post("/update-delivery-price", (request, response) => {
       const { id, kmFrom, kmTo, price } = request.body;

       const values = [kmFrom, kmTo, price, id];
       const query = 'UPDATE delivery_prices SET km_from = ?, km_to = ?, price = ? WHERE id = ?';
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

    /* DELETE DELIVERY PRICE */
    router.post("/delete-delivery-price", (request, response) => {
       const { id } = request.body;
       const values = [id];
       const query = 'DELETE FROM delivery_prices WHERE id = ?';
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
