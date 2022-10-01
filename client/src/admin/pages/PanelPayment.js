import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelPaymentContent from "../components/PanelPaymentContent";
import {Helmet} from "react-helmet";

const PanelPayment = () => {
    return <main className="panel">
        <Helmet>
            <title>Brunchbox | Płatności</title>
        </Helmet>
        <PanelMenu active={5} />
        <PanelPaymentContent />
    </main>
}

export default PanelPayment;
