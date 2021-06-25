const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

/* Middleware */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/* Serve static frontend */
app.use(express.static(path.join(__dirname, '../client/build')));
app.get("/oferta-indywidualna", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/dla-grup", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/menu-bankietowe", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/dziekujemy", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/produkt", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/produkt/*", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/dostawa-i-platnosc", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/koszyk", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/panel", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/panel/*", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


/* Routers */
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const shippingRouter = require("./routers/shippingRouter");
const paymentMethodsRouter = require("./routers/paymetMethodsRouter");
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");
const orderRouter = require("./routers/orderRouter");
const imageRouter = require("./routers/imageRouter");
const paymentRouter = require("./routers/paymentRouter");

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/shipping", shippingRouter);
app.use("/payment-methods", paymentMethodsRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/image", imageRouter);
app.use("/payment", paymentRouter);

app.listen(5000, () => {
    console.log("Listening on port 5000");
});
