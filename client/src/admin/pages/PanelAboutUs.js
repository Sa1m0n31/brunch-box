import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelAboutUsContent from "../components/PanelAboutUsContent";

const PanelAboutUs = () => {
    return <main className="panel">
        <PanelMenu active={8} />
        <PanelAboutUsContent />
    </main>
}

export default PanelAboutUs;
