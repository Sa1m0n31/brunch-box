const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");

con.connect((err) => {
    /* INSERT IMAGE */
    const insertImage = image => {
        const values = [image];
        const query = 'INSERT INTO images VALUES (NULL, NULL, ?)';
        return con.query(query, values)
    }

    /* ADD NEW METHOD */
    router.post("/add", (request, response) => {
        const name = request.body.name;
        const price = request.body.price;
        const image = request.body.image;
        let result;

        if(image) {
            /* Upload with image */
            insertImage(image)
                .then((err, res) => {
                        const values = [name, price, res.insertId];
                        const query = 'INSERT INTO payment_methods VALUES (NULL, ?, ?, ?)';
                        con.query(query, values, (err, res) => {
                            if(res) result = 1;
                            else result = 0;
                            response.send({
                                result
                            });
                        });
                });
        }
        else {
            /* Upload without image */
            const values = [name, price];
            const query = 'INSERT INTO payment_methods VALUES (NULL, ?, ?, NULL)';
            con.query(query, values, (err, res) => {
                if(res) result = 1;
                else result = 0;
                response.send({
                    result
                });
            })
        }
    });

    /* UPDATE METHOD */
    router.post("/update", (request, response) => {
        const id = request.body.id;
        const name = request.body.name;
        const price = request.body.price;
        const image = request.body.image;
        let result = 0;

        if(image) {
            const values = [image];
            const query = 'SELECT id FROM images WHERE file_path = ?';
            con.query(query, values, (err, res) => {
                if(res[0]) {
                    /* New image exists in database */
                    const imageId = res[0].id;
                    const values = [name, price, imageId, id];
                    const query = 'UPDATE payment_methods SET name = ?, price = ?, image = ? WHERE id = ?';
                    con.query(query, values, (err, res) => {
                        if(!err) result = 1;
                        response.send({
                            result
                        });
                    })
                }
                else {
                    /* It's new image */
                    insertImage(image)
                        .then((err, res) => {
                            const imageId = res.insertId;
                            const values = [name, price, imageId, id];
                            const query = 'UPDATE payment_methods SET name = ?, price = ?, image = ? WHERE id = ?';
                            con.query(query, values, (err, res) => {
                                if(!err) result = 1;
                                response.send({
                                    result
                                });
                            })
                        });
                }
            });
        }
        else {
            const values = [name, price, id];
            const query = 'UPDATE payment_methods SET name = ?, price = ? WHERE id = ?';
            con.query(query, values, (err, res) => {
                if(!err) result = 1;
                response.send({
                    result
                });
            });
        }
    });

    /* GET ALL METHODS */
    router.get("/get-all-payment-methods", (request, response) => {
        con.query(`SELECT * FROM payment_methods`, (err, res) => {
            let result, paymentMethods = 0;
            if(err) result = 0;
            else {
                result = 1;
                paymentMethods = res;
            }
            response.send({
                result,
                paymentMethods
            });
        });
    });

    /* DELETE METHOD */
    router.post("/delete", (request, response) => {
        const id = request.body.id;
        const values = [id];
        const query = 'DELETE FROM payment_methods WHERE id = ?';

        con.query(query, values, (err, res) => {
            let result = 0;
            if(!err) result = 1;
            response.send({
                result
            });
        });
    });
});

module.exports = router;
