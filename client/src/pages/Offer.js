import React from 'react'
import TopMenu from "../components/TopMenu";
import OfferContent from "../components/OfferContent";
import Footer from "../components/Footer";
import FullOffer from "../components/FullOffer";

const Offer = ({type}) => {
    return <>
        <TopMenu />
        {type === 'oferta' ? <FullOffer /> : <OfferContent type={type} />}
        <Footer />
        </>
}

export default Offer;
