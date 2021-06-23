import React, { useState, useEffect } from 'react'
import {getAllAdmins} from "../helpers/settingsFunctions";
import trash from "../static/img/trash.svg";
import closeImg from '../static/img/close.png'

import AddAdminForm from "./AddAdminForm";
import ChangePasswordForm from "./ChangePasswordForm";

import Modal from 'react-modal';
import { deleteAdmin } from "../helpers/settingsFunctions";

const PanelSettingsContent = () => {
    const [admins, setAdmins] = useState([]);
    const [deleted, setDeleted] = useState(-1);
    const [modal, setModal] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState(-1);

    useEffect(() => {
        getAllAdmins()
            .then(res => {
                setAdmins(res.data.result);
            });
    }, []);

    const openModal = (index) => {
        setModal(true);
        setCandidateToDelete(index);
    }

    const deleteAdminById = () => {
        deleteAdmin(candidateToDelete)
            .then(res => {
                if(res.data.result === 1) setDeleted(candidateToDelete);
            });
    }

    useEffect(() => {
        if(deleted !== -1) {
            setTimeout(() => {
                setModal(false);
                setDeleted(-1);
                setCandidateToDelete(-1);
            }, 3000);
            getAllAdmins()
                .then(res => {
                    setAdmins(res.data.result);
                });
        }
    }, [deleted]);

    return <main className="panelContent">

        <Modal
            isOpen={modal}>

            {deleted === -1 ? <>
                <h2 className="modalQuestion">
                    Czy na pewno chcesz usunąć tego administratora?
                </h2>

                <section className="modalQuestion__buttons">
                    <button className="modalQuestion__btn" onClick={() => { deleteAdminById(0) }}>
                        Tak
                    </button>
                    <button className="modalQuestion__btn" onClick={() => { setModal(false) }}>
                        Nie
                    </button>
                </section>
            </> : <h2 className="modalQuestion">
                Administrator został usunięty
            </h2>}

            <button className="modalClose" onClick={() => { setModal(false) }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>
        </Modal>

        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Ustawienia
            </h1>
        </header>
        <section className="panelContent__frame">
            <section className="panelContent__frame__section">
                <h1 className="panelContent__frame__header">
                    Ustawienia konta administratora
                </h1>

                <section className="panelContent__twoForms">
                    <ChangePasswordForm />

                    <AddAdminForm />
                </section>
            </section>
            <section className="panelContent__frame__section">
                <h1 className="panelContent__frame__header">
                    Lista administratorów
                </h1>
                {admins.map((item, index) => {
                    if(deleted !== item.id) {
                        return <section className="panelContent__item productItem" key={index}>
                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Login
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.username}
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Adres email
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.email}
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Działania
                                </h4>
                                <div className="panelContent__column__value">
                                    <div className="panelContent__column__value panelContent__column__value--buttons">
                                        <button className="panelContent__column__btn" onClick={() => { openModal(item.id) }}>
                                            <a className="panelContent__column__link" href="#">
                                                <img className="panelContent__column__icon" src={trash} alt="usuń"/>
                                            </a>
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </section>
                    }
                    else {
                        return <section className="panelContent__item productItem" key={index}>
                            <section className="panelContent__column">
                                <h3 className="panelContent__column__value">
                                    Administrator został usunięty
                                </h3>
                            </section>
                        </section>
                    }
                })}
            </section>
        </section>
    </main>
}

export default PanelSettingsContent;
