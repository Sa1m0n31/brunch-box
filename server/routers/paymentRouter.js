const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const got = require("got");
const cors = require("cors");
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');

con.connect(err => {
    /* Set Przelewy24 credentials */
    router.post("/change-data", (request, response) => {
        const { marchantId, crc, apiKey } = request.body;

        const values = [marchantId, crc, apiKey];
        const query = 'UPDATE przelewy24 SET marchant_id = ?, crc = ?, api_key = ? WHERE id = 1';
        con.query(query, values, (err, res) => {
            let result = 0;
            if(res) result = 1;
            response.send({
                result
            });
        });
    });

    /* Get Przelewy24 credentials */
    router.get("/get-data", (request, response) => {
        const query = 'SELECT * FROM przelewy24 WHERE id = 1';
        con.query(query, (err, res) => {
           response.send({
               result: res
           });
        });
    });

    /* PAYMENT */
    router.post("/payment", cors(), async (request, response) => {
        /* Add order to database */
        let sessionId = uuidv4();

        /* Generate SHA-384 checksum */
        const query = 'SELECT * FROM przelewy24 WHERE id = 1';
        con.query(query, (err, res) => {
            let crc = res[0].crc;
            let marchantId = res[0].marchant_id;

            let hash, data, gen_hash;
            hash = crypto.createHash('sha384');
            data = hash.update(`{"sessionId":"${sessionId}","merchantId":${marchantId},"amount":${parseFloat(request.body.amount)*100},"currency":"PLN","crc":"${crc}"}`, 'utf-8');
            gen_hash = data.digest('hex');

            /* Dane */
            let postData = {
                sessionId: sessionId,
                posId: marchantId,
                merchantId: marchantId,
                amount: parseFloat(request.body.amount) * 100,
                currency: "PLN",
                description: "Płatność za zakupy w sklepie BrunchBox",
                email: request.body.email,
                country: "PL",
                language: "pl",
                urlReturn: "http://localhost:3000/dziekujemy",
                urlStatus: "http://localhost:5000/payment/verify",
                sign: gen_hash
            };

            // console.log(postData);
            let responseToClient;

            got.post("https://sandbox.przelewy24.pl/api/v1/transaction/register", {
                json: postData,
                responseType: 'json',
                headers: {
                    'Authorization': 'Basic MTM4MzU0OjU0Nzg2ZGJiOWZmYTY2MzgwOGZmNGExNWRiMzI3MTNm' // tmp
                }
            })
                .then(res => {
                    responseToClient = res.body.data.token;
                    if(res.body.data.token) {
                        /* TMP */
                        // const query = 'UPDATE orders SET payment_status = "opłacone" WHERE id = (SELECT id FROM orders ORDER BY date DESC LIMIT 1)';
                        // con.query(query, (err, res) => {
                        //     console.log("UPDATING PAYMENT STATUS");
                        //     console.log(err);
                        // });
                    }

                    response.send({
                        result: responseToClient
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        });

    });

    /* Payment - verify */
    router.post("/verify", async (request, response) => {
        let marchantId = request.body.merchantId;
        let posId = request.body.posId;
        let sessionId = request.body.sessionId;
        let amount = request.body.amount;
        let currency = request.body.currency;
        let orderId = request.body.orderId;

        console.log("Veryfying 1");

        /* Get data */
        const query = 'SELECT * FROM przelewy24 WHERE id = 1';
        con.query(query, (err, res) => {
            console.log("Veryfying 2...");
            let marchantId = res[0].marchant_id;
            let crc = res[0].crc;
            let apiKey = res[0].api_key;

            /* Calculate SHA384 checksum */
            let hash, data, gen_hash;
            hash = crypto.createHash('sha384');
            data = hash.update(`{"sessionId":"${sessionId}","orderId":${orderId},"amount":${amount},"currency":"PLN","crc":"${crc}"}`, 'utf-8');
            gen_hash= data.digest('hex');

            got.put("https://sandbox.przelewy24.pl/api/v1/transaction/verify", {
                json: {
                    marchantId,
                    posId,
                    sessionId,
                    amount,
                    currency,
                    orderId,
                    sign: gen_hash
                },
                responseType: 'json',
                headers: {
                    'Authorization': 'Basic MTM4MzU0OjU0Nzg2ZGJiOWZmYTY2MzgwOGZmNGExNWRiMzI3MTNm' // tmp
                }
            })
                .then(res => {
                    console.log("HEY!");
                    console.log(res.body.data);
                    if(res.body.data.status === 'success') {
                        /* Change value in databse - payment complete */
                        const values = [orderId];
                        const query = 'UPDATE orders SET payment_status = "opłacone" WHERE id = ?';
                        con.query(query, values, (err, res) => {
                            console.log("UPDATING PAYMENT STATUS");
                            console.log(err);
                        });
                    }
                })

            res.send({
                status: "OK"
            });
        });

    });
});

module.exports = router;
