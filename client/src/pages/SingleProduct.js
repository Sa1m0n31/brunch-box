import React from 'react'
import TopMenu from "../components/TopMenu";
import SingleProductContent from "../components/SingleProductContent";
import Footer from "../components/Footer";
import {Helmet} from "react-helmet";

const SingleProduct = () => {
    return <div className="singleProductPage">
        <TopMenu />
        <SingleProductContent />
        <Footer />
    </div>
}

export default SingleProduct;
