import React, { useState, useEffect } from 'react'
import Modal from "react-modal";
import closeImg from "../static/img/close.png";

const PanelBlogContent = () => {
    const [modal, setModal] = useState(false);
    const [deleteMsg, setDeleteMsg] = useState("");
    const [candidate, setCandidate] = useState(0);

    const deletePostById = () => {

    }

    const closeModal = () => {
        setModal(false);
    }

    return <main className="panelContent">

        <Modal
            portalClassName="panelModal"
            isOpen={modal}>

            {deleteMsg === "" ? <>
                <h2 className="modalQuestion">
                    Czy na pewno chcesz usunąć ten wpis?
                </h2>

                <section className="modalQuestion__buttons">
                    <button className="modalQuestion__btn" onClick={() => { deletePostById() }}>
                        Tak
                    </button>
                    <button className="modalQuestion__btn" onClick={() => { closeModal() }}>
                        Nie
                    </button>
                </section>
            </> : <h2 className="modalQuestion">
                {deleteMsg}
            </h2>}

            <button className="modalClose" onClick={() => { closeModal() }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>
        </Modal>


        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Wpisy
            </h1>
        </header>
        <main className="panelContent__contentWrapper">

        </main>
    </main>
}

export default PanelBlogContent;
