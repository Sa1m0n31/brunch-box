import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelProductsContent from "../components/PanelProductsContent";

const PanelProducts = () => {
    return <main className="panel">
        <PanelMenu active={1} />
        <PanelProductsContent />
    </main>
}

export default PanelProducts;
