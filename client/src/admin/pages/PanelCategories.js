import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelCategoriesContent from "../components/PanelCategoriesContent";
import {Helmet} from "react-helmet";

const PanelCategories = () => {
    return <main className="panel">
        <Helmet>
            <title>Brunchbox | Kategorie</title>
        </Helmet>
        <PanelMenu active={3} />
        <PanelCategoriesContent />
    </main>
}

export default PanelCategories;
