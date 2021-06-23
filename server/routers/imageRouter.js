const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

router.get("/", (request, response) => {
    const { url } = request.query;
    response.set({'Content-Type': 'image/png'});
    response.sendFile(path.join(__dirname, '../', url));
});

module.exports = router;
