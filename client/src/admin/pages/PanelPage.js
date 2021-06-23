import React from 'react'

import PanelMenu from "../components/PanelMenu";
import PanelStart from "../components/PanelStart";

const PanelPage = () => {
    return <main className="panel">
            <PanelMenu active={0} />
            <PanelStart />
    </main>
}

export default PanelPage;
