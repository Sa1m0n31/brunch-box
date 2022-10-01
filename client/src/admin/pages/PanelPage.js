import React from 'react'

import PanelMenu from "../components/PanelMenu";
import PanelStart from "../components/PanelStart";
import {Helmet} from "react-helmet";

const PanelPage = () => {
    return <main className="panel">
        <Helmet>
            <title>Brunchbox | Panel admina</title>
        </Helmet>
            <PanelMenu active={0} />
            <PanelStart />
    </main>
}

export default PanelPage;
