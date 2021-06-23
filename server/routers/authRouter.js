const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const con = require("../databaseConnection");

con.connect(function(err) {
   const addSessionRow = () => {
       /* Add session row */
       const sessionKey = uuidv4();
       const values = [sessionKey];
       const query = 'INSERT INTO sessions VALUES (NULL, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 MINUTE))';
       con.query(query, values);
       return sessionKey;
   }

    const updateSession = (id) => {
       const values = [id];
       const query = 'UPDATE sessions SET expire_date = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 MINUTE) WHERE id = ?';
       con.query(query, values);
    }

    /* ADD USER */
    router.post("/add-user", (request, response) => {
       const { firstName, lastName, email, phoneNumber } = request.body;
       const randomUser = uuidv4();

       const values = [firstName, lastName, email, randomUser, phoneNumber];
       const query = 'INSERT INTO users VALUES (NULL, ?, ?, ?, ?, "abc", NULL, NULL, NULL, NULL, NULL, ?)'
       con.query(query, values, (err, res) => {
          let result = 0;
          console.log(err);
          if(res) result = res.insertId;
          response.send({
              result
          });
       });
    });

   /* REGISTER USER */
   router.post("/register-user", (request, response) => {
       const username = request.body.username;
       const email = request.body.email;
       const password = request.body.password;
       const hash = crypto.createHash('md5').update(password).digest('hex');

       const values = [email, username, hash];
       const query = 'INSERT INTO users VALUES (NULL, NULL, NULL, ?, ?, ?, NULL, NULL, NULL, NULL, NULL, NULL)'

       con.query(query, values, (err, res) => {
          if(err) {
              /* Error - user not registered */
              let error;
              if(err.errno === 1062) error = 0;
              else error = -1;
              response.send({
                  result: error
              });
          }
          else {
              /* Success - user registered */
              response.send({
                  result: 1
              });
          }
       });

   });

   /* REGISTER ADMIN */
   router.post("/register-admin", (request, response) => {
       const username = request.body.username;
       const email = request.body.email;
       const password = request.body.password;
       const hash = crypto.createHash('md5').update(password).digest('hex');

       const values = [username, hash, email];
       const query = 'INSERT INTO admins VALUES (NULL, ?, ?, ?)';

       con.query(query, values, (err, res) => {
           if(err) {
               /* Error - user not registered */
               let error;
               if(err.errno === 1062) error = 0;
               else error = -1;
               response.send({
                   result: error
               });
           }
           else {
               /* Success - user registered */
               response.send({
                   result: 1
               });
           }
       });
   });

   /* LOGIN USER */
    router.post("/login-user", (request, response) => {
        const username = request.body.username;
        const password = request.body.password;
        const hash = crypto.createHash('md5').update(password).digest('hex');

        const values = [username, hash];
        const query = 'SELECT id FROM users WHERE username = ? AND password = ?';
        let sessionKey;

        con.query(query, values, (err, res) => {
            let result, id = 0;
            if(err) result = -1;
            else {
                if(res.length === 0) result = 0;
                else {
                    result = 1;
                    id = res[0].id;
                    sessionKey = addSessionRow();
                }
            }

            response.send({
                result,
                id,
                sessionKey
            });
        });
    });

    /* LOGIN ADMIN */
    router.post("/login-admin", (request, response) => {
        const username = request.body.username;
        const password = request.body.password;
        const hash = crypto.createHash('md5').update(password).digest('hex');
        let sessionKey;

        const values = [username, hash];
        const query = 'SELECT id FROM admins WHERE username = ? AND password = ?';

        con.query(query, values, (err, res) => {
            let result, id = 0;
            if(err) result = -1;
            else {
                if(res.length === 0) result = 0;
                else {
                    result = 1;
                    id = res[0].id;
                    sessionKey = addSessionRow();
                }
            }

            response.send({
                result,
                id,
                sessionKey,
                username
            });
        });
    });

    /* AUTH USER */
    router.post("/auth", (request, response) => {
        const sessionKey = request.body.sessionKey;

        const values = [sessionKey];
        const query = 'SELECT id, expire_date FROM sessions WHERE session_key = ? ORDER BY id DESC LIMIT 1';

        con.query(query, values, (err, res) => {
            let result;
            if((err)||(!res.length)) result = 0;
            else {
                /* Check if session has expire date */
                const currentDate = new Date();
                const sessionDate = new Date(res[0].expire_date);

                if(currentDate < sessionDate) {
                    /* Update session */
                    updateSession(res[0].id);

                    result = 1;
                }
                else result = 0;
            }

            response.send({
                result
            })
        });
    });

    /* LOGOUT USER */
    router.post("/logout", (request, response) => {
        const sessionKey = request.body.sessionKey;

        const values = [sessionKey];
        const query = 'DELETE FROM sessions WHERE session_key = ?';

        con.query(query, values, (err, res) => {
           response.send({
               result: 1
           });
        });
    });
});

module.exports = router;
