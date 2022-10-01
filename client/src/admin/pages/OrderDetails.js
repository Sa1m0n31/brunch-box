import React from 'react'

import PanelMenu from "../components/PanelMenu";
import OrderDetailsContent from "../components/OrderDetailsContent";
import {Helmet} from "react-helmet";

const OrderDetails = () => {
    return <>
        <Helmet>
            <title>Brunchbox | Szczegóły zamówienia</title>
        </Helmet>
        <PanelMenu active={2} />
        <OrderDetailsContent />
    </>
}

export default OrderDetails;
