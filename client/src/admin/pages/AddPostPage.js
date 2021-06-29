import React, { useEffect, useState } from 'react'
import PanelMenu from "../components/PanelMenu";
import AddPostContent from "../components/AddPostContent";

const AddPostPage = () => {
    return <main className="panel">
        <PanelMenu active={7} submenu={true} />
        <AddPostContent />
    </main>
}

export default AddPostPage;
