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
            const { title, content } = request.body;
            const values = [title, content, fileId];
            const query = 'INSERT INTO posts VALUES (NULL, ?, ?, ?, CURRENT_TIMESTAMP)';
            con.query(query, values, (err, res) => {
               if(res) res.redirect("http://localhost:3000/panel/dodaj-wpis?add=1");
               else res.redirect("http://localhost:3000/panel/dodaj-wpis?add=0");
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
       const query = 'SELECT * FROM posts';
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

    /* GET SINGLE POST */
    router.post("/get-post-by-id", (request, response) => {
       const { id } = request.body;
       const values = [id];
       const query = 'SELECT * FROM posts WHERE id = ?';
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
});

module.exports = router;
