import React from 'react'
import PanelMenu from "../components/PanelMenu";
import AddProductContent from "../components/AddProductContent";
import {Helmet} from "react-helmet";

const AddProductPage = () => {
    return <main className="panel">
        <Helmet>
            <title>Brunchbox | Dodaj produkt</title>
        </Helmet>
        <PanelMenu active={1} submenu={true} />
        <AddProductContent />
    </main>
}

export default AddProductPage;
