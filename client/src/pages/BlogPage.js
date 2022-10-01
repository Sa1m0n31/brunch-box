import React from 'react'
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import BlogContent from "../components/BlogContent";
import {Helmet} from "react-helmet";

const BlogPage = () => {
    return <>
        <Helmet>
            <title>Brunchbox | Blog</title>
        </Helmet>
        <TopMenu />
        <BlogContent />
        <Footer />
    </>
}

export default BlogPage;
