import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelProductsContent from "../components/PanelProductsContent";
import {Helmet} from "react-helmet";

const PanelProducts = () => {
    return <main className="panel">
        <Helmet>
            <title>Brunchbox | Produkty</title>
        </Helmet>
        <PanelMenu active={1} />
        <PanelProductsContent />
    </main>
}

export default PanelProducts;
