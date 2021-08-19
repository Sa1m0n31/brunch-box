const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");
const multer = require("multer");
const path = require("path");

con.connect(err => {
    /* ADD POST */
    router.post("/add", (request, response) => {
        /* Add image */
        let fileId = null;
        let filename = null;
        const storage = multer.diskStorage({
            destination: "media/posts/",
            filename: function(req, file, cb) {
                const fName = file.fieldname + Date.now() + path.extname(file.originalname);
                filename = fName;
                cb(null, fName);
            }
        });

        const upload = multer({
            storage: storage
        }).fields([{name: "featuredImage"}]);

        upload(request, response, (err, res) => {
            if (err) throw err;

            /* Add images to database */
            if(!filename) addPost();
            else {
                const values = ["posts/" + filename];
                const query = 'INSERT INTO images VALUES (NULL, ?)';
                con.query(query, values, (err, res) => {
                    fileId = res.insertId;
                    addPost();
                });
            }
        });

        /* Add post */
        const addPost = () => {
            const { title, content, titleEn, contentEn } = request.body;
            const values = [title, content, fileId, titleEn, contentEn];
            const query = 'INSERT INTO posts VALUES (NULL, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)';
            con.query(query, values, (err, res) => {
               if(res) response.redirect("https://brunchbox.skylo-test3.pl/panel/dodaj-wpis?add=1");
               else response.redirect("https://brunchbox.skylo-test3.pl/panel/dodaj-wpis?add=0");
            });
        }
    });

    /* UPDATE POST */
    router.post("/update", (request, response) => {
        /* Add image */
        let fileId = null;
        let filename = null;
        const storage = multer.diskStorage({
            destination: "media/posts/",
            filename: function(req, file, cb) {
                const fName = file.fieldname + Date.now() + path.extname(file.originalname);
                filename = fName;
                cb(null, fName);
            }
        });

        const upload = multer({
            storage: storage
        }).fields([{name: "featuredImage"}]);

        upload(request, response, (err, res) => {
            if (err) throw err;

            /* Add images to database */
            if(!filename) updatePost();
            else {
                const values = ["posts/" + filename];
                const query = 'INSERT INTO images VALUES (NULL, ?)';
                con.query(query, values, (err, res) => {
                    fileId = res.insertId;
                    updatePost();
                });
            }
        });

        /* Add post */
        const updatePost = () => {
            const { id, title, content, titleEn, contentEn } = request.body;
            const values = [title, content, fileId, titleEn, contentEn, id];
            const query = 'UPDATE posts SET title = ?, content = ?, image = ?, title_en = ?, content_en = ? WHERE id = ?';
            con.query(query, values, (err, res) => {
                console.log(err);
                if(res) response.redirect("https://brunchbox.skylo-test3.pl/panel/dodaj-wpis?add=2");
                else response.redirect("https://brunchbox.skylo-test3.pl/panel/dodaj-wpis?add=0");
            });
        }
    });

    /* DELETE POST */
    router.post("/delete", (request, response) => {
        const { id } = request.body;
        const values = [id];
        const query = 'DELETE FROM posts WHERE id = ?';
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
    })

    /* GET ALL POSTS */
    router.get("/get-all", (request, response) => {
       const query = 'SELECT p.id as id, p.title, p.date, i.file_path as img_path, p.content, p.title_en, p.content_en FROM posts p LEFT OUTER JOIN images i ON p.image = i.id ORDER BY p.date DESC';
       con.query(query, (err, res) => {

           console.log(err);
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

    /* GET SINGLE POST */
    router.post("/get-post-by-id", (request, response) => {
       const { id } = request.body;
       const values = [id];
       const query = 'SELECT p.id, p.title, p.content, p.title_en, p.content_en, i.file_path as img_path FROM posts p LEFT OUTER JOIN images i ON p.image = i.id WHERE p.id = ?';
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

    /* GET POST BY TITLE */
    router.post("/get-post-by-title", (request, response) => {
       const { title } = request.body;
       const values = [title];

       console.log(title);

       const query = 'SELECT * FROM posts WHERE LOWER(title) = ?';
       con.query(query, values, (err, res) => {
           console.log(err);
           console.log(res);
           if(res) {
               response.send({
                   result: res[0]
               });
           }
           else {
               response.send({
                   result: 0
               })
           }
       })
    });
});

module.exports = router;
