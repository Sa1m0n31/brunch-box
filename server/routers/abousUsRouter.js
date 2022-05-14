const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");
const multer = require("multer");
const path = require("path");
const got = require("got");

con.connect(err => {
    const auth = (sessionKey) => {
        return got.post("https://brunchbox.pl/auth/auth", {
            json: {
                sessionKey
            },
            responseType: 'json'
        });
    }

    /* Add new section */
    router.post("/add", (request, response) => {

        /* Add images */
        let fileId = null;
        let filename = null;
        const storage = multer.diskStorage({
            destination: "media/about-us/",
            filename: function(req, file, cb){
                const fName = file.fieldname + Date.now() + path.extname(file.originalname);
                filename = fName;
                cb(null, fName);
            }
        });

        const upload = multer({
            storage: storage
        }).fields([{name: "aboutUsImage"}]);

        const addSection = () => {
            let { header, content, header_en, content_en } = request.body;

            console.log(content);

            const values = [`about-us/${filename}`];
            const query = 'INSERT INTO images VALUES (NULL, ?)';
            con.query(query, values, (err, res) => {
                console.log(err);
                const values = [fileId, header, content || content === "" ? content : null, header_en, content_en || content_en === "" ? content_en : null];
                const query = 'INSERT INTO about_us VALUES (NULL, ?, ?, ?, ?, ?)';

                con.query(query, values, (err, res) => {
                    console.log(err);
                    if(!err) {
                        if(content) response.redirect("https://brunchbox.pl/panel/o-nas?added=1");
                        else response.redirect("https://brunchbox.pl/panel/strona-glowna?added=1");
                    }
                    else {
                        if(content) response.redirect("https://brunchbox.pl/panel/o-nas?added=-1");
                        else response.redirect("https://brunchbox.pl/panel/strona-glowna?added=-1");
                    }
                });
            });
        }

        upload(request, response, (err, res) => {
            if (err) throw err;

            /* Add images to database */
            if(!filename) addSection();
            else {
                const values = ["about-us/" + filename];
                const query = 'INSERT INTO images VALUES (NULL, ?)';
                con.query(query, values, (err, res) => {
                    fileId = res.insertId;
                    console.log(err);
                    addSection();
                });
            }
        });
    });

    /* Update section */
    router.post("/update", (request, response) => {
        console.log("update");

        /* Add images */
        let fileId = null;
        let filename = null;
        const storage = multer.diskStorage({
            destination: "media/about-us/",
            filename: function(req, file, cb){
                const fName = file.fieldname + Date.now() + path.extname(file.originalname);
                filename = fName;
                cb(null, fName);
            }
        });

        const upload = multer({
            storage: storage
        }).fields([{name: "aboutUsImage"}]);

        const updateSection = () => {
            let { id, header, content, header_en, content_en } = request.body;
            id = parseInt(id);
            if(filename) {
                const values = [filename];
                const query = 'INSERT INTO images VALUES (NULL, ?)';
                con.query(query, values, (err, res) => {
                    const values = [fileId, header, content || content === "" ? content : null, header_en, content_en || content_en === "" ? content_en : null, id];
                    const query = 'UPDATE about_us SET image = ?, header = ?, content = ?, header_en = ?, content_en = ? WHERE id = ?';

                    con.query(query, values, (err, res) => {
                        let result = 0;
                        if(res) result = 1;
                        if(!err) {
                            if(content) response.redirect("https://brunchbox.pl/panel/o-nas?added=2");
                            else response.redirect("https://brunchbox.pl/panel/strona-glowna?added=2");
                        }
                        else {
                            if(content) response.redirect("https://brunchbox.pl/panel/o-nas?added=-1");
                            else response.redirect("https://brunchbox.pl/panel/strona-glowna?added=-1");
                        }
                    });
                });
            }
            else {
                const values = [header, content, header_en, content_en, id];
                const query = 'UPDATE about_us SET header = ?, content = ?, header_en = ?, content_en = ? WHERE id = ?';

                con.query(query, values, (err, res) => {
                    let result = 0;
                    if(res) result = 1;
                    if(!err) {
                        if(content) response.redirect("https://brunchbox.pl/panel/o-nas?added=2");
                        else response.redirect("https://brunchbox.pl/panel/strona-glowna?added=2");
                    }
                    else {
                        if(content) response.redirect("https://brunchbox.pl/panel/o-nas?added=-1");
                        else response.redirect("https://brunchbox.pl/panel/strona-glowna?added=-1");
                    }
                });
            }
        }

        upload(request, response, (err, res) => {
            if (err) throw err;

            /* Add images to database */
            if(!filename) updateSection();
            else {
                const values = ["about-us/" + filename];
                const query = 'INSERT INTO images VALUES (NULL, ?)';
                con.query(query, values, (err, res) => {
                    fileId = res.insertId;
                    updateSection();
                });
            }
        });

    });

    /* Delete section */
    router.post("/delete", (request, response) => {
        const { id } = request.body;

        const values = [id];
        const query = 'DELETE FROM about_us WHERE id = ?';
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

    /* Get single section */
    router.post("/get-section", (request, response) => {
       const { id } = request.body;

       const values = [id];
       const query = 'SELECT a.id, a.header, a.header_en, a.content, a.content_en, i.file_path FROM about_us a JOIN images i ON a.image = i.id WHERE a.id = ?';
       con.query(query, values, (err, res) => {
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
       });
    });

    /* Get all sections */
    router.get("/get-all", (request, response) => {
       const query = 'SELECT a.id, a.header, a.content, a.header_en, a.content_en, i.file_path as img_path FROM about_us a LEFT OUTER JOIN images i ON a.image = i.id';
       con.query(query, (err, res) => {
           console.log(err);
           console.log(res);
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
});

module.exports = router;
