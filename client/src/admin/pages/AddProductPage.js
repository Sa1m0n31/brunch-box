import React from 'react'
import PanelMenu from "../components/PanelMenu";
import AddProductContent from "../components/AddProductContent";

const AddProductPage = () => {
    return <main className="panel">
        <PanelMenu active={1} submenu={true} />
        <AddProductContent />
    </main>
}

export default AddProductPage;
