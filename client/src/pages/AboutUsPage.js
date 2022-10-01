import React from 'react'
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import AboutUsContent from "../components/AboutUsContent";
import {Helmet} from "react-helmet";

const AboutUsPage = () => {
    return <div className="aboutUs">
        <Helmet>
            <title>Brunchbox | O nas</title>
        </Helmet>
        <TopMenu />
        <AboutUsContent />
        <Footer />
    </div>
}

export default AboutUsPage;
