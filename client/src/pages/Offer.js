import React from 'react'
import TopMenu from "../components/TopMenu";
import OfferContent from "../components/OfferContent";
import Footer from "../components/Footer";

const Offer = ({type}) => {
    return <>
        <TopMenu />
        <OfferContent type={type} />
        <Footer />
        </>
}

export default Offer;
