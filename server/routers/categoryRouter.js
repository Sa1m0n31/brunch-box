const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: 'uploads/' });

con.connect(err => {
    /* ADD CATEGORY */
    router.post("/add", upload.single('categoryImage'), (request, response) => {
        let { name, parentId } = request.body;
        if(parentId === "0") parentId = null;

        if(name === "") {
            response.redirect("http://brunchbox.skylo-test3.pl/panel/kategorie?added=0");
            return 0;
        }

        if(request.file) {
            /* Add image to filesystem */
            const tempPath = request.file.path;
            const targetPath = path.join(__dirname, `./../media/categories/${request.file.originalname}`);

            fs.rename(tempPath, targetPath, err => {
                /* Add image to database */
                const values = [`categories/${request.file.originalname}`];
                const query = 'INSERT INTO images VALUES (NULL, ?, NULL)';
                con.query(query, values, (err, res) => {
                    const values = [name, parentId, res.insertId];
                    const query = 'INSERT INTO categories VALUES (NULL, ?, ?, ?)';

                    con.query(query, values, (err, res) => {
                        if(!err) response.redirect("http://brunchbox.skylo-test3.pl/panel/kategorie?added=1");
                        else response.redirect("http://brunchbox.skylo-test3.pl/panel/kategorie?added=-1")
                    });
                });
            });
        }
        else {
            /* Add only category, without image */
            const values = [name, parentId];
            const query = 'INSERT INTO categories VALUES (NULL, ?, ?, NULL)';

            con.query(query, values, (err, res) => {
                if(!err) response.redirect("http://brunchbox.skylo-test3.pl/panel/kategorie?added=1");
                else response.redirect("http://brunchbox.skylo-test3.pl/panel/kategorie?added=-1");
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
        con.query('SELECT c1.id as id, c1.name as name, c2.name as parent_name, i.file_path as img_path FROM categories c2 RIGHT OUTER JOIN categories c1 ON c1.parent_id = c2.id LEFT OUTER JOIN images i ON c1.image_id = i.id', (err, res) => {
           response.send({
               result: res
           });
        });
    });

    /* UPDATE CATEGORY */
    router.post("/update", (request, response) => {
        const { id, name, parentId, imagePath } = request.body;

        if(imagePath) {
            const values = [imagePath];
            const query = 'INSERT INTO images VALUES (NULL, NULL, ?)';
            con.query(query, values, (err, res) => {
                const values = [name, parentId, res.insertId, id];
                const query = 'UPDATE categories SET name = ?, parent_id = ?, image_id = ? WHERE id = ?';

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
            const values = [name, parentId, id];
            const query = 'UPDATE categories SET name = ?, parent_id = ? WHERE id = ?';

            con.query(query, values, (err, res) => {
                let result = 0;
                if(res) result = 1;
                response.send({
                    result
                });
            });
        }
    })
});

module.exports = router;
