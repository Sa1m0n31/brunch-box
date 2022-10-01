import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelAboutUsContent from "../components/PanelAboutUsContent";
import PanelSliderContent from "../components/PanelSliderContent";
import {Helmet} from "react-helmet";

const PanelSlider = () => {
    return <main className="panel">
        <Helmet>
            <title>Brunchbox | Slider</title>
        </Helmet>
        <PanelMenu active={12} />
        <PanelSliderContent />
    </main>
}

export default PanelSlider;
