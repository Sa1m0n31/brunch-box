import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelOthersContent from "../components/PanelOthersContent";

const PanelOthers = () => {
    return <main className="panel">
        <PanelMenu active={11} />
        <PanelOthersContent />
    </main>
}

export default PanelOthers;
