const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");
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

   /* GET ALL ORDERS */
   router.get("/get-orders", (request, response) => {
       const query = 'SELECT o1.id as id, u.first_name, u.last_name, u.email, pm.name, o2.payment_status, o2.order_status, DATE_ADD(o2.date, INTERVAL 2 HOUR) as date, o2.przelewy24_id as przelewy24_id ' +
           'FROM (SELECT o.id, SUM(s.quantity * p.price_m_meat) price FROM orders o ' +
           'JOIN sells s ON o.id = s.order_id ' +
           'JOIN products p ON p.id = s.product_id GROUP BY o.id) o1 ' +
           'JOIN orders o2 USING(id) JOIN users u ON u.id = o2.user ' +
           'LEFT OUTER JOIN payment_methods pm ON o2.payment_method = pm.id';
       con.query(query, (err, res) => {
           response.send({
               result: res
           });
       });
   });

   /* ADD SELL */
    router.post("/add-sell", (request, response) => {
       let { productId, orderId, quantity, option, size } = request.body;
       const values = [orderId, productId, quantity, option, size];
       const query = 'INSERT INTO sells VALUES (NULL, ?, ?, ?, ?, ?)';
       con.query(query, values, (err, res) => {
          if(res) {
              response.send({
                  result: res.insertId
              });
          }
          else {
              response.send({
                  result: null
              });
          }
       });
    });

    /* ADD RIBBON */
    router.post("/add-ribbon", (request, response) => {
       let { orderId, caption } = request.body;
       const values = [orderId, caption];
       const query = 'INSERT INTO ribbons VALUES (NULL, ?, ?)';
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

   /* ADD ORDER */
   router.post("/add", (request, response) => {
       let { paymentMethod, shippingMethod, orderPrice, city, street, postalCode, sessionId, user, comment, delivery, companyName, nip, companyCity, companyPostalCode, companyStreet, discountCode, discountInPLN } = request.body;
       const values = [paymentMethod, shippingMethod, city, street, postalCode, user, comment, delivery, sessionId, companyName, nip, companyCity, companyPostalCode, companyStreet, orderPrice, discountCode, discountInPLN];
       const query = 'INSERT INTO orders VALUES (NULL, ?, ?, ?, ?, ?, ?, "nieopłacone", "przyjęte do realizacji", CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

       con.query(query, values, (err, res) => {
           let result = 0;
           if(res) {
               if(res.insertId) result = res.insertId;

               response.send({
                   result
               });
           }
       });
   });

   /* CHANGE PAYMENT STATUS */
    router.post("/change-payment-status", (request, response) => {
       const { id, status } = request.body;
       const values = [status, id];
       const query = 'UPDATE orders SET payment_status = ? WHERE id = ?';
       con.query(query, values, (err, res) => {
          let result = 0;
          if(res) result = 1;
          response.send({
              result
          });
       });
    });

    /* CHANGE ORDER STATUS */
    router.post("/change-order-status", (request, response) => {
       const { id, status } = request.body;
       const values = [status, id];
       const query = 'UPDATE orders SET order_status = ? WHERE id = ?';
       con.query(query, values, (err, res) => {
           let result = 0;
           if(res) result = 1;
           response.send({
               result
           });
       });
    });

    /* REMOVE ORDER */
    router.post("/delete", (request, response) => {
       const { sessionKey, id } = request.body;

        const values = [id];
        const query = 'DELETE FROM orders WHERE id = ?';
        con.query(query, values, (err, res) => {
            let result = 0;
            if(res) result = 1;
            response.send({
                result
            });
        });
    });

    /* GET ORDER DETAILS */
    router.post("/get-order", (request, response) => {
       const { id } = request.body;

        const values = [id];
        const query = 'SELECT o.id, o.order_price, o.order_comment, o.delivery, o.payment_method, o.shipping_method, o.city, o.street, o.postal_code, o.przelewy24_id, o.discount, o.discount_code, ' +
            'o.payment_status, DATE_ADD(o.date, INTERVAL 2 HOUR) as date, o.company_name, o.nip, o.company_city, o.company_postal_code, o.company_address, o.order_price, p.name, p.price_m_meat, p.price_l_meat, p.price_m_vege, p.price_l_vege, s.quantity, s.option, s.size, ' +
            'u.first_name, u.last_name, u.phone_number, u.email FROM sells s JOIN orders o ON o.id = s.order_id JOIN products p ' +
            'ON s.product_id = p.id JOIN users u ON u.id = o.user WHERE order_id = ?';
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

    /* GET ORDER RIBBONS */
    router.post("/get-ribbons", (request, response) => {
       const { id } = request.body;

        const values = [id];
        const query = 'SELECT r.caption FROM ribbons r JOIN orders o ON r.order_id = o.id WHERE o.id = ?';
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
});

module.exports = router;
