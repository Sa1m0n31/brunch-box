const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: 'uploads/' });

con.connect((err) => {
    /* ADD SHIPPING METHOD */
    router.post("/add", upload.single("image"), (request, response) => {
        const name = request.body.name;
        let price = request.body.price;
        const deliveryTime = request.body.deliveryTime;

        console.log(request);

        if(price === "") price = 0;

        if(name === "") {
            response.redirect("http://localhost:3000/panel/wysylka?added=0");
            return 0;
        }

        if(request.file) {
            /* Upload with image */
            const tempPath = request.file.path;
            const targetPath = path.join(__dirname, `./../media/shipping/${request.file.originalname}`);

            fs.rename(tempPath, targetPath, err => {
                /* Add image to database */
                const values = [`shipping/${request.file.originalname}`];
                const query = 'INSERT INTO images VALUES (NULL, ?, NULL)';
                con.query(query, values, (err, res) => {
                    console.log("HERE!!!");
                    console.log(res.insertId);
                    const values = [name, price, deliveryTime, res.insertId];
                    const query = 'INSERT INTO shipping_methods VALUES (NULL, ?, ?, ?, ?)';

                    con.query(query, values, (err, res) => {
                        if(!err) response.redirect("http://localhost:3000/panel/wysylka?added=1");
                        else response.redirect("http://localhost:3000/panel/wysylka?added=-1")
                    });
                });
            });
        }
        else {
            /* Upload without image */
            console.log("ELSE!");
            const values = [name, price, deliveryTime];
            const query = 'INSERT INTO shipping_methods VALUES (NULL, ?, ?, ?, NULL)';
            con.query(query, values, (err, res) => {
                if(!err) response.redirect("http://localhost:3000/panel/wysylka?added=1");
                else response.redirect("http://localhost:3000/panel/wysylka?added=-1");
            })
        }
    });

    /* UPDATE SHIPPING METHOD */
    router.post("/update", (request, response) => {
        const id = request.body.id;
        const name = request.body.name;
        const price = request.body.price;
        const deliveryTime = request.body.deliveryTime;
        const image = request.body.image;
        let result = 0;

        if(image) {
            const values = [image];
            const query = 'SELECT id FROM images WHERE file_path = ?';
            con.query(query, values, (err, res) => {
               if(res[0]) {
                   /* New image exists in database */
                   const imageId = res[0].id;
                   const values = [name, price, deliveryTime, imageId, id];
                   const query = 'UPDATE shipping_methods SET name = ?, price = ?, delivery_time = ?, image = ? WHERE id = ?';
                   con.query(query, values, (err, res) => {
                       if(!err) result = 1;
                       response.send({
                           result
                       });
                   });
               }
               else {
                   /* It's new image */
                   const values = [image];
                   const query = 'INSERT INTO images VALUES (NULL, NULL, ?)';
                    con.query(query, values, (err, res) => {
                        console.log(err);
                        console.log(res);
                        const imageId = res.insertId;
                        const values = [name, price, deliveryTime, imageId, id];
                        const query = 'UPDATE shipping_methods SET name = ?, price = ?, delivery_time = ?, image = ? WHERE id = ?';
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
            const values = [name, price, deliveryTime, id];
            const query = 'UPDATE shipping_methods SET name = ?, price = ?, delivery_time = ? WHERE id = ?';
            con.query(query, values, (err, res) => {
               if(!err) result = 1;
               response.send({
                   result
               });
            });
        }
    });

    /* GET ALL SHIPPING METHODS */
    router.get("/get-all-shipping-methods", (request, response) => {
        con.query(`SELECT sm.id, sm.name, sm.price, sm.delivery_time, i.file_path as img_path FROM shipping_methods sm LEFT OUTER JOIN images i ON sm.image = i.id`, (err, res) => {
            let result, shippingMethods = 0;
           if(err) result = 0;
           else {
               result = 1;
               shippingMethods = res;
           }
           response.send({
               result,
               shippingMethods
           });
        });
    });

    /* DELETE SHIPPING METHOD */
    router.post("/delete", (request, response) => {
        const id = request.body.id;
        const values = [id];
        const query = 'DELETE FROM shipping_methods WHERE id = ?';

        con.query(query, values, (err, res) => {
            console.log(err);
            console.log(res);
            let result = 0;
            if(!err) result = 1;
            response.send({
                result
            });
        });
    });
});

module.exports = router;
