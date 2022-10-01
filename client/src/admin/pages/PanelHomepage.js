import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelHomepageContent from "../components/PanelHomepageContent";
import {Helmet} from "react-helmet";

const PanelHomepage = () => {
    return <main className="panel">
        <Helmet>
            <title>Brunchbox | Homepage</title>
        </Helmet>
        <PanelMenu active={12} />
        <PanelHomepageContent />
    </main>
}

export default PanelHomepage;
