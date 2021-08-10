import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelDeliveryContent from "../components/PanelDeliveryContent";

const PanelDelivery = () => {
    return <main className="panel">
        <PanelMenu active={10} />
        <PanelDeliveryContent />
    </main>
}

export default PanelDelivery;
