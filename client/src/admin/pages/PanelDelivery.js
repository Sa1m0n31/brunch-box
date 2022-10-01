import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelDeliveryContent from "../components/PanelDeliveryContent";
import {Helmet} from "react-helmet";

const PanelDelivery = () => {
    return <main className="panel">
        <Helmet>
            <title>Brunchbox | Dostawa</title>
        </Helmet>
        <PanelMenu active={10} />
        <PanelDeliveryContent />
    </main>
}

export default PanelDelivery;
