import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelBlogContent from "../components/PanelBlogContent";

const PanelBlog = () => {
    return <main className="panel">
        <PanelMenu active={7} />
        <PanelBlogContent />
    </main>
}

export default PanelBlog;
