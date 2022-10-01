import React from 'react'
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import SinglePostContent from "../components/SinglePostContent";
import {Helmet} from "react-helmet";

const SinglePostPage = () => {
    return <>
        <Helmet>
            <title>Brunchbox - przekąski na każdą okazję | Blog</title>
        </Helmet>
        <TopMenu />
        <SinglePostContent />
        <Footer />
    </>
}

export default SinglePostPage;
