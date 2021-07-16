const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: 'uploads/' });

con.connect((err) => {
    /* UPDATE INFO */
    router.post("/update", (request, response) => {
        let { address, addressEn, personal } = request.body;
        personal = !!personal;

        const values = [address, addressEn, personal];
        const query = 'UPDATE shipping_methods SET address = ?, address_en = ?, is_on = ? WHERE id = 1';
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


    /* ------------ USELESS ------------------ */
    /* ADD SHIPPING METHOD */
    router.post("/add", upload.single("image"), (request, response) => {
        const name = request.body.name;
        let price = request.body.price;
        const deliveryTime = request.body.deliveryTime;

        console.log(request);

        if(price === "") price = 0;

        if(name === "") {
            response.redirect("http://brunchbox.skylo-test3.pl/panel/wysylka?added=0");
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
                        if(!err) response.redirect("http://brunchbox.skylo-test3.pl/panel/wysylka?added=1");
                        else response.redirect("http://brunchbox.skylo-test3.pl/panel/wysylka?added=-1")
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
                if(!err) response.redirect("http://brunchbox.skylo-test3.pl/panel/wysylka?added=1");
                else response.redirect("http://brunchbox.skylo-test3.pl/panel/wysylka?added=-1");
            })
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
