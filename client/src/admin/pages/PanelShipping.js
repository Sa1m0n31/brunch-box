import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelShippingContent from "../components/PanelShippingContent";
import {Helmet} from "react-helmet";

const PanelShipping = () => {
    return <main className="panel">
        <Helmet>
            <title>Brunchbox | Wysyłka</title>
        </Helmet>
        <PanelMenu active={4} />
        <PanelShippingContent />
    </main>
}

export default PanelShipping;
