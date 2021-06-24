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
         if(res[0]) {
            response.send({
               result: res[0].id
            });
         }
         else {
            response.send({
               result: 0
            });
         }
      })
   });

   /* ADD ALLERGENS */
   router.post("/add-allergens", (request, response) => {
      const { id, allergens } = request.body;

      /* Remove all allergens for current product */
      const values = [id];
      const query = 'DELETE FROM allergens WHERE product_id = ?';
      con.query(query, values, (err, res) => {
         allergens.forEach(item => {
            const values = [id, item];
            const query = 'INSERT INTO allergens VALUES (NULL, ?, ?)';
            con.query(query, values, (err, res) => {
            });
         });
         response.send({ result: 1 });
      });
   });

   /* ADD PRODUCT */
   router.post("/add-product", upload.single("mainImage"), (request, response) => {
      let { id, name, bracketName, categoryId, shortDescription, longDescription, meatDescription, vegeDescription, priceM_meat, priceL_meat, priceM_vege, priceL_vege, m, l, vegan, meat } = request.body;
      if(priceL_meat !== '') priceL_meat = parseFloat(priceL_meat);
      else priceL_meat = null;
      if(priceM_meat !== '') priceM_meat = parseFloat(priceM_meat);
      else priceM_meat = null;
      if(priceL_vege !== '') priceL_vege = parseFloat(priceL_vege);
      else priceL_vege = null;
      if(priceM_vege !== '') priceM_vege = parseFloat(priceM_vege);
      else priceM_vege = null;

      m = m === 'true' || m == 1;
      l = l === 'true' || l == 1;
      vegan = vegan === 'true' || vegan == 1;
      meat = meat === 'true' || meat == 1;

      categoryId = parseInt(categoryId);

         if(request.file) {
            /* Add image to filesystem */
            const tempPath = request.file.path;
            const targetPath = path.join(__dirname, `./../media/products/${request.file.originalname}`);

            fs.rename(tempPath, targetPath, err => {
               /* Add image to database */
               const values = [`products/${request.file.originalname}`];
               const query = 'INSERT INTO images VALUES (NULL, ?)';
               con.query(query, values, (err, res) => {
                  const values = [id, name, priceM_meat, priceL_meat, priceM_vege, priceL_vege,
                     shortDescription, longDescription, meatDescription, vegeDescription,
                     res.insertId, categoryId, bracketName, vegan, meat, m, l];
                  const query = 'INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?)';
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
            const values = [id, name, priceM_meat, priceL_meat, priceM_vege, priceL_vege,
               shortDescription, longDescription, meatDescription, vegeDescription,
               categoryId, bracketName, vegan, meat, m, l];
            const query = 'INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?)';
            con.query(query, values, (err, res) => {
               let result = 0;
               if(res) result = 1;
               if(res) response.redirect("http://localhost:3000/panel/dodaj-produkt?add=1");
               else response.redirect("http://localhost:3000/panel/dodaj-produkt?add=0");
            });
         }
   });

   /* UPDATE PRODUCT */
   router.post("/update-product", upload.single("mainImage"), (request, response) => {
      let { id, name, bracketName, categoryId, shortDescription, longDescription, meatDescription, vegeDescription, priceM_meat, priceL_meat, priceM_vege, priceL_vege, m, l, vegan, meat } = request.body;
      if(priceL_meat !== '') priceL_meat = parseFloat(priceL_meat);
      else priceL_meat = null;
      if(priceM_meat !== '') priceM_meat = parseFloat(priceM_meat);
      else priceM_meat = null;
      if(priceL_vege !== '') priceL_vege = parseFloat(priceL_vege);
      else priceL_vege = null;
      if(priceM_vege !== '') priceM_vege = parseFloat(priceM_vege);
      else priceM_vege = null;

      console.log(request.body);

      m = m === 'true' || m == 1;
      l = l === 'true' || l == 1;
      vegan = vegan === 'true' || vegan == 1;
      meat = meat === 'true' || meat == 1;

      categoryId = parseInt(categoryId);

      /* Add product without main image */
      const values = [name, priceM_meat, priceL_meat, priceM_vege, priceL_vege,
         shortDescription, longDescription, meatDescription, vegeDescription,
         categoryId, bracketName, vegan, meat, m, l, id];
      const query = 'UPDATE products SET name = ?, price_m_meat = ?, price_l_meat = ?, price_m_vege = ?, price_l_vege = ?, ' +
          'short_description = ?, long_description = ?, meat_description = ?, vege_description = ?, category_id = ?, bracket_name = ?, ' +
          'vege = ?, meat = ?, m = ?, l = ? ' +
          'WHERE id = ?';
      con.query(query, values, (err, res) => {
         console.log(err);
         console.log(err);
         if(res) response.redirect("http://localhost:3000/panel/dodaj-produkt?add=1");
         else response.redirect("http://localhost:3000/panel/dodaj-produkt?add=0");
      });

      /* Get needed data if product exists - image and date */
      // const values1 = [id];
      // const query1 = 'SELECT main_image, date FROM products WHERE id = ?';
      // con.query(query1, values1, (err, res) => {
      //    if(res[0]) {
      //       date = res[0].date;
      //       imageId = res[0].main_image;
      //    }
      // });
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

   /* GET ALL PRODUCTS */
   router.get("/get-all-products", (request, response) => {
      const query = 'SELECT p.id, p.name as product_name, p.bracket_name, i.file_path as image, p.price_m_meat, p.price_l_meat, p.price_m_vege, p.price_l_vege, p.date, COALESCE(c.name, "Brak") as category_name FROM products p ' +
      'LEFT OUTER JOIN categories c ON p.category_id = c.id ' +
      'LEFT OUTER JOIN images i ON p.main_image = i.id ORDER BY p.date DESC';

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

   /* GET SINGLE PRODUCT BY NAME */
   router.post("/get-product-by-name", (request, response) => {
      const { name } = request.body;
      const values = [name];
      const query = 'SELECT p.id as id, p.name, p.bracket_name, p.price_m_meat, p.price_l_meat, p.price_m_vege, p.price_l_vege, ' +
          'p.short_description, p.long_description, p.meat_description, p.vege_description, p.category_id, p.date, p.vege, p.meat, p.m, p.l, i.file_path as file_path ' +
          'FROM products p JOIN images i ON i.id = p.main_image WHERE LOWER(p.name) = ?';
      con.query(query, values, (err, res) => {
         console.log(err);
         response.send({
            result: res
         });
      });
   });

   /* GET SINGLE PRODUCT DETAILS (CLIENT) */
   router.post("/single-product", (request, response) => {
      const { id } = request.body;
      console.log(request.body);
      const values = [id];
      const query = 'SELECT p.id as id, p.name, p.bracket_name, p.price_m_meat, p.price_l_meat, p.price_m_vege, p.price_l_vege, ' +
          'p.short_description, p.long_description, p.meat_description, p.vege_description, p.category_id, p.date, p.vege, p.meat, p.m, p.l, i.file_path as file_path ' +
          'FROM products p JOIN images i ON i.id = p.main_image WHERE p.id = ?';
      con.query(query, values, (err, res) => {
         if(res) {
            console.log(res);
            console.log(err);
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

   /* GET SINGLE PRODUCT ALLERGENS */
   router.post("/single-allergens", (request, response) => {

   });

   /* GET PRODUCT DETAILS */
   router.post("/product-data", (request, response) => {
      const { id } = request.body;
      const values = [id];
      console.log("CHECKING FOR ID = " + id);
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
