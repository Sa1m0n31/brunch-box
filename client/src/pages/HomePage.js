import React from 'react'
import TopMenu from "../components/TopMenu";
import Landing from "../components/Landing";
import HomePageSection from "../components/HomePageSection";
import Footer from "../components/Footer";
import AfterLanding from "../components/AfterLanding";

const HomePage = () => {
    return <>
        <TopMenu />
        <Landing />
        <AfterLanding />
        <Footer />
    </>
}

export default HomePage;
