import React from 'react'
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import CustomMenuContent from "../components/CustomMenuContent";
import {Helmet} from "react-helmet";

const CustomMenu = () => {
    return <>
        <Helmet>
            <title>Brunchbox - przekąski na każdą okazję | Oferta</title>
        </Helmet>
        <TopMenu />
        <CustomMenuContent />
        <Footer />
    </>
}

export default CustomMenu;
