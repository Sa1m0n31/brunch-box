import React from 'react'
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import Cart from "../components/Cart";
import {Helmet} from "react-helmet";

const CartPage = () => {
    return <>
        <Helmet>
            <title>Brunchbox | Koszyk</title>
        </Helmet>
        <TopMenu />
        <Cart />
        <Footer />
        </>
}

export default CartPage;
