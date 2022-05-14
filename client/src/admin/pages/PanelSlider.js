import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelAboutUsContent from "../components/PanelAboutUsContent";
import PanelSliderContent from "../components/PanelSliderContent";

const PanelSlider = () => {
    return <main className="panel">
        <PanelMenu active={12} />
        <PanelSliderContent />
    </main>
}

export default PanelSlider;
