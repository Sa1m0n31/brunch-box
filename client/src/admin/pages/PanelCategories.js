import React from 'react'
import PanelMenu from "../components/PanelMenu";
import PanelCategoriesContent from "../components/PanelCategoriesContent";

const PanelCategories = () => {
    return <main className="panel">
        <PanelMenu active={3} />
        <PanelCategoriesContent />
    </main>
}

export default PanelCategories;
