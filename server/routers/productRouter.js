const express = require("express");
const router = express.Router();
const multer = require("multer");
const con = require("../databaseConnection");
const path = require("path");
const fs = require("fs");

const upload = multer({ dest: 'uploads/' });

con.connect(err => {
   /* ADD CROSS-SELLS */
   const addCrossSells = (product1, product2) => {
      const values = [product1, product2];
      const query = 'INSERT INTO cross-sells VALUES (NULL, product1, product2)';
      con.query(query, values);
   }

   /* GET NEW ID */
   router.get("/last-product", (request, response) => {
      const query = 'SELECT id FROM products ORDER BY date DESC LIMIT 1';
      con.query(query, (err, res) => {
         if(res) {
            response.send({
               result: res[0].id
            });
         }
      })
   });

   /* ADD ALLERGENS */
   router.post("/add-allergens", (request, response) => {
      const { id, allergens } = request.body;

      allergens.forEach(item => {
         const values = [id, item];
         const query = 'INSERT INTO allergens VALUES (NULL, ?, ?)';
         con.query(query, values);
      });
      response.send({ result: 1 });
   });

   /* ADD PRODUCT */
   router.post("/add-product", upload.single("mainImage"), (request, response) => {
      let { id, name, second_name, categoryId, editor, price } = request.body;
      price = parseFloat(price);
      categoryId = parseInt(categoryId);

      //if(!stock) stock = null;

      /* Add cross-sells */
      // crossSellsArray.forEach(item => {
      //    addCrossSells(item.product1, item.product2);
      // });

      if(request.file) {
         /* Add image to filesystem */
         const tempPath = request.file.path;
         const targetPath = path.join(__dirname, `./../media/products/${request.file.originalname}`);

         fs.rename(tempPath, targetPath, err => {
            /* Add image to database */
            const values = [`products/${request.file.originalname}`, id];
            const query = 'INSERT INTO images VALUES (NULL, ?, ?)';
            con.query(query, values, (err, res) => {
               console.log(err);
               console.log("END OF ERROR 1");
               const values = [name, price, editor, res.insertId, categoryId];
               const query = 'INSERT INTO products VALUES (NULL, ?, ?, ?, ?, NULL, ?, CURRENT_TIMESTAMP)';
               con.query(query, values, (err, res) => {
                  console.log(err);
                  if(res) response.redirect("http://localhost:3000/panel/dodaj-produkt?add=1");
                  else response.redirect("http://localhost:3000/panel/dodaj-produkt?add=0");
               });
            });
         });
      }
      else {
         /* Add product without main image */
         const values = [name, price, editor, categoryId];
         const query = 'INSERT INTO products VALUES (NULL, ?, ?, ?, NULL, NULL, ?, CURRENT_TIMESTAMP)';
         con.query(query, values, (err, res) => {
            let result = 0;
            if(res) result = 1;
            response.send({
               result
            });
         });
      }
   });

   /* REMOVE PRODUCT */
   router.post("/delete", (request, response) => {
      const { id } = request.body;
      const values = [id];

      console.log(values);

      const query = 'DELETE FROM products WHERE id = ?';
      con.query(query, values, (err, res) => {
         console.log(err);
         let result = 0;
         if(res) result = 1;
         response.send({
            result
         });
      });
   });

   /* REMOVE CURRENT CROSS-SELLS */
   const deleteCrossSellsForProduct = (productId) => {
      const values = [productId];
      const query = 'DELETE FROM cross-sells WHERE product1 = ?';
      con.query(query, values);
   }

   /* UPDATE PRODUCT */
   router.post("/update", (request, response) => {
      const { id, name, price, description, mainImage, stock, categoryId, crossSellsArray } = request.body;

      /* Remove current cross-sells */
      deleteCrossSellsForProduct(id);

      /* Update cross-sells */
      crossSellsArray.forEach(item => {
         addCrossSells(item.product1, item.product2);
      });

      if(mainImage) {
         /* Update product with main image */
         const values = [mainImage];
         const query = 'INSERT INTO images VALUES (NULL, NULL, ?)';
         con.query(query, values, (err, res) => {
            const values = [name, price, description, res.insertId, stock, categoryId];
            const query = 'UPDATE products SET name = ?, price = ?, description = ?, main_image = ?, stock = ?, categoryId = ? WHERE id = ?';
            con.query(query, values, (err, res) => {
               let result = 0;
               if(res) result = 1;
               response.send({
                  result
               });
            });
         });
      }
      else {
         /* Update product without main image */
         const values = [name, price, description, stock, categoryId];
         const query = 'UPDATE products SET name = ?, price = ?, description = ?, main_image = NULL, stock = ?, categoryId = ?';
         con.query(query, values, (err, res) => {
            let result = 0;
            if(res) result = 1;
            response.send({
               result
            });
         });
      }
   });

   /* GET ALL PRODUCTS */
   router.get("/get-all-products", (request, response) => {
      const query = 'SELECT p.id, p.name as product_name, i.file_path as image, p.price, p.description, p.date, COALESCE(c.name, "Brak") as category_name FROM products p ' +
      'LEFT OUTER JOIN categories c ON p.category_id = c.id ' +
      'LEFT OUTER JOIN images i ON p.main_image = i.id';

      con.query(query, (err, res) => {
         if(res) {
            response.send({
               result: res
            });
         }
         else {
            console.log(err);
            response.send({
               result: null
            });
         }
      });
   });

   /* GET PRODUCT DETAILS */
   router.post("/product-data", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT * FROM products p LEFT OUTER JOIN allergens a ON p.id = a.product_id WHERE p.id = ?';
      con.query(query, values, (err, res) => {
         if(res) {
            response.send({
               result: res
            });
         }
         else {
            response.send({
               result: null
            });
         }
      });
   });

   /* DECREMENT PRODUCT STOCK */
   router.post("/decrement-stock", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'UPDATE products SET stock = stock - 1';
      con.query(query, values, (err, res) => {
         let result = 0;
         if(res) result = 1;
         response.send({
            result
         });
      });
   });
});

module.exports = router;
