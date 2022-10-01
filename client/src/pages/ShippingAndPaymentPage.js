import React from 'react'
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import ShippingAndPayment from "../components/ShippingAndPayment";
import {Helmet} from "react-helmet";

const ShippingAndPaymentPage = () => {
    return <>
        <Helmet>
            <title>Brunchbox | Zamówienie</title>
        </Helmet>
        <TopMenu />
        <ShippingAndPayment />
        <Footer />
    </>
}

export default ShippingAndPaymentPage;
