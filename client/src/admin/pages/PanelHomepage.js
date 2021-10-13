import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelHomepageContent from "../components/PanelHomepageContent";

const PanelHomepage = () => {
    return <main className="panel">
        <PanelMenu active={12} />
        <PanelHomepageContent />
    </main>
}

export default PanelHomepage;
