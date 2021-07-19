const express = require("express");
const router = express.Router();
const multer = require("multer");
const con = require("../databaseConnection");
const path = require("path");
const crypto = require("crypto");
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

      console.log(id);
      console.log(allergens);

      /* Remove all allergens for current product */
      const values = [id];
      const query = 'DELETE FROM allergens WHERE product_id = ?';
      con.query(query, values, (err, res) => {
         if(allergens) {
            allergens.forEach((item, index, array) => {
               const values = [id, item];
               const query = 'INSERT INTO allergens VALUES (NULL, ?, ?)';
               con.query(query, values, (err, res) => {
                  console.log(err);
               });

               if(index === array.length-1) {
                  response.send({
                     result: 1
                  });
               }
            });
         }
         else {
            response.send({
               result: 1
            });
         }
      });
   });

   /* ADD PRODUCT */
   router.post("/add-product", (request, response) => {
      let filenames = [];
      let filesId = [];

      /* Add images */
      const storage = multer.diskStorage({
         destination: "media/products/",
         filename: function(req, file, cb){
            const fName = file.fieldname + Date.now() + path.extname(file.originalname);
            filenames.push(fName);
            cb(null, fName);
         }
      });

      const upload = multer({
         storage: storage
      }).fields([{name: "mainImage"}, {name: "gallery1"}, {name: "gallery2"}, {name: "gallery3"}]);

      upload(request, response, (err, res) => {
         if (err) throw err;

         filenames.sort().reverse(); // First image - main image
         /* Add images to database */
         if(!filenames.length) addProduct();
         else {
            filenames.forEach((item, index, array) => {
               const values = ["products/" + item];
               const query = 'INSERT INTO images VALUES (NULL, ?)';
               con.query(query, values, (err, res) => {
                  filesId.push(res.insertId);
                  if(index === array.length-1) addProduct();
               });
            });
         }
      });

      /* Add product */
      const addProduct = () => {
         /* Fill images array */
         const len = filesId.length;
         for(let i=len; i<4; i++) filesId.push(null);

         /* Add product to database */
         let { id, name, bracketName, categoryId, shortDescription, longDescription, meatDescription, vegeDescription, priceM_meat, priceL_meat, priceM_vege, priceL_vege, m, l, vegan, meat, hidden } = request.body;
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
         hidden = hidden === "hidden";

         categoryId = parseInt(categoryId);

         if(isNaN(priceM_vege)) priceM_vege = null;
         if(isNaN(priceL_vege)) priceL_vege = null;
         if(isNaN(priceM_meat)) priceM_meat = null;
         if(isNaN(priceL_meat)) priceL_meat = null;

            /* Add image to database */
            const values = [id, name, priceM_meat, priceL_meat, priceM_vege, priceL_vege,
               shortDescription, longDescription, meatDescription, vegeDescription,
               filesId[0], categoryId, bracketName, vegan, meat, m, l, filesId[1], filesId[2], filesId[3], hidden];
            const query = 'INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            con.query(query, values, (err, res) => {
               console.log("Error?");
               console.log(err);
               if(res) response.redirect("http://brunchbox.skylo-test3.pl/panel/dodaj-produkt?add=1");
               else response.redirect("http://brunchbox.skylo-test3.pl/panel/dodaj-produkt?add=0");
            });
      }
   });

   /* UPDATE PRODUCT */
   router.post("/update-product", (request, response) => {
      /* Add images */
      let filenames = [];
      let filesId = [];

      /* Add images */
      const storage = multer.diskStorage({
         destination: "media/products/",
         filename: function(req, file, cb){
            const fName = file.fieldname + Date.now() + path.extname(file.originalname);
            filenames.push(fName);
            cb(null, fName);
         }
      });

      const upload = multer({
         storage: storage
      }).fields([{name: "mainImage"}, {name: "gallery1"}, {name: "gallery2"}, {name: "gallery3"}]);

      upload(request, response, (err, res) => {
         if(err) throw err;

         filenames.sort().reverse(); // First image - main image
         /* Add images to database */
         if(!filenames.length) updateProduct();
         else {
            filenames.forEach((item, index, array) => {
               const values = ["products/" + item];
               const query = 'INSERT INTO images VALUES (NULL, ?)';
               con.query(query, values, (err, res) => {
                  filesId.push(res.insertId);
                  if(index === array.length-1) updateProduct();
               });
            });
         }
      });

      const updateProduct = () => {
         let { id, name, bracketName, categoryId, shortDescription, longDescription, meatDescription, vegeDescription, priceM_meat, priceL_meat, priceM_vege, priceL_vege, m, l, vegan, meat, hidden } = request.body;
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
         hidden = hidden === "hidden";

         if(isNaN(priceM_vege)) priceM_vege = null;
         if(isNaN(priceL_vege)) priceL_vege = null;
         if(isNaN(priceM_meat)) priceM_meat = null;
         if(isNaN(priceL_meat)) priceL_meat = null;

         categoryId = parseInt(categoryId);

         /* Add product without main image */
         const values = [name, priceM_meat, priceL_meat, priceM_vege, priceL_vege,
            shortDescription, longDescription, meatDescription, vegeDescription,
            categoryId, bracketName, vegan, meat, m, l, hidden, id];
         const query = 'UPDATE products SET name = ?, price_m_meat = ?, price_l_meat = ?, price_m_vege = ?, price_l_vege = ?, ' +
             'short_description = ?, long_description = ?, meat_description = ?, vege_description = ?, category_id = ?, bracket_name = ?, ' +
             'vege = ?, meat = ?, m = ?, l = ?, hidden = ? ' +
             'WHERE id = ?';
         con.query(query, values, (err, res) => {
            /* Update images id in product row */
            const mainImageIndex = filenames.findIndex((item) => {
               if(item) {
                  return item.search(/mainImage.*/g, "i") !== -1
               }
               else return false;
            });
            if(mainImageIndex !== -1) {
               const values = [filesId[mainImageIndex], id];
               const query = 'UPDATE products SET main_image = ? WHERE id = ?';
               con.query(query, values);
            }

            const gallery1Index = filenames.findIndex((item) => {
               if(item) {
                  return item.search(/gallery1.*/g, "i") !== -1
               }
               else return false;
            });
            if(gallery1Index !== -1) {
               const values = [filesId[gallery1Index], id];
               const query = 'UPDATE products SET gallery_1 = ? WHERE id = ?';
               con.query(query, values);
            }

            const gallery2Index = filenames.findIndex((item) => {
               if(item) {
                  return item.search(/gallery2.*/g, "i") !== -1
               }
               else return false;
            });
            if(gallery2Index !== -1) {
               console.log("Gallery 2 idnex:");
               console.log(gallery2Index);
               const values = [filesId[gallery2Index], id];
               const query = 'UPDATE products SET gallery_2 = ? WHERE id = ?';
               con.query(query, values);
            }

            const gallery3Index = filenames.findIndex((item) => {
               if(item) {
                  return item.search(/gallery3.*/g, "i") !== -1
               }
               else return false;
            });
            if(gallery3Index !== -1) {
               console.log("Gallery 3 idnex:");
               console.log(gallery3Index);
               const values = [filesId[gallery3Index], id];
               const query = 'UPDATE products SET gallery_3 = ? WHERE id = ?';
               con.query(query, values);
            }

            if(res) response.redirect("http://brunchbox.skylo-test3.pl/panel/dodaj-produkt?add=1");
            else response.redirect("http://brunchbox.skylo-test3.pl/panel/dodaj-produkt?add=0");
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

   /* GET ALL PRODUCTS */
   router.get("/get-all-products", (request, response) => {
      const query = 'SELECT p.id, p.name as product_name, p.bracket_name, i.file_path as image, p.price_m_meat, p.price_l_meat, p.price_m_vege, p.price_l_vege, p.date, COALESCE(c.name, "Brak") as category_name, p.hidden FROM products p ' +
      'LEFT OUTER JOIN categories c ON p.category_id = c.id ' +
      'LEFT OUTER JOIN images i ON p.main_image = i.id ORDER BY p.date DESC';

      con.query(query, (err, res) => {
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

   /* GET ALL BANQUET PRODUCTS */
   router.get("/get-banquet-products", (request, response) => {
      const query = 'SELECT p.id, p.name, p.short_description, p.price_m_meat as price_25, p.price_l_meat as price_50, ' +
          'i.file_path as main_image, i1.file_path as gallery_1, i2.file_path as gallery_2, i3.file_path as gallery_3 ' +
          'FROM products p ' +
          'LEFT OUTER JOIN images i ON p.main_image = i.id ' +
          'LEFT OUTER JOIN images i1 ON p.gallery_1 = i1.id ' +
          'LEFT OUTER JOIN images i2 ON p.gallery_2 = i2.id ' +
          'LEFT OUTER JOIN images i3 ON p.gallery_3 = i3.id ' +
          'WHERE p.category_id = 3';
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
      })
   });

   /* GET SINGLE PRODUCT BY ID */
   router.post("/get-product-by-id", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT name FROM products WHERE id = ?';
      con.query(query, values, (err, res) => {
         if(res[0]) {
            response.send({
               result: res[0].name
            });
         }
         else {
            response.send({
               result: 0
            });
         }
      })
   });

   /* GET SINGLE PRODUCT BY NAME */
   router.post("/get-product-by-name", (request, response) => {
      const { name } = request.body;
      const values = [name];
      /* Query uses custom MySQL function - SPLIT_STR */
      const query = 'SELECT p.id as id, p.name, p.bracket_name, p.price_m_meat, p.price_l_meat, p.price_m_vege, p.price_l_vege, ' +
          'p.short_description, p.long_description, p.meat_description, p.vege_description, p.category_id, p.date, p.vege, p.meat, p.m, p.l, i.file_path as file_path ' +
          'FROM products p JOIN images i ON i.id = p.main_image WHERE LOWER(SPLIT_STR(p.name, "/", 1)) = ?';
      con.query(query, values, (err, res) => {
         console.log(err);
         response.send({
            result: res
         });
      });
   });

   /* GET IMAGE BY ID */
   router.post("/get-image", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT file_path FROM images WHERE id = ?';
      con.query(query, values, (err, res) => {
         if(res[0]) {
            response.send({
               result: res[0]
            });
         }
         else {
            response.send({
               result: 0
            });
         }
      });
   })

   /* GET SINGLE PRODUCT DETAILS (CLIENT) */
   router.post("/single-product", (request, response) => {
      const { id } = request.body;
      console.log(request.body);
      const values = [id];
      const query = 'SELECT p.id as id, p.name, p.bracket_name, p.price_m_meat, p.price_l_meat, p.price_m_vege, p.price_l_vege, ' +
          'p.short_description, p.long_description, p.meat_description, p.vege_description, p.category_id, p.date, p.vege, p.meat, ' +
          'p.m, p.l, i.file_path as file_path, p.gallery_1, p.gallery_2, p.gallery_3 ' +
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
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT a.allergen FROM products p JOIN allergens a ON p.id = a.product_id WHERE p.id = ?'
      con.query(query, values, (err, res) => {
         if(!err) {
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
