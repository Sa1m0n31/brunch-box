import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelOthersContent from "../components/PanelOthersContent";
import {Helmet} from "react-helmet";

const PanelOthers = () => {
    return <main className="panel">
        <Helmet>
            <title>Brunchbox | Inne</title>
        </Helmet>
        <PanelMenu active={11} />
        <PanelOthersContent />
    </main>
}

export default PanelOthers;
