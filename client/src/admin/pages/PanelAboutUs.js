import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelAboutUsContent from "../components/PanelAboutUsContent";
import {Helmet} from "react-helmet";

const PanelAboutUs = () => {
    return <main className="panel">
        <Helmet>
            <title>Brunchbox | O nas - administracja</title>
        </Helmet>
        <PanelMenu active={8} />
        <PanelAboutUsContent />
    </main>
}

export default PanelAboutUs;
