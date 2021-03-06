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

      /* Remove all allergens for current product */
      const values = [id];
      const query = 'DELETE FROM allergens WHERE product_id = ?';
      con.query(query, values, (err, res) => {
         if(allergens) {
            allergens.forEach((item, index, array) => {
               const values = [id, item];
               const query = 'INSERT INTO allergens VALUES (NULL, ?, ?)';
               con.query(query, values);

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
      }).fields([{name: "mainImage"}, {name: "gallery1"}, {name: "gallery2"}, {name: "gallery3"}, {name: "gallery4"}, {name: "gallery5"}]);

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
         for(let i=len; i<6; i++) filesId.push(null);

         /* Add product to database */
         let { id, name, bracketName, categoryId, shortDescription, longDescription, meatDescription, vegeDescription, meatDescriptionM, vegeDescriptionM, meatDescriptionS, vegeDescriptionS, priceM_meat, priceL_meat, priceM_vege, priceL_vege, priceS_meat, priceS_vege, m, l, s, vegan, meat, hidden, priority } = request.body;
         if(priceL_meat !== '') priceL_meat = parseFloat(priceL_meat);
         else priceL_meat = null;
         if(priceM_meat !== '') priceM_meat = parseFloat(priceM_meat);
         else priceM_meat = null;
         if(priceL_vege !== '') priceL_vege = parseFloat(priceL_vege);
         else priceL_vege = null;
         if(priceM_vege !== '') priceM_vege = parseFloat(priceM_vege);
         else priceM_vege = null;
         if(priceS_meat !== '') priceS_meat = parseFloat(priceS_meat);
         else priceS_meat = null;
         if(priceS_vege !== '') priceS_vege = parseFloat(priceS_vege);
         else priceS_vege = null;

         m = m === 'true' || m == 1;
         l = l === 'true' || l == 1;
         s = s === 'true' || s == 1;
         vegan = vegan === 'true' || vegan == 1;
         meat = meat === 'true' || meat == 1;
         hidden = hidden === "hidden";

         categoryId = parseInt(categoryId);

         if(isNaN(priceM_vege)) priceM_vege = null;
         if(isNaN(priceL_vege)) priceL_vege = null;
         if(isNaN(priceM_meat)) priceM_meat = null;
         if(isNaN(priceL_meat)) priceL_meat = null;
         if(isNaN(priceS_vege)) priceS_vege = null;
         if(isNaN(priceS_meat)) priceS_vege = null;

            /* Add image to database */
            const values = [id, name, priceM_meat, priceL_meat, priceS_meat, priceM_vege, priceL_vege, priceS_vege,
               shortDescription, longDescription, meatDescription, vegeDescription, meatDescriptionM, vegeDescriptionM, meatDescriptionS, vegeDescriptionS,
               filesId[0], categoryId, bracketName, vegan, meat, m, l, s, filesId[1], filesId[2], filesId[3], filesId[4], filesId[5], hidden, priority];
            const query = 'INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            con.query(query, values, (err, res) => {
               if(res) response.redirect("https://brunchbox.pl/panel/dodaj-produkt?add=1");
               else response.redirect("https://brunchbox.pl/panel/dodaj-produkt?add=0");
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
      }).fields([{name: "mainImage"}, {name: "gallery1"}, {name: "gallery2"}, {name: "gallery3"}, {name: "gallery4"}, {name: "gallery5"}]);

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
         let { id, deleteImg0, deleteImg1, deleteImg2, deleteImg3, deleteImg4, deleteImg5, name, bracketName, categoryId, shortDescription, longDescription, meatDescription, vegeDescription, meatDescriptionM, vegeDescriptionM, meatDescriptionS, vegeDescriptionS, priceM_meat, priceL_meat, priceM_vege, priceL_vege, priceS_meat, priceS_vege, m, l, s, vegan, meat, hidden, priority } = request.body;
         if(priceL_meat !== '') priceL_meat = parseFloat(priceL_meat);
         else priceL_meat = null;
         if(priceM_meat !== '') priceM_meat = parseFloat(priceM_meat);
         else priceM_meat = null;
         if(priceL_vege !== '') priceL_vege = parseFloat(priceL_vege);
         else priceL_vege = null;
         if(priceM_vege !== '') priceM_vege = parseFloat(priceM_vege);
         else priceM_vege = null;
         if(priceS_meat !== '') priceS_meat = parseFloat(priceS_meat);
         else priceS_meat = null;
         if(priceS_vege !== '') priceS_vege = parseFloat(priceS_vege);
         else priceS_vege = null;

         m = m === 'true' || m == 1;
         l = l === 'true' || l == 1;
         s = s === 'true' || s == 1;
         vegan = vegan === 'true' || vegan == 1;
         meat = meat === 'true' || meat == 1;
         hidden = hidden === "hidden";

         if(isNaN(priceM_vege)) priceM_vege = null;
         if(isNaN(priceL_vege)) priceL_vege = null;
         if(isNaN(priceM_meat)) priceM_meat = null;
         if(isNaN(priceL_meat)) priceL_meat = null;
         if(isNaN(priceS_vege)) priceS_vege = null;
         if(isNaN(priceS_meat)) priceS_vege = null;

         categoryId = parseInt(categoryId);

         /* Delete images */
         if(deleteImg0) {
            const query = 'UPDATE products SET main_image = NULL WHERE id = ?';
            const values = [id];
            con.query(query, values);
         }
         if(deleteImg1) {
            const query = 'UPDATE products SET gallery_1 = NULL WHERE id = ?';
            const values = [id];
            con.query(query, values);
         }
         if(deleteImg2) {
            const query = 'UPDATE products SET gallery_2 = NULL WHERE id = ?';
            const values = [id];
            con.query(query, values);
         }
         if(deleteImg3) {
            const query = 'UPDATE products SET gallery_3 = NULL WHERE id = ?';
            const values = [id];
            con.query(query, values);
         }
         if(deleteImg4) {
            const query = 'UPDATE products SET gallery_4 = NULL WHERE id = ?';
            const values = [id];
            con.query(query, values);
         }
         if(deleteImg5) {
            const query = 'UPDATE products SET gallery_5 = NULL WHERE id = ?';
            const values = [id];
            con.query(query, values);
         }

         /* Add product without main image */
         const values = [name, priceM_meat, priceL_meat, priceS_meat, priceM_vege, priceL_vege, priceS_vege,
            shortDescription, longDescription, meatDescription, vegeDescription, meatDescriptionM, vegeDescriptionM, meatDescriptionS, vegeDescriptionS,
            categoryId, bracketName, vegan, meat, m, l, s, hidden, priority, id];
         const query = 'UPDATE products SET name = ?, price_m_meat = ?, price_l_meat = ?, price_s_meat = ?, price_m_vege = ?, price_l_vege = ?, price_s_vege = ?, ' +
             'short_description = ?, long_description = ?, meat_description = ?, vege_description = ?, meat_description_m = ?, vege_description_m = ?, meat_description_s = ?, vege_description_s = ?, category_id = ?, bracket_name = ?, ' +
             'vege = ?, meat = ?, m = ?, l = ?, s = ?, hidden = ?, priority = ? ' +
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
               const values = [filesId[gallery3Index], id];
               const query = 'UPDATE products SET gallery_3 = ? WHERE id = ?';
               con.query(query, values);
            }

            const gallery4Index = filenames.findIndex((item) => {
               if(item) {
                  return item.search(/gallery4.*/g, "i") !== -1
               }
               else return false;
            });
            if(gallery4Index !== -1) {
               const values = [filesId[gallery4Index], id];
               const query = 'UPDATE products SET gallery_4 = ? WHERE id = ?';
               con.query(query, values);
            }

            const gallery5Index = filenames.findIndex((item) => {
               if(item) {
                  return item.search(/gallery5.*/g, "i") !== -1
               }
               else return false;
            });
            if(gallery5Index !== -1) {
               const values = [filesId[gallery3Index], id];
               const query = 'UPDATE products SET gallery_5 = ? WHERE id = ?';
               con.query(query, values);
            }

            if(res) response.redirect("https://brunchbox.pl/panel/dodaj-produkt?add=1");
            else response.redirect("https://brunchbox.pl/panel/dodaj-produkt?add=0");
         });
      }
   });

   /* REMOVE PRODUCT */
   router.post("/delete", (request, response) => {
      const { id } = request.body;
      const values = [id];

      const query = 'DELETE FROM products WHERE id = ?';
      con.query(query, values, (err, res) => {
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
      const query = 'SELECT p.id, p.name as product_name, p.bracket_name, i.file_path as image, p.price_m_meat, p.price_l_meat, p.price_m_vege, p.price_l_vege, p.date, COALESCE(c.name, "Brak") as category_name, p.hidden, p.priority FROM products p ' +
      'LEFT OUTER JOIN categories c ON p.category_id = c.id ' +
      'LEFT OUTER JOIN images i ON p.gallery_1 = i.id ORDER BY p.date DESC';

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

   /* Get product gallery */
   router.post("/get-gallery", (request, response) => {
      const { id } = request.body;
      let gallery = [];
      const values = [id];
      const query1 = 'SELECT i.file_path FROM images i JOIN products p ON i.id = p.main_image WHERE p.id = ?';
      const query2 = 'SELECT i.file_path FROM images i JOIN products p ON i.id = p.gallery_1 WHERE p.id = ?';
      const query3 = 'SELECT i.file_path FROM images i JOIN products p ON i.id = p.gallery_2 WHERE p.id = ?';
      const query4 = 'SELECT i.file_path FROM images i JOIN products p ON i.id = p.gallery_3 WHERE p.id = ?';
      const query5 = 'SELECT i.file_path FROM images i JOIN products p ON i.id = p.gallery_4 WHERE p.id = ?';
      const query6 = 'SELECT i.file_path FROM images i JOIN products p ON i.id = p.gallery_5 WHERE p.id = ?';

      con.query(query1, values, (err, res) => {
         if(res) if(res[0]) { gallery.push(res[0].file_path) } else { gallery.push(null) }
         else gallery.push(null);
         con.query(query2, values, (err, res) => {
            if(res) if(res[0]) { gallery.push(res[0].file_path) } else { gallery.push(null) }
            else gallery.push(null);
            con.query(query3, values, (err, res) => {
               if(res) if(res[0]) { gallery.push(res[0].file_path) } else { gallery.push(null) }
               else gallery.push(null);
               con.query(query4, values, (err, res) => {
                  if(res) if(res[0]) { gallery.push(res[0].file_path) } else { gallery.push(null) }
                  else gallery.push(null);
                  con.query(query5, values, (err, res) => {
                     if(res) if(res[0]) { gallery.push(res[0].file_path) } else { gallery.push(null) }
                     else gallery.push(null);
                     con.query(query6, values, (err, res) => {
                        if (res) if (res[0]) {
                           gallery.push(res[0].file_path)
                        } else {
                           gallery.push(null)
                        }
                        else gallery.push(null);
                        if (res) {
                           response.send({
                              result: gallery
                           });
                        } else {
                           response.send({
                              result: 0
                           });
                        }
                     })
                  })
               })
            })
         })
      });
   });

   /* GET SINGLE PRODUCT BY NAME */
   router.post("/get-product-by-name", (request, response) => {
      const { name } = request.body;
      const values = [name];
      /* Query uses custom MySQL function - SPLIT_STR */
      const query = 'SELECT p.id as id, p.name, p.bracket_name, p.price_m_meat, p.price_l_meat, p.price_m_vege, p.price_l_vege, ' +
          'p.short_description, p.long_description, p.meat_description, p.vege_description, p.meat_description_m, p.vege_description_m, p.category_id, p.date, p.vege, p.meat, p.m, p.l, i.file_path as file_path ' +
          'FROM products p LEFT OUTER JOIN images i ON i.id = p.main_image WHERE LOWER(SPLIT_STR(p.name, "/", 1)) = ?';
      con.query(query, values, (err, res) => {
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
      const values = [id];
      const query = 'SELECT p.id as id, p.name, p.bracket_name, p.price_m_meat, p.price_l_meat, p.price_m_vege, p.price_l_vege, ' +
          'p.short_description, p.long_description, p.meat_description, p.vege_description, p.meat_description_m, p.vege_description_m, p.category_id, p.date, p.vege, p.meat, ' +
          'p.m, p.l, i.file_path as file_path, p.gallery_1, p.gallery_2, p.gallery_3, p.gallery_4, p.gallery_5 ' +
          'FROM products p LEFT OUTER JOIN images i ON i.id = p.main_image WHERE p.id = ?';
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
