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

const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

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

    router.all('/', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    /* PAYMENT */
    router.post("/payment", cors(), async (request, response) => {
        /* Add order to database */
        const { sessionId } = request.body;

        /* Generate SHA-384 checksum */
        const query = 'SELECT * FROM przelewy24 WHERE id = 1';
        con.query(query, (err, res) => {
            let crc = res[0].crc;
            let marchantId = res[0].marchant_id;

            let hash, data, gen_hash;
            hash = crypto.createHash('sha384');
            data = hash.update(`{"sessionId":"${sessionId}","merchantId":${marchantId},"amount":${parseFloat(request.body.amount)*100},"currency":"PLN","crc":"${crc}"}`, 'utf-8');
            gen_hash = data.digest('hex');

            console.log(sessionId);
            console.log(marchantId);

            /* Dane */
            let postData = {
                sessionId: sessionId,
                posId: marchantId,
                merchantId: marchantId,
                amount: parseFloat(request.body.amount) * 100,
                currency: "PLN",
                description: "Platnosc za zakupy w sklepie BrunchBox",
                email: request.body.email,
                country: "PL",
                language: "pl",
                urlReturn: "https://brunchbox.pl/dziekujemy",
                urlStatus: "https://brunchbox.pl/payment/verify",
                sign: gen_hash
            };

            let responseToClient;

            /* FIRST STEP - REGISTER */
            got.post("https://secure.przelewy24.pl/api/v1/transaction/register", {
                json: postData,
                responseType: 'json',
                headers: {
                    'Authorization': 'Basic BASE64'
                }
            })
                .then(res => {
                    responseToClient = res.body.data.token;

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
        let merchantId = request.body.merchantId;
        let posId = request.body.posId;
        let sessionId = request.body.sessionId;
        let amount = request.body.amount;
        let currency = request.body.currency;
        let orderId = request.body.orderId;

        /* Get data */
        const query = 'SELECT * FROM przelewy24 WHERE id = 1';
        con.query(query, (err, res) => {
            let crc = res[0].crc;

            /* Calculate SHA384 checksum */
            let hash, data, gen_hash;
            hash = crypto.createHash('sha384');
            data = hash.update(`{"sessionId":"${sessionId}","orderId":${orderId},"amount":${amount},"currency":"PLN","crc":"${crc}"}`, 'utf-8');
            gen_hash= data.digest('hex');

            got.put("https://secure.przelewy24.pl/api/v1/transaction/verify", {
                json: {
                    merchantId,
                    posId,
                    sessionId,
                    amount,
                    currency,
                    orderId,
                    sign: gen_hash
                },
                responseType: 'json',
                headers: {
                    'Authorization': 'Basic BASE 64'
                }
            })
                .then(res => {
                    if(res.body.data.status === 'success') {
                        /* Change value in databse - payment complete */
                        const values = [sessionId];
                        const query = 'UPDATE orders SET payment_status = "opłacone" WHERE przelewy24_id = ?';
                        con.query(query, values, (err, res) => {
                            /* Send email notification */
                            const values = [sessionId];
                            const query = 'SELECT p.name, s.size, s.quantity, s.option, o.delivery, o.order_comment, u.phone_number, u.email, r.caption, o.city as orderCity, o.building as orderBuilding, o.postal_code as orderPostalCode, o.street as orderStreet FROM orders o JOIN sells s ON o.id = s.order_id JOIN products p ON s.product_id = p.id LEFT OUTER JOIN ribbons r ON r.order_id = o.id JOIN users u ON u.id = o.user WHERE o.przelewy24_id = ?';
                            con.query(query, values, (err, res) => {
                               if(res) {
                                   const deliveryTime = res[0].delivery;
                                   const deliveryAddress = res[0].orderStreet + " " + res[0].orderBuilding + ", " + res[0].orderPostalCode + " " + res[0].orderCity;
                                   const orderComment = res[0].order_comment;
                                   const phoneNumber = res[0].phone_number;
                                   const userEmail = res[0].email;
                                   let orderDedication = res[0].caption;

                                   if(orderDedication === "Od: dla:") orderDedication = null;

                                   let orderItems = "";
                                   JSON.parse(JSON.stringify(res)).forEach((item, index, array) => {
                                        orderItems += "<br/>" + item.name.split("/")[0] + ", " + item.option + (item.size ? ", " + item.size : ", ") + " x" + item.quantity + ";";

                                        if(index === array.length-1) {
                                            /* Nodemailer */
                                            let transporter = nodemailer.createTransport(smtpTransport ({
                                                auth: {
                                                    user: 'powiadomienia@skylo-pl.atthost24.pl',
                                                    pass: '**** ***'
                                                },
                                                host: 'skylo-pl.atthost24.pl',
                                                secureConnection: true,
                                                port: 465,
                                                tls: {
                                                    rejectUnauthorized: false
                                                },
                                            }));

                                            let mailOptions = {
                                                from: 'powiadomienia@skylo-pl.atthost24.pl',
                                                to: "zamowienia@brunchbox.pl",
                                                subject: 'Nowe zamówienie w sklepie Brunchbox',
                                                html: '<h2>Nowe zamówienie!</h2> ' +
                                                    '<p>Ktoś właśnie złożył zamówienie w sklepie Brunchbox. W celu obsługi zamówienia, zaloguj się do panelu administratora: </p> ' +
                                                    `<p><b>Czas dostawy:</b> ` + deliveryTime + `</p>` +
                                                    `<p><b>Adres dostawy:</b> ` + deliveryAddress + `</p>` +
                                                    `<p><b>Numer telefonu:</b> ` + phoneNumber + `</p>` +
                                                    `<p><b>Adres email:</b> ` + userEmail + `</p>` +
                                                    `<p><b>Produkty w dostawie:</b> ` + orderItems + `</p>` +
                                                    `<p><b>Komentarz do zamówienia:</b> ` + orderComment + `</p>` +
                                                    `<p><b>Dedykacja:</b> ` + (orderDedication ? orderDedication : "Brak") + `</p>` +
                                                    '<a href="https://brunchbox.pl/admin">' +
                                                    'Przejdź do panelu administratora' +
                                                    ' </a>'
                                            }

                                            transporter.sendMail(mailOptions, function(error, info) {
                                                response.send({
                                                    status: "OK"
                                                });
                                            });
                                        }
                                   });
                               }
                            });
                        });
                    }
                    else {
                        const values = [sessionId];
                        const query = 'UPDATE orders SET payment_status = "niepowodzenie" WHERE przelewy24_id = ?';
                        con.query(query, values, (err, res) => {
                            response.send({
                                status: "OK"
                            });
                        });
                    }
                })
        });

    });
});

module.exports = router;
