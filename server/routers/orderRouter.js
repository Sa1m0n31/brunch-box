const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");

con.connect(err => {
   /* GET ALL ORDERS */
   router.get("/get-orders", (request, response) => {
      const query = 'SELECT o1.id as id, u.first_name, u.last_name, u.email, pm.name, sm.name as shipping_method, o2.payment_status, o2.order_status, o2.date ' +
          'FROM (SELECT o.id, SUM(s.quantity * p.price_m_meat) price FROM orders o ' +
          'JOIN sells s ON o.id = s.order_id ' +
          'JOIN products p ON p.id = s.product_id GROUP BY o.id) o1 ' +
          'JOIN orders o2 USING(id) JOIN users u ON u.id = o2.user ' +
          'LEFT OUTER JOIN payment_methods pm ON o2.payment_method = pm.id ' +
          'LEFT OUTER JOIN shipping_methods sm ON o2.shipping_method = sm.id';
      con.query(query, (err, res) => {
          console.log(res);
          console.log(err);
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
          console.log(err);
          let result = 0;
          if(res) result = 1;
          response.send({
              result
          });
       });
    });

   /* ADD ORDER */
   router.post("/add", (request, response) => {
       let { paymentMethod, shippingMethod, city, street, building, flat, postalCode, user, comment, ribbon } = request.body;
       if(ribbon === "") ribbon = null;
       if(flat === "") flat = null;
       building = parseInt(building) || 0;
       const values = [paymentMethod, shippingMethod, city, street, building, flat, postalCode, user, comment, ribbon];
       const query = 'INSERT INTO orders VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, "opłacone", "przyjęte do realizacji", CURRENT_TIMESTAMP, ?, ?)';
       con.query(query, values, (err, res) => {
          let result = 0;
          console.log("Welcome in /order/add");
          console.log(err);
          if(res) {
              if(res.insertId) result = res.insertId;
          }
          response.send({
              result
          });
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
       const { id } = request.body;
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
       const query = 'SELECT o.id, o.order_comment, o.payment_method, o.shipping_method, o.city, o.street, o.building, o.flat, o.postal_code, o.payment_status, o.date, p.name, p.price_m_meat, p.price_l_meat, p.price_l_vege, p.price_l_meat, s.quantity, s.option, s.size, u.first_name, u.last_name, u.phone_number, u.email FROM sells s JOIN orders o ON o.id = s.order_id JOIN products p ON s.product_id = p.id JOIN users u ON u.id = o.user WHERE order_id = ?';
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
});

module.exports = router;
