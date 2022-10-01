import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelBlogContent from "../components/PanelBlogContent";
import {Helmet} from "react-helmet";

const PanelBlog = () => {
    return <main className="panel">
        <Helmet>
            <title>Brunchbox | Administracja blogiem</title>
        </Helmet>
        <PanelMenu active={7} />
        <PanelBlogContent />
    </main>
}

export default PanelBlog;
