import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelOrdersContent from "../components/PanelOrdersContent";

const PanelOrders = () => {
    return <main className="panel">
        <PanelMenu active={2} />
        <PanelOrdersContent />
    </main>
}

export default PanelOrders;
