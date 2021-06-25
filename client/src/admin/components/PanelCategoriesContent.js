import React, { useState, useEffect } from 'react'
import {addCategory, deleteCategory, getAllCategories} from "../helpers/categoriesFunctions";
import exit from "../static/img/exit.svg";
import trash from "../static/img/trash.svg";

import settings from "../helpers/settings";

import Modal from 'react-modal'
import closeImg from "../static/img/close.png";
import {useLocation} from "react-router";

const PanelCategoriesContent = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [modal, setModal] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [candidate, setCandidate] = useState(-1);
    const [deleteMsg, setDeleteMsg] = useState("");
    const [addedMsg, setAddedMsg] = useState("");

    const location = useLocation();

    useEffect(() => {
        getAllCategories()
            .then(res => {
                setCategories(res.data.result);
            });

        if(sessionStorage.getItem('sec-category-added')) {
            const added = new URLSearchParams(location.search).get("added");
            sessionStorage.removeItem('sec-category-added');

            if(added === "1") setAddedMsg("Kategoria została dodana");
            else if(added === "0") setAddedMsg("Kategoria nie może być pusta");
            else if(added === "-1") setAddedMsg("Kategoria o podanej nazwie już istnieje");
        }
    }, [modal]);

    useEffect(() => {
        setTimeout(() => {
            setAddedMsg("");
        }, 3000);
    }, [addedMsg]);

    const deleteCategoryById = () => {
        deleteCategory(candidate)
            .then(res => {
                setDeleted(true);
                if(res.data.result === 0) {
                    /* Can't delete category, becouse it has children */
                    setDeleteMsg("Nie można usunąć podanej kategorii. Najpierw usuń wszystkie kategorie - dzieci podanej kategorii");
                }
                else if(res.data.result === -1) {
                    /* Database error */
                    setDeleteMsg("Coś poszło nie tak... Prosimy spróbować później");
                }
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
        sessionStorage.setItem('sec-category-added', 'T');
    }

    return <main className="panelContent">

        <Modal
        isOpen={modal}
        portalClassName="panelModal"
        >

        {!deleted ? <>
            <h2 className="modalQuestion">
                Czy na pewno chcesz usunąć tę kategorię?
            </h2>

            <section className="modalQuestion__buttons">
                <button className="modalQuestion__btn" onClick={() => { deleteCategoryById() }}>
                    Tak
                </button>
                <button className="modalQuestion__btn" onClick={() => { closeModal() }}>
                    Nie
                </button>
            </section>
        </> : <h2 className="modalQuestion">
            {deleteMsg === "" ? "Kategoria została usunięta" : deleteMsg}
        </h2>}

        <button className="modalClose" onClick={() => { closeModal() }}>
            <img className="modalClose__img" src={closeImg} alt="zamknij" />
        </button>
    </Modal>

        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Kategorie
            </h1>
        </header>
        <section className="panelContent__frame">
            <section className="panelContent__frame__section">
                <h1 className="panelContent__frame__header">
                    Dodawanie kategorii
                </h1>

                {addedMsg === "" ? <form className="panelContent__frame__form"
                                         method="POST"
                                         action="http://brunchbox.skylo-test3.pl/category/add"
                                         onSubmit={(e) => { handleSubmit(e) }}
                                         encType="multipart/form-data"
                >
                    <label className="addProduct__label addProduct__label--frame">
                        <input className="addProduct__input"
                               name="name"
                               value={name}
                               onChange={(e) => { setName(e.target.value) }}
                               type="text"
                               placeholder="Nazwa kategorii" />
                    </label>
                    <select className="addProduct__categorySelect"
                            name="parentId"
                    >
                        <option value={0}>Brak rodzica</option>
                        {categories.map((item, index) => (
                            <option value={item.id} key={index}>{item.name}</option>
                        ))}
                    </select>

                    <label className="addProduct__label addProduct__label--frame">
                        Zdjęcie kategorii
                        <input type="file"
                               name="categoryImage" />
                    </label>

                    <button className="addProduct__btn" type="submit">
                        Dodaj kategorię
                    </button>
                </form> : <section className="addedMsgWrapper">
                    <h2 className="addedMsg">
                        {addedMsg}
                    </h2>
                </section>}
            </section>

            <section className="panelContent__frame__section">
                <h1 className="panelContent__frame__header">
                    Lista kategorii
                </h1>

                <main className="panelContent__content">
                    {categories.map((item, index) => (
                        <section className="panelContent__item productItem">
                            <section className="panelContent__column">
                                {item.img_path ? <img className="panelContent__productImg" src={settings.API_URL + "/image?url=/media/" + item.img_path} alt="zdjecie-kategorii" /> : ""}
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Nazwa
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.name}
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Rodzic
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.parent_name ? item.parent_name : "BRAK"}
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Działania
                                </h4>
                                <div className="panelContent__column__value">
                                    <div className="panelContent__column__value panelContent__column__value--buttons">
                                        <button className="panelContent__column__btn">
                                            <a className="panelContent__column__link" href="#">
                                                <img className="panelContent__column__icon" src={exit} alt="przejdz" />
                                            </a>
                                        </button>
                                        <button className="panelContent__column__btn" onClick={() => { openModal(item.id) }}>
                                            <a className="panelContent__column__link" href="#">
                                                <img className="panelContent__column__icon" src={trash} alt="usuń" />
                                            </a>
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

export default PanelCategoriesContent;
