import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelCouponsContent from "../components/PanelCouponsContent";
import {Helmet} from "react-helmet";

const PanelCoupons = () => {
    return <main className="panel">
        <Helmet>
            <title>Brunchbox | Kody rabatowe</title>
        </Helmet>
        <PanelMenu active={9} />
        <PanelCouponsContent />
    </main>
}

export default PanelCoupons;
