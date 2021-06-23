const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");
const crypto = require("crypto");

con.connect((err) => {
    /* GET LIST OF USERS */
    router.get("/get-all-users", (request, response) => {
        con.query(`SELECT * FROM users`, (err, res) => {
            response.send({
                result: res
            });
        })
    });

    /* GET LIST OF ADMINS */
    router.get("/get-all-admins", (request, response) => {
        con.query(`SELECT * FROM admins`, (err, res) => {
            response.send({
                result: res
            });
        })
    });

    /* GET USER DATA */
    router.post("/get-user", (request, response) => {
       const userId = request.body.id;
       const values = [userId];
       const query = 'SELECT * FROM users WHERE id = ?';

       con.query(query, values, (err, res) => {
           if(err) {
               response.send({
                   result: -1
               });
           }
           else {
               response.send({
                   result: res[0]
               });
           }
       })
    });

    /* DELETE ADMIN */
    router.post("/delete-admin", (request, response) => {
       const adminId = request.body.id;
       const values = [adminId];
       const query = 'DELETE FROM admins WHERE id = ?';

       con.query(query, values, (err, res) => {
           let result;
           if(err) result = 0;
           else result = 1;
           response.send({
               result
           });
       });
    });

    /* CHANGE ADMIN PASSWORD */
    router.post("/change-admin-password", (request, response) => {
        const { username, oldPassword, newPassword } = request.body;

        /* Check if old password is correct */
        const hash = crypto.createHash('md5').update(oldPassword).digest('hex');
        const query = 'SELECT id FROM admins WHERE username = ? AND password = ?';
        const values = [username, hash];
        con.query(query, values, (err, res) => {
           if(err) {
               response.send({
                   result: -1
               });
           }

           if(res[0]) {
               /* If correct - change it */
               const newHash = crypto.createHash('md5').update(newPassword).digest('hex');
               const query = 'UPDATE admins SET password = ? WHERE id = ?';
               const values = [newHash, res[0].id];
               con.query(query, values, (err, res) => {
                  response.send({
                      result: 1
                  });
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
