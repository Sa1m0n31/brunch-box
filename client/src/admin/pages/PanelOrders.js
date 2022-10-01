import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelOrdersContent from "../components/PanelOrdersContent";
import {Helmet} from "react-helmet";

const PanelOrders = () => {
    return <main className="panel">
        <Helmet>
            <title>Brunchbox | Zamówienia</title>
        </Helmet>
        <PanelMenu active={2} />
        <PanelOrdersContent />
    </main>
}

export default PanelOrders;
