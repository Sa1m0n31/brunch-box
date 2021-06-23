import React from 'react'

import PanelMenu from "../components/PanelMenu";
import OrderDetailsContent from "../components/OrderDetailsContent";

const OrderDetails = () => {
    return <>
        <PanelMenu active={2} />
        <OrderDetailsContent />
    </>
}

export default OrderDetails;
