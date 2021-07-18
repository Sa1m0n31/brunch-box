const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");

con.connect(err => {
    /* ADD COUPON */
    router.post("/add", (request, response) => {
        const { code, from, to, percent, amount, timesToUse } = request.body;

        const values = [code, from, to, percent, amount, timesToUse];
        const query = 'INSERT INTO coupons VALUES (NULL, ?, STR_TO_DATE(?, "%Y-%m-%d") + INTERVAL 1 DAY, STR_TO_DATE(?, "%Y-%m-%d") + INTERVAL 1 DAY, ?, ?, ?)';
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

    /* UPDATE COUPON */
    router.post("/update", (request, response) => {
        const { id, code, from, to, percent, amount, timesToUse } = request.body;

        const values = [code, from, to, percent, amount, timesToUse, id];
        const query = 'UPDATE coupons SET code = ?, date_from = STR_TO_DATE(?, "%Y-%m-%d") + INTERVAL 1 DAY, date_to = STR_TO_DATE(?, "%Y-%m-%d") + INTERVAL 1 DAY, percent = ?, amount = ?, times_to_use = ? WHERE id = ?';
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

    /* REMOVE COUPON */
    router.post("/delete", (request, response) => {
        const { id } = request.body;
        const values = [id];
        const query = 'DELETE FROM coupons WHERE id = ?';
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

    /* VERIFY COUPON */
    router.post("/verify", (request, response) => {
        const { code } = request.body;

        const values = [code];
        const query = 'SELECT id, percent, amount FROM coupons WHERE code = ? AND date_from <= CURRENT_TIMESTAMP AND date_to >= CURRENT_TIMESTAMP AND (times_to_use > 0 OR times_to_use IS NULL)';
        con.query(query, values, (err, res) => {
           if(res[0]) {
               if(res[0].id) {
                       response.send({
                           result: 1,
                           percent: res[0].percent,
                           amount: res[0].amount
                       });
               }
               else {
                   response.send({
                       result: 0
                   })
               }
           }
           else {
               response.send({
                   result: 0
               });
           }
        });
    });

    /* DECREMENT TIMES_TO_USE VALUE */
    router.post("/decrement", (request, response) => {
        /* Decrement times_to_use value */
        const { couponContent } = request.body;

        const values = [couponContent];
        const query = 'UPDATE coupons SET times_to_use = times_to_use-1 WHERE code = ?';
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

    /* GET ALL */
    router.get("/get-all", (request, response) => {
        const query = 'SELECT * FROM coupons';
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

    /* GET SINGLE */
    router.post("/get-details", (request, response) => {
        const { id } = request.body;

        const values = [id];
        const query = 'SELECT * FROM coupons WHERE id = ?';
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
});

module.exports = router;
