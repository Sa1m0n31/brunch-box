const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

/* Middleware */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/* Redirect http to https */
app.enable('trust proxy');
// app.use (function (req, res, next) {
//     if (req.secure) {
//         // request was via https, so do no special handling
//         next();
//     } else {
//         // request was via http, so redirect to https
//         res.redirect('https://' + req.headers.host + req.url);
//     }
// });

/* Serve static frontend */
app.use(express.static(path.join(__dirname, '../client/build')));
app.get("/oferta-indywidualna", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
/* TODO */
app.get("/oferta", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/blog", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/o-nas", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/kontakt", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/regulamin", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/polityka-prywatnosci", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
// app.get("/blog/*", (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });
app.get("/wpis/*", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/przekaski-dla-grup", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/przekaski-bankietowe", (req, res) => {
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
app.get("/przekaski-tematyczne", (req, res) => {
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
const blogRouter = require("./routers/blogRouter");
const aboutUsRouter = require("./routers/abousUsRouter");
const pagesRouter = require("./routers/pagesRouter");
const couponRouter = require("./routers/couponRouter");
const datesRouter = require("./routers/datesRouter");
const googleMapsRouter = require("./routers/googleMapsRouter");

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/shipping", shippingRouter);
app.use("/payment-methods", paymentMethodsRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/image", imageRouter);
app.use("/payment", paymentRouter);
app.use("/blog", blogRouter);
app.use("/about-us", aboutUsRouter);
app.use("/pages", pagesRouter);
app.use("/coupon", couponRouter);
app.use("/dates", datesRouter);
app.use("/maps", googleMapsRouter);

app.listen(5000, () => {
    console.log("Listening on port 5000");
});
