const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");
const multer = require("multer");
const path = require("path");

con.connect(err => {
    /* ADD CATEGORY */
    router.post("/add", (request, response) => {
        /* Add images */
        let fileId = null;
        let filename = null;
        const storage = multer.diskStorage({
            destination: "media/categories/",
            filename: function(req, file, cb){
                const fName = file.fieldname + Date.now() + path.extname(file.originalname);
                filename = fName;
                cb(null, fName);
            }
        });

        const upload = multer({
            storage: storage
        }).fields([{name: "categoryImage"}]);

        upload(request, response, (err, res) => {
            if (err) throw err;

            /* Add images to database */
            if(!filename) addCategory();
            else {
                const values = ["categories/" + filename];
                const query = 'INSERT INTO images VALUES (NULL, ?)';
                con.query(query, values, (err, res) => {
                    console.log(err);
                    console.log("images error end");
                    fileId = res.insertId;
                    addCategory();
                });
            }
        });

        const addCategory = () => {
            let { name, parentId, header, subheader, hidden, nameEn, headerEn, subheaderEn } = request.body;
            hidden = hidden === "hidden";

            if(parentId === "0") parentId = null;

            if(name === "") {
                response.redirect("http://brunchbox.skylo-test3.pl/panel/kategorie?added=0");
                return 0;
            }

            const values = [`categories/${filename}`];
            const query = 'INSERT INTO images VALUES (NULL, ?)';
            con.query(query, values, (err, res) => {
                const values = [name, parentId, fileId, header, subheader, hidden, nameEn, headerEn, subheaderEn];
                const query = 'INSERT INTO categories VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

                con.query(query, values, (err, res) => {
                    console.log(err);
                    if(!err) response.redirect("http://brunchbox.skylo-test3.pl/panel/kategorie?added=1");
                    else response.redirect("http://brunchbox.skylo-test3.pl/panel/kategorie?added=-1")
                });
            });
        }
    });

    /* REMOVE CATEGORY */
    router.post("/delete", (request, response) => {
       const { id } = request.body;
       const values = [id];
       const query = 'DELETE FROM categories WHERE id = ?';
       con.query(query, values, (err, res) => {
           let result = 0;
           if(err) {
               result = -1;
               if(err.errno === 1451) result = 0;
           }
           if(res) result = 1;
           response.send({
               result
           });
       });
    });

    /* GET ALL CATEGORIES */
    router.get("/get-all", (request, response) => {
        con.query('SELECT c1.id as id, c1.name as name, c1.header as header, c1.subheader as subheader, c2.name as parent_name, i.file_path as img_path, c1.hidden as hidden, c1.name_en, c1.header_en, c1.subheader_en FROM categories c2 RIGHT OUTER JOIN categories c1 ON c1.parent_id = c2.id LEFT OUTER JOIN images i ON c1.image_id = i.id', (err, res) => {
           response.send({
               result: res
           });
        });
    });

    /* GET CATEGORY BY NAME */
    router.post("/get-category-by-name", (request, response) => {
       const { name } = request.body;
       const values = [name];
       const query = 'SELECT * FROM categories WHERE name = ?';
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

    /* GET CATEGORY DETAILS */
    router.post("/category-details", (request, response) => {
       const { id } = request.body;
       const query = 'SELECT * FROM categories WHERE id = ?';
       const values = [id];
       con.query(query, values, (err, res) => {
          if(res) {
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
    });

    /* UPDATE CATEGORY */
    router.post("/update", (request, response) => {
        /* Add images */
        let fileId = null;
        let filename = null;
        const storage = multer.diskStorage({
            destination: "media/categories/",
            filename: function(req, file, cb){
                const fName = file.fieldname + Date.now() + path.extname(file.originalname);
                filename = fName;
                cb(null, fName);
            }
        });

        const upload = multer({
            storage: storage
        }).fields([{name: "categoryImage"}]);

        upload(request, response, (err, res) => {
            if (err) throw err;

            /* Add images to database */
            if(!filename) updateCategory();
            else {
                const values = ["categories/" + filename];
                const query = 'INSERT INTO images VALUES (NULL, ?)';
                con.query(query, values, (err, res) => {
                    console.log(err);
                    console.log("images error end");
                    fileId = res.insertId;
                    updateCategory();
                });
            }
        });

        const updateCategory = () => {
            let { id, name, header, subheader, parentId, hidden, nameEn, headerEn, subheaderEn } = request.body;
            hidden = hidden === "hidden";
            id = parseInt(id);
            parentId = parseInt(parentId);
            if(!parentId) parentId = null;
            if(filename) {
                const values = [filename];
                const query = 'INSERT INTO images VALUES (NULL, ?)';
                con.query(query, values, (err, res) => {
                    const values = [name, parentId, res.insertId, header, subheader, hidden, nameEn, headerEn, subheaderEn, id];
                    const query = 'UPDATE categories SET name = ?, parent_id = ?, image_id = ?, header = ?, subheader = ?, hidden = ?, name_en = ?, header_en = ?, subheader_en = ? WHERE id = ?';

                    con.query(query, values, (err, res) => {
                        console.log(err);
                        let result = 0;
                        if(res) result = 1;
                        if(!err) response.redirect("http://brunchbox.skylo-test3.pl/panel/kategorie?added=2");
                        else response.redirect("http://brunchbox.skylo-test3.pl/panel/kategorie?added=-1")
                    });
                });
            }
            else {
                const values = [name, parentId, header, subheader, hidden, nameEn, headerEn, subheaderEn, id];
                const query = 'UPDATE categories SET name = ?, parent_id = ?, header = ?, subheader = ?, hidden = ?, name_en = ?, header_en = ?, subheader_en = ? WHERE id = ?';

                con.query(query, values, (err, res) => {
                    let result = 0;
                    if(res) result = 1;
                    if(!err) response.redirect("http://brunchbox.skylo-test3.pl/panel/kategorie?added=2");
                    else response.redirect("http://brunchbox.skylo-test3.pl/panel/kategorie?added=-1")
                });
            }
        }
    });
});

module.exports = router;
