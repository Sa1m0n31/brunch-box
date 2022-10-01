import React, { useEffect, useState } from 'react'
import PanelMenu from "../components/PanelMenu";
import AddPostContent from "../components/AddPostContent";
import {Helmet} from "react-helmet";

const AddPostPage = () => {
    return <main className="panel">
        <Helmet>
            <title>Brunchbox | Dodaj wpis na blogu</title>
        </Helmet>
        <PanelMenu active={7} submenu={true} />
        <AddPostContent />
    </main>
}

export default AddPostPage;
