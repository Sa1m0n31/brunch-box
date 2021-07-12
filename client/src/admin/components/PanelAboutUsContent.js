import React, { useState, useEffect } from 'react'
import {deleteCategory, getAllCategories, getCategory} from "../helpers/categoriesFunctions";
import exit from "../static/img/exit.svg";
import trash from "../static/img/trash.svg";

import settings from "../helpers/settings";

import Modal from 'react-modal'
import closeImg from "../static/img/close.png";
import {useLocation} from "react-router";

import JoditEditor from 'jodit-react';
import {deleteSection, getAllSections, getSection} from "../helpers/aboutUsFunctions";

const PanelAboutUsContent = () => {
    const [sections, setSections] = useState([]);

    const [header, setHeader] = useState("");
    const [headerEn, setHeaderEn] = useState("");
    const [content, setContent] = useState("");
    const [contentEn, setContentEn] = useState("");

    const [modal, setModal] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [candidate, setCandidate] = useState(-1);
    const [deleteMsg, setDeleteMsg] = useState("");
    const [addedMsg, setAddedMsg] = useState("");
    const [update, setUpdate] = useState(false);
    const [id, setId] = useState(0);

    const location = useLocation();

    useEffect(() => {
        /* Check if update mode */
        const param = parseInt(new URLSearchParams(location.search).get("id"));
        if(param) {
            getSection(param)
                .then(res => {
                    console.log(res.data.result);
                    const result = res.data.result;
                    if(result) {
                        setId(param);
                        setUpdate(true);
                        setHeader(result.header);
                        setHeaderEn(result.header_en);
                        setContent(result.content);
                        setContentEn(result.content_en);
                    }
                });
        }
    }, []);

    useEffect(() => {
        getAllSections()
            .then(res => {
                setSections(res.data.result);
            });

        if(sessionStorage.getItem('sec-section-added')) {
            const added = new URLSearchParams(location.search).get("added");
            sessionStorage.removeItem('sec-section-added');

            if(added === "1") setAddedMsg("Sekcja została dodana");
            else if(added === "0") setAddedMsg("Sekcja nie może być pusta");
            else if(added === "2") setAddedMsg("Sekcja została zaktualizowana");
        }
    }, [modal]);

    useEffect(() => {
        setTimeout(() => {
            setAddedMsg("");
        }, 3000);
    }, [addedMsg]);

    const deleteSectionById = () => {
        deleteSection(candidate)
            .then(res => {
                setDeleted(true);
            });
    }

    const openModal = id => {
        setCandidate(id);
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
        setDeleted(false);
    }

    const handleSubmit = (e) => {
        sessionStorage.setItem('sec-section-added', 'T');
    }

    return <main className="panelContent">

        <Modal
            isOpen={modal}
            portalClassName="panelModal"
        >

            {!deleted ? <>
                <h2 className="modalQuestion">
                    Czy na pewno chcesz usunąć tę sekcję?
                </h2>

                <section className="modalQuestion__buttons">
                    <button className="modalQuestion__btn" onClick={() => { deleteSectionById() }}>
                        Tak
                    </button>
                    <button className="modalQuestion__btn" onClick={() => { closeModal() }}>
                        Nie
                    </button>
                </section>
            </> : <h2 className="modalQuestion">
                {deleteMsg === "" ? "Sekcja została usunięta" : deleteMsg}
            </h2>}

            <button className="modalClose" onClick={() => { closeModal() }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>
        </Modal>

        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                O nas
            </h1>
        </header>
        <section className="panelContent__frame">
            <section className="panelContent__frame__section">
                <h1 className="panelContent__frame__header">
                    Dodawanie sekcji na podstronie "O nas"
                </h1>

                {addedMsg === "" ? <form className="panelContent__frame__form categoriesForm"
                                         method="POST"
                                         action={update ? "http://brunchbox.skylo-test3.pl/about-us/update" : "http://brunchbox.skylo-test3.pl/about-us/add"}
                                         onSubmit={(e) => { handleSubmit(e) }}
                                         encType="multipart/form-data"
                >
                    <input className="invisibleInput"
                           name="id"
                           value={id} />

                    <label className="addProduct__label addProduct__label--frame">
                        <input className="addProduct__input"
                               name="header"
                               value={header}
                               onChange={(e) => { setHeader(e.target.value) }}
                               type="text"
                               placeholder="Nagłówek sekcji" />
                    </label>
                    <label className="jodit--label">
                        <span>Treść sekcji</span>
                        <JoditEditor
                            name="content"
                            value={content}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setContent(newContent) }}
                        />
                    </label>


                    <label className="addProduct__label addProduct__label--frame">
                        <input className="addProduct__input"
                               name="header_en"
                               value={headerEn}
                               onChange={(e) => { setHeaderEn(e.target.value) }}
                               type="text"
                               placeholder="Nagłówek sekcji (angielski)" />
                    </label>
                    <label className="jodit--label">
                        <span>Treść sekcji (angielski)</span>
                        <JoditEditor
                            name="content_en"
                            value={contentEn}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setContentEn(newContent) }}
                        />
                    </label>

                    <label className="addProduct__label addProduct__label--frame">
                        Zdjęcie sekcji
                        <input type="file"
                               name="aboutUsImage" />
                    </label>

                    <button className="addProduct__btn" type="submit">
                        Dodaj sekcję
                    </button>
                </form> : <section className="addedMsgWrapper">
                    <h2 className="addedMsg">
                        {addedMsg}
                    </h2>
                </section>}
            </section>

            <section className="panelContent__frame__section categoryList">
                <h1 className="panelContent__frame__header">
                    Lista sekcji
                </h1>

                <main className="panelContent__content">
                    {sections.map((item, index) => (
                        <section className="panelContent__item productItem">
                            <section className="panelContent__column">
                                {item.img_path ? <img className="panelContent__productImg" src={settings.API_URL + "/image?url=/media/" + item.img_path} alt="zdjecie-sekcji" /> : ""}
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Nagłówek
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.header}
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Działania
                                </h4>
                                <div className="panelContent__column__value">
                                    <div className="panelContent__column__value panelContent__column__value--buttons">
                                        <button className="panelContent__column__btn">
                                            <a className="panelContent__column__link" href={`?id=${item.id}`}>
                                                <img className="panelContent__column__icon" src={exit} alt="przejdz" />
                                            </a>
                                        </button>
                                        <button className="panelContent__column__btn" onClick={() => { openModal(item.id) }}>
                                            <img className="panelContent__column__icon" src={trash} alt="usuń" />
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </section>
                    ))}
                </main>
            </section>
        </section>
    </main>
}

export default PanelAboutUsContent;
