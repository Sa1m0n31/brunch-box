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

    router.post("/send-notification", (request, response) => {
        const { orderId } = request.body;

        sendEmailNotification(orderId, response, true);
    });

    const sendEmailNotification = (sessionId, response = null, byOrderId = false) => {
        /* Send email notification */
        const values = [sessionId];
        let query
        if(byOrderId) {
            query = 'SELECT p.name, s.size, s.quantity, s.option, o.payment_method, o.delivery, o.order_comment, o.order_price, u.phone_number, u.email, r.caption, o.city as orderCity, o.postal_code as orderPostalCode, o.street as orderStreet, o.nip, o.company_name, o.company_city, o.company_postal_code, o.company_address FROM orders o JOIN sells s ON o.id = s.order_id JOIN products p ON s.product_id = p.id LEFT OUTER JOIN ribbons r ON r.order_id = o.id JOIN users u ON u.id = o.user WHERE o.id = ?';
        }
        else {
            query = 'SELECT p.name, s.size, s.quantity, s.option, o.payment_method, o.delivery, o.order_comment, o.order_price, u.phone_number, u.email, r.caption, o.city as orderCity, o.postal_code as orderPostalCode, o.street as orderStreet, o.nip, o.company_name, o.company_city, o.company_postal_code, o.company_address FROM orders o JOIN sells s ON o.id = s.order_id JOIN products p ON s.product_id = p.id LEFT OUTER JOIN ribbons r ON r.order_id = o.id JOIN users u ON u.id = o.user WHERE o.przelewy24_id = ?';
        }

            con.query(query, values, (err, res) => {
            if(res) {
                const deliveryTime = res[0].delivery;
                const deliveryAddress = res[0].orderStreet ? res[0].orderStreet : "" + ", " + res[0].orderPostalCode ? res[0].orderPostalCode : "" + " " + res[0].orderCity ? res[0].orderCity : "";
                const orderComment = res[0].order_comment;
                const phoneNumber = res[0].phone_number;
                const userEmail = res[0].email;
                const orderPrice = res[0].order_price;
                const paymentMethod = res[0].payment_method;
                let orderDedication = res[0].caption;
                let nip = null, companyName, companyPostalCode, companyCity, companyAddress;
                let vat = "Brak";

                if(res[0].nip) {
                    nip = res[0].nip;
                    companyName = res[0].company_name;
                    companyPostalCode = res[0].company_postal_code;
                    companyAddress = res[0].company_address;
                }

                if(orderDedication === "Od: dla:") orderDedication = null;

                let orderItems = "";
                JSON.parse(JSON.stringify(res)).forEach((item, index, array) => {
                    orderItems += "<br/>" + item.name.split("/")[0] + ", " + item.option + (item.size ? ", " + item.size : ", ") + " x" + item.quantity + ";";

                    if(index === array.length-1) {
                        if(nip) {
                            vat = "Faktura VAT: " + companyName + ", NIP: " + nip + "<br/>" + companyAddress + "<br/>" + companyPostalCode + " " + companyCity;
                        }

                        /* Nodemailer */
                        let transporter = nodemailer.createTransport(smtpTransport ({
                            auth: {
                                user: 'brunchbox@skylo-pl.atthost24.pl',
                                pass: 'BrunchboxSkylo@123'
                            },
                            host: 'skylo-pl.atthost24.pl',
                            secureConnection: true,
                            port: 465,
                            tls: {
                                rejectUnauthorized: false
                            },
                        }));

                        let mailOptions = {
                            from: 'brunchbox@skylo-pl.atthost24.pl',
                            to: ["zamowienia@brunchbox.pl"],
                            subject: 'Nowe zam??wienie w sklepie Brunchbox',
                            html: '<h2>Nowe zam??wienie!</h2> ' +
                                '<p>Kto?? w??a??nie z??o??y?? zam??wienie w sklepie Brunchbox. W celu obs??ugi zam??wienia, zaloguj si?? do panelu administratora: </p> ' +
                                `<p><b>Czas dostawy:</b> ` + deliveryTime + `</p>` +
                                `<p><b>Adres dostawy:</b> ` + (deliveryAddress ? deliveryAddress : "Odbi??r osobisty") + `</p>` +
                                `<p><b>P??atno????:</b> ` + (!paymentMethod ? "Przelewy24" : (paymentMethod === 1 ? "Got??wk?? przy odbiorze" : "Kart?? przy odbiorze")) + `</p>` +
                                `<p><b>Numer telefonu:</b> ` + phoneNumber + `</p>` +
                                `<p><b>Adres email:</b> ` + userEmail + `</p>` +
                                `<p><b>Produkty w dostawie:</b> ` + orderItems + `</p>` +
                                `<p><b>????czny koszt zam??wienia:</b> ` + orderPrice + `PLN </p>` +
                                `<p><b>Komentarz do zam??wienia:</b> ` + (orderComment ? orderComment : "Brak") + `</p>` +
                                `<p><b>Dedykacja:</b> ` + (orderDedication ? orderDedication : "Brak") + `</p>` +
                                `<p><b>Faktura VAT:</b> ` + vat + `</p>` +
                                '<a href="https://brunchbox.pl/admin">' +
                                'Przejd?? do panelu administratora' +
                                ' </a>'
                        }

                        let mailOptionsForUser = {
                            from: 'brunchbox@skylo-pl.atthost24.pl',
                            to: userEmail,
                            subject: 'Przyj??li??my Twoje zam??wienie',
                            html: `<h3>Dzi??kujemy. Przyj??li??my Twoje zam??wienie.</h3>` +
                                `<p><b>Czas dostawy:</b> ` + deliveryTime + `</p>` +
                                `<p><b>Adres dostawy:</b> ` + (deliveryAddress ? deliveryAddress : "Odbi??r osobisty") + `</p>` +
                                `<p><b>Numer telefonu:</b> ` + phoneNumber + `</p>` +
                                `<p><b>Produkty w dostawie:</b> ` + orderItems + `</p>` +
                                `<p><b>????czny koszt zam??wienia:</b> ` + orderPrice + `PLN </p>` +
                                `<p><b>Komentarz do zam??wienia:</b> ` + (orderComment ? orderComment : "Brak") + `</p>` +
                                `<p><b>Dedykacja:</b> ` + (orderDedication ? orderDedication : "Brak") + `</p>` +
                                `<p><b>Faktura VAT:</b> ` + vat + `</p>` +
                                `<p></p>` +
                                `<p></p>` +
                                `<p></p>` +
                                `<p>-----------------------</p>` +
                                `<p></p>` +
                                `<p></p>` +
                                `<img style="max-width: 600px;" src="https://brunchbox.pl/image?url=/media/posts/stopka.png" />`

                        }

                        transporter.sendMail(mailOptions, function(error, info) {
                            transporter.sendMail(mailOptionsForUser, function(error, info) {
                                if(response) {
                                    response.send({
                                        status: "OK"
                                    });
                                }
                            });
                        });
                    }
                });
            }
        });
    }

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
                    'Authorization': 'Basic MTQ3MTcwOjVmNGEzNTlhNDJjYzI0NjZlZDI4YWQzNTFlYWIwMjA0'
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
                    'Authorization': 'Basic MTQ3MTcwOjVmNGEzNTlhNDJjYzI0NjZlZDI4YWQzNTFlYWIwMjA0'
                }
            })
                .then(res => {
                    if(res.body.data.status === 'success') {
                        /* Change value in databse - payment complete */
                        const values = [sessionId];
                        const query = 'UPDATE orders SET payment_status = "op??acone" WHERE przelewy24_id = ?';
                        con.query(query, values, (err, res) => {
                            sendEmailNotification(sessionId, response);
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
