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
        const { orderId, en } = request.body;

        if(en) sendEmailNotification(orderId, response, true, true);
        else sendEmailNotification(orderId, response, true, false);
    });

    const sendEmailNotification = (sessionId, response = null, byOrderId = false, english = false) => {
        /* Send email notification */
        const values = [sessionId];
        let query, splitIndex;

        if(english) splitIndex = 1;
        else splitIndex = 0;

        if(byOrderId) {
            query = 'SELECT o.id as order_id, p.name, p.price_l_vege, p.price_m_vege, p.price_m_meat, p.price_l_meat, s.size, s.quantity, s.option, o.payment_method, o.delivery, o.order_comment, o.order_price, u.phone_number, u.email, r.caption, o.city as orderCity, o.postal_code as orderPostalCode, o.street as orderStreet, o.nip, o.company_name, o.company_city, o.company_postal_code, o.company_address FROM orders o JOIN sells s ON o.id = s.order_id JOIN products p ON s.product_id = p.id LEFT OUTER JOIN ribbons r ON r.order_id = o.id JOIN users u ON u.id = o.user WHERE o.id = ?';
        }
        else {
            query = 'SELECT o.id as order_id, p.name, p.price_l_vege, p.price_m_vege, p.price_m_meat, p.price_l_meat, s.size, s.quantity, s.option, o.payment_method, o.delivery, o.order_comment, o.order_price, u.phone_number, u.email, r.caption, o.city as orderCity, o.postal_code as orderPostalCode, o.street as orderStreet, o.nip, o.company_name, o.company_city, o.company_postal_code, o.company_address FROM orders o JOIN sells s ON o.id = s.order_id JOIN products p ON s.product_id = p.id LEFT OUTER JOIN ribbons r ON r.order_id = o.id JOIN users u ON u.id = o.user WHERE o.przelewy24_id = ?';
        }

            con.query(query, values, (err, res) => {
            if(res) {
                const orderId = res[0].order_id;
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
                let price = 0;

                if(res[0].nip) {
                    nip = res[0].nip;
                    companyName = res[0].company_name;
                    companyPostalCode = res[0].company_postal_code;
                    companyAddress = res[0].company_address;
                }

                if(orderDedication === "Od: dla:") orderDedication = null;

                let orderItems = "";
                JSON.parse(JSON.stringify(res)).forEach((item, index, array) => {
                    if((item.size === 'M' || item.size === '1/2 boxa') && item.option === 'Mieszana') {
                        price = item.price_m_meat;
                    }
                    if((item.size === 'M' || item.size === 'Cały box') && item.option === 'Wegetariańska') {
                        price = item.price_m_vege;
                    }
                    if((item.size === 'L' || item.size === '1/2 boxa') && item.option === 'Mieszana') {
                        price = item.price_l_meat;
                    }
                    if((item.size === 'L' || item.size === 'Cały box') && item.option === 'Wegetariańska') {
                        price = item.price_l_vege;
                    }
                    orderItems += "<br/>" + item.name.split("/")[splitIndex] + ", " + item.option + (item.size ? ", " + item.size : ", ") + " x" + item.quantity + ' - ' + price + " PLN" + ";";

                    if(index === array.length-1) {
                        if(nip) {
                            vat = companyName + ", NIP: " + nip + "<br/>" + companyAddress + "<br/>" + companyPostalCode + " " + companyCity;
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
                            to: ["zamowienia@brunchbox.pl", "zamowienia.brunchbox@gmail.com"],
                            subject: 'Nowe zamówienie w sklepie Brunchbox',
                            html: '<h2>Nowe zamówienie!</h2> ' +
                                '<p style="color: #000;">Ktoś właśnie złożył zamówienie w sklepie Brunchbox. W celu obsługi zamówienia, zaloguj się do panelu administratora: </p> ' +
                                `<p style="color: #000;"><b>Number zamówienia:</b> ` + orderId + `</p>` +
                                `<p style="color: #000;"><b>Czas dostawy:</b> ` + deliveryTime + `</p>` +
                                `<p style="color: #000;"><b>Adres dostawy:</b> ` + (deliveryAddress !== "0" ? deliveryAddress : "Odbiór osobisty") + `</p>` +
                                `<p style="color: #000;"><b>Płatność:</b> ` + (!paymentMethod ? "Paynow" : (paymentMethod === 1 ? "Gotówką przy odbiorze" : "Kartą przy odbiorze")) + `</p>` +
                                `<p style="color: #000;"><b>Numer telefonu:</b> ` + phoneNumber + `</p>` +
                                `<p style="color: #000;"><b>Adres email:</b> ` + userEmail + `</p>` +
                                `<p style="color: #000;"><b>Produkty w dostawie:</b> ` + orderItems + `</p>` +
                                `<p style="color: #000;"><b>Łączny koszt zamówienia:</b> ` + orderPrice + ` PLN </p>` +
                                `<p style="color: #000;"><b>Komentarz do zamówienia:</b> ` + (orderComment ? orderComment : "Brak") + `</p>` +
                                `<p style="color: #000;"><b>Dedykacja:</b> ` + (orderDedication ? orderDedication : "Brak") + `</p>` +
                                `<p style="color: #000;"><b>Faktura VAT:</b> ` + vat + `</p>` +
                                `<p style="color: red;"><b>Zamówienie nie zostało jeszcze opłacone. Przedź do panelu administratora, aby sprawdzić status płatności</b></p>` +
                                '<a href="https://brunchbox.pl/admin">' +
                                'Przejdź do panelu administratora' +
                                ' </a>'
                        }

                        let mailOptionsForUser;
                        if(english) {
                            mailOptionsForUser = {
                                from: 'brunchbox@skylo-pl.atthost24.pl',
                                to: userEmail,
                                subject: 'We received your order',
                                html: `<h3>Thank you. We received your order.</h3>` +
                                    `<p style="color: #000;"><b>Order number:</b> ` + orderId + `</p>` +
                                    `<p style="color: #000;"><b>Time:</b> ` + deliveryTime + `</p>` +
                                    `<p style="color: #000;"><b>Address:</b> ` + (deliveryAddress !== "0" ? deliveryAddress : "Self-pickup") + `</p>` +
                                    `<p style="color: #000;"><b>Mobile number:</b> ` + phoneNumber + `</p>` +
                                    `<p style="color: #000;"><b>Delivery consist:</b> ` + orderItems + `</p>` +
                                    `<p style="color: #000;"><b>Total cost:</b> ` + orderPrice + ` PLN </p>` +
                                    `<p style="color: #000;"><b>Comment:</b> ` + (orderComment ? orderComment : "None") + `</p>` +
                                    `<p style="color: #000;"><b>Dedication:</b> ` + (orderDedication ? orderDedication : "None") + `</p>` +
                                    `<p style="color: #000;"><b>Payment method:</b> ` + (!paymentMethod ? "Przelewy24" : (paymentMethod === 1 ? "Cash" : "Card")) + `</p>` +
                                    `<p style="color: #000;"><b>Invoice:</b> ` + vat + `</p>` +
                                    `<p></p>` +
                                    `<p></p>` +
                                    `<p></p>` +
                                    `<p>-----------------------</p>` +
                                    `<p></p>` +
                                    `<p></p>` +
                                    `<img style="max-width: 600px;" src="https://brunchbox.pl/image?url=/media/posts/stopka.png" />`

                            }
                        }
                        else {
                            mailOptionsForUser = {
                                from: 'brunchbox@skylo-pl.atthost24.pl',
                                to: userEmail,
                                subject: 'Przyjęliśmy Twoje zamówienie',
                                html: `<h3>Dziękujemy. Przyjęliśmy Twoje zamówienie.</h3>` +
                                    `<p style="color: #000;"><b>Numer zamówienia:</b> ` + orderId + `</p>` +
                                    `<p style="color: #000;"><b>Czas dostawy:</b> ` + deliveryTime + `</p>` +
                                    `<p style="color: #000;"><b>Adres dostawy:</b> ` + (deliveryAddress !== "0" ? deliveryAddress : "Odbiór osobisty") + `</p>` +
                                    `<p style="color: #000;"><b>Numer telefonu:</b> ` + phoneNumber + `</p>` +
                                    `<p style="color: #000;"><b>Produkty w dostawie:</b> ` + orderItems + `</p>` +
                                    `<p style="color: #000;"><b>Łączny koszt zamówienia:</b> ` + orderPrice + ` PLN </p>` +
                                    `<p style="color: #000;"><b>Komentarz do zamówienia:</b> ` + (orderComment ? orderComment : "Brak") + `</p>` +
                                    `<p style="color: #000;"><b>Dedykacja:</b> ` + (orderDedication ? orderDedication : "Brak") + `</p>` +
                                    `<p style="color: #000;"><b>Płatność:</b> ` + (!paymentMethod ? "Paynow" : (paymentMethod === 1 ? "Gotówką przy odbiorze" : "Kartą przy odbiorze")) + `</p>` +
                                    `<p style="color: #000;"><b>Faktura VAT:</b> ` + vat + `</p>` +
                                    `<p></p>` +
                                    `<p></p>` +
                                    `<p></p>` +
                                    `<p>-----------------------</p>` +
                                    `<p></p>` +
                                    `<p></p>` +
                                    `<img style="max-width: 600px;" src="https://brunchbox.pl/image?url=/media/posts/stopka.png" />`

                            }
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

    router.post("/change-payment-id", (request, response) => {
        const { id, paymentId } = request.body;
        const values = [paymentId, id];
        const query = 'UPDATE orders SET przelewy24_id = ? WHERE id = ?';
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

    router.post("/get-payment-status", (request, response) => {
        const { paymentId } = request.body;

        got.get(`https://api.paynow.pl/v1/payments/${paymentId}/status`, {
            headers: {
                'Api-Key': 'dfbfd66b-01f0-4940-8648-9f1abea4aa83'
            }
        })
            .then(res => {
                response.send({
                    result: res.body
                });
            })
            .catch((res) => {
                response.send({
                    result: {
                        status: 'NONE'
                    }
                });
            })
    });

    /* PAYMENT */
    router.post("/payment", cors(), async (request, response) => {
        /* Add order to database */
        let { sessionId, email, amount } = request.body;

        amount = amount * 100;
        const idempotency = uuidv4();

        let postData = {
            amount: amount,
            externalId: sessionId,
            description: "Płatność za zakupy w sklepie Brunchbox",
            buyer: {
                email: email
            }
        }

        let signature = crypto.createHmac('sha256', 'caae9a22-4cc2-4637-bd11-057493ce59c6').update(JSON.stringify(postData)).digest("base64");

        sendEmailNotification(sessionId);

        got.post('https://api.paynow.pl/v1/payments', {
            json: postData,
            responseType: 'json',
            headers: {
                'Api-Key': 'dfbfd66b-01f0-4940-8648-9f1abea4aa83',
                'Signature': signature,
                'Idempotency-Key': idempotency,
            }
        })
            .then(res => {
                console.log(res);
                response.send({
                    result: res.body,
                    token: idempotency,
                    signature: signature
                });
            });
    });

    /* PAYMENT */
    // router.post("/payment", cors(), async (request, response) => {
    //     /* Add order to database */
    //     const { sessionId } = request.body;
    //
    //     /* Generate SHA-384 checksum */
    //     const query = 'SELECT * FROM przelewy24 WHERE id = 1';
    //     con.query(query, (err, res) => {
    //         let crc = res[0].crc;
    //         let marchantId = res[0].marchant_id;
    //
    //         let hash, data, gen_hash;
    //         hash = crypto.createHash('sha384');
    //         data = hash.update(`{"sessionId":"${sessionId}","merchantId":${marchantId},"amount":${parseFloat(request.body.amount)*100},"currency":"PLN","crc":"${crc}"}`, 'utf-8');
    //         gen_hash = data.digest('hex');
    //
    //         /* Dane */
    //         let postData = {
    //             sessionId: sessionId,
    //             posId: marchantId,
    //             merchantId: marchantId,
    //             amount: parseFloat(request.body.amount) * 100,
    //             currency: "PLN",
    //             description: "Platnosc za zakupy w sklepie BrunchBox",
    //             email: request.body.email,
    //             country: "PL",
    //             language: "pl",
    //             urlReturn: "https://brunchbox.pl/dziekujemy",
    //             urlStatus: "https://brunchbox.pl/payment/verify",
    //             sign: gen_hash
    //         };
    //
    //         let responseToClient;
    //
    //         /* FIRST STEP - REGISTER */
    //         got.post("https://secure.przelewy24.pl/api/v1/transaction/register", {
    //             json: postData,
    //             responseType: 'json',
    //             headers: {
    //                 'Authorization': 'Basic MTQ3MTcwOjVmNGEzNTlhNDJjYzI0NjZlZDI4YWQzNTFlYWIwMjA0'
    //             }
    //         })
    //             .then(res => {
    //                 responseToClient = res.body.data.token;
    //
    //                 response.send({
    //                     result: responseToClient
    //                 });
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //             })
    //     });
    // });

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
                        const query = 'UPDATE orders SET payment_status = "opłacone" WHERE przelewy24_id = ?';
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
