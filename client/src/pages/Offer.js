import React from 'react'
import TopMenu from "../components/TopMenu";
import OfferContent from "../components/OfferContent";
import Footer from "../components/Footer";
import FullOffer from "../components/FullOffer";
import {Helmet} from "react-helmet";

const Offer = ({type}) => {
    return <>
        <Helmet>
            <title>Brunchbox | Oferta</title>
        </Helmet>
        <TopMenu />
        {type === 'oferta' ? <FullOffer /> : <OfferContent type={type} />}
        <Footer />
        </>
}

export default Offer;
