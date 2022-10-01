import React from 'react'
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import ContactContent from "../components/ContactContent";
import {Helmet} from "react-helmet";

const ContactPage = () => {
    return <>
        <Helmet>
            <title>Brunchbox | Kontakt</title>
        </Helmet>
        <TopMenu />
        <ContactContent />
        <Footer />
    </>
}

export default ContactPage;
