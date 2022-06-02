const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");
const multer = require("multer");
const path = require("path");
const got = require("got");

con.connect(err => {
    router.get('/get', (request, response) => {
       const query = `SELECT * FROM slider`;

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

    router.post('/update', (request, response) => {
        /* Add images */
        let filenames = [];

        /* Add images */
        const storage = multer.diskStorage({
            destination: "media/slider/",
            filename: function(req, file, cb){
                const fName = file.fieldname + Date.now() + path.extname(file.originalname);
                filenames.push(fName);
                cb(null, fName);
            }
        });

        const upload = multer({
            storage: storage
        }).fields([{name: "slide1"}, {name: "slide2"}, {name: "slide3"}, {name: "slidebottom1"}, {name: "slidebottom2"}, {name: "slidebottom3"}, {name: "mobile1"}, {name: "mobile2"}, {name: "mobile3"}]);

        upload(request, response, (err, res) => {
            if(err) throw err;

            filenames.sort().reverse(); // First image - main image
            /* Add images to database */
            if(!filenames.length) updateProduct();
            else {
                updateProduct(filenames)
            }
        });

        const parseImageNames = (filenames) => {
            const slide1 = filenames.find((item) => {
                return item.split('1')[0] === 'slide';
            });
            const slide2 = filenames.find((item) => {
                return item.split('2')[0] === 'slide';
            });
            const slide3 = filenames.find((item) => {
                return item.split('3')[0] === 'slide';
            });
            const slideBottom1 = filenames.find((item) => {
                return item.split('1')[0] === 'slidebottom';
            });
            const slideBottom2 = filenames.find((item) => {
                return item.split('2')[0] === 'slidebottom';
            });
            const slideBottom3 = filenames.find((item) => {
                return item.split('3')[0] === 'slidebottom';
            });
            const slideMobile1 = filenames.find((item) => {
                return item.split('1')[0] === 'mobile';
            });
            const slideMobile2 = filenames.find((item) => {
                return item.split('2')[0] === 'mobile';
            });
            const slideMobile3 = filenames.find((item) => {
                return item.split('3')[0] === 'mobile';
            });

            return [slide1 ? slide1 : null,
                slide2 ? slide2 : null,
                slide3 ? slide3 : null,
                slideBottom1 ? slideBottom1 : null,
                slideBottom2 ? slideBottom2 : null,
                slideBottom3 ? slideBottom3 : null,
                slideMobile1 ? slideMobile1 : null,
                slideMobile2 ? slideMobile2 : null,
                slideMobile3 ? slideMobile3 : null,
            ];
        }

        const updateProduct = (filenames) => {
            const { language, slide1Header, slide2Header, slide3Header, slide1Text, slide2Text, slide3Text, slide1Btn, slide2Btn, slide3Btn, slide1Link, slide2Link, slide3Link,
                slideBottom1Header, slideBottom2Header, slideBottom3Header, slideBottom1Text, slideBottom2Text, slideBottom3Text, slideBottom1Link, slideBottom2Link, slideBottom3Link,
                afterSliderText, afterSliderBtn, afterMenu
            } = request.body;

            let query, values;
            if(filenames) {
                const folder = 'slider/';
                const files = parseImageNames(filenames).map((item) => {
                    if(item) {
                        return folder + item;
                    }
                    else {
                        return item;
                    }
                });

                query = `UPDATE slider SET slide1header = ?, slide2header = ?, slide3header = ?, slide1text = ?, slide2text = ?, slide3text = ?, 
                        slide1link = ?, slide2link = ?, slide3link = ?, slide1btn = ?, slide2btn = ?, slide3btn = ?, slidebottom1header = ?,
                        slidebottom2header = ?, slidebottom3header = ?, slidebottom1text = ?, slidebottom2text = ?, slidebottom3text = ?, 
                        slidebottom1link = ?, slidebottom2link = ?, slidebottom3link = ?, after_slider_text = ?, after_slider_btn = ?, after_menu = ?, slide1image = COALESCE(?, slide1image), slide2image = COALESCE(?, slide2image), slide3image = COALESCE(?, slide3image), 
                        slidebottom1image = COALESCE(?, slidebottom1image), slidebottom2image = COALESCE(?, slidebottom2image), slidebottom3image = COALESCE(?, slidebottom3image), mobile1 = COALESCE(?, mobile1), mobile2 = COALESCE(?, mobile2), mobile3 = COALESCE(?, mobile3) WHERE language = ?`;
                values = [slide1Header, slide2Header, slide3Header, slide1Text, slide2Text, slide3Text, slide1Link, slide2Link, slide3Link,
                    slide1Btn, slide2Btn, slide3Btn, slideBottom1Header, slideBottom2Header, slideBottom3Header, slideBottom1Text,
                    slideBottom2Text, slideBottom3Text, slideBottom1Link, slideBottom2Link, slideBottom3Link, afterSliderText, afterSliderBtn, afterMenu, files[0], files[1],
                    files[2], files[3], files[4], files[5], files[6], files[7], files[8], language];
            }
            else {
                query = `UPDATE slider SET slide1header = ?, slide2header = ?, slide3header = ?, slide1text = ?, slide2text = ?, slide3text = ?, 
                        slide1link = ?, slide2link = ?, slide3link = ?, slide1btn = ?, slide2btn = ?, slide3btn = ?, slidebottom1header = ?,
                        slidebottom2header = ?, slidebottom3header = ?, slidebottom1text = ?, slidebottom2text = ?, slidebottom3text = ?, 
                        slidebottom1link = ?, slidebottom2link = ?, slidebottom3link = ?, after_slider_text = ?, after_slider_btn = ?, after_menu = ? WHERE language = ?`;
                values = [slide1Header, slide2Header, slide3Header, slide1Text, slide2Text, slide3Text, slide1Link, slide2Link, slide3Link,
                    slide1Btn, slide2Btn, slide3Btn, slideBottom1Header, slideBottom2Header, slideBottom3Header, slideBottom1Text,
                    slideBottom2Text, slideBottom3Text, slideBottom1Link, slideBottom2Link, slideBottom3Link, afterSliderText, afterSliderBtn, afterMenu, language];
            }

            con.query(query, values, (err, res) => {
                console.log(err);
                if(res) response.redirect("https://brunchbox.pl/panel/slider");
                else response.redirect("https://brunchbox.pl/panel/slider");
            });
        }
    });
});

module.exports = router;
