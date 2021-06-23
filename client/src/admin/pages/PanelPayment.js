import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelPaymentContent from "../components/PanelPaymentContent";

const PanelPayment = () => {
    return <main className="panel">
        <PanelMenu active={5} />
        <PanelPaymentContent />
    </main>
}

export default PanelPayment;
