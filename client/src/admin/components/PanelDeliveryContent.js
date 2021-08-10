import React, { useState, useEffect } from 'react'
import exit from "../static/img/exit.svg";
import trash from "../static/img/trash.svg";

import Modal from 'react-modal'
import closeImg from "../static/img/close.png";
import {useLocation} from "react-router";
import {
    addDeliveryPrice,
    deleteDeliveryPrice,
    getAllDeliveryPrices,
    getSingleDeliveryPrice, updateDeliveryPrice
} from "../helpers/deliveryFunctions";

const PanelDeliveryContent = () => {
    const [deliveryPrices, setDeliveryPrices] = useState([]);
    const [modal, setModal] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [candidate, setCandidate] = useState(-1);
    const [deleteMsg, setDeleteMsg] = useState("");
    const [addedMsg, setAddedMsg] = useState("");
    const [update, setUpdate] = useState(false);
    const [id, setId] = useState(0);

    const [kmFrom, setKmFrom] = useState(null);
    const [kmTo, setKmTo] = useState(null);
    const [price, setPrice] = useState(null);

    const location = useLocation();

    useEffect(() => {
        /* Check if update mode */
        const param = parseInt(new URLSearchParams(location.search).get("id"));
        if(param) {
            getSingleDeliveryPrice(param)
                .then(res => {
                    const result = res.data?.result[0];
                    if(result) {
                        setId(param);
                        setUpdate(true);
                        setKmFrom(result.km_from);
                        setKmTo(result.km_to);
                        setPrice(result.price);
                    }
                });
        }
    }, []);

    useEffect(() => {
        getAllDeliveryPrices()
            .then(res => {
                setDeliveryPrices(res.data.result);
            })

        if(sessionStorage.getItem('sec-category-added')) {
            const added = new URLSearchParams(location.search).get("added");
            sessionStorage.removeItem('sec-category-added');

            if(added === "1") setAddedMsg("Kategoria została dodana");
            else if(added === "0") setAddedMsg("Kategoria nie może być pusta");
            else if(added === "-1") setAddedMsg("Kategoria o podanej nazwie już istnieje");
            else if(added === "2") setAddedMsg("Kategoria została zaktualizowana");
        }
    }, [modal]);

    useEffect(() => {
        setTimeout(() => {
            setAddedMsg("");
        }, 3000);
    }, [addedMsg]);

    const deleteDeliveryPriceById = () => {
        deleteDeliveryPrice(candidate)
            .then(res => {
                setDeleted(true);
                if(res.data.result) setDeleteMsg("Przedział został usunięty");
                else setDeleteMsg("Coś poszło nie tak... Prosimy spróbować później");
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
        e.preventDefault();
        if(update) {
            updateDeliveryPrice(id, kmFrom, kmTo, price)
                .then(res => {
                    if(res.data?.result) {
                        setAddedMsg("Przedział kilometrowy został zaktualizowany");
                    }
                });
        }
        else {
            addDeliveryPrice(kmFrom, kmTo, price)
                .then(res => {
                    if(res.data?.result) {
                        setAddedMsg("Przedział kilometrowy został dodany");
                    }
                });
        }
    }

    return <main className="panelContent">

        <Modal
            isOpen={modal}
            portalClassName="panelModal"
        >

            {!deleted ? <>
                <h2 className="modalQuestion">
                    Czy na pewno chcesz usunąć ten przedział kilometrowy?
                </h2>

                <section className="modalQuestion__buttons">
                    <button className="modalQuestion__btn" onClick={() => { deleteDeliveryPriceById() }}>
                        Tak
                    </button>
                    <button className="modalQuestion__btn" onClick={() => { closeModal() }}>
                        Nie
                    </button>
                </section>
            </> : <h2 className="modalQuestion">
                {deleteMsg === "" ? "Przedział został usunięty" : deleteMsg}
            </h2>}

            <button className="modalClose" onClick={() => { closeModal() }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>
        </Modal>

        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Ceny dostawy
            </h1>
        </header>
        <section className="panelContent__frame">
            <section className="panelContent__frame__section">
                <h1 className="panelContent__frame__header">
                    Dodawanie przedziału kilometrowego
                </h1>

                {addedMsg === "" ? <form className="panelContent__frame__form categoriesForm"
                                         method="POST"
                                         onSubmit={(e) => { handleSubmit(e) }}
                >
                    <input className="invisibleInput"
                           name="id"
                           value={id} />

                    <label className="addProduct__label addProduct__label--frame">
                        <input className="addProduct__input"
                               name="name"
                               value={kmFrom}
                               onChange={(e) => { setKmFrom(e.target.value) }}
                               type="number"
                               placeholder="Od km" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        <input className="addProduct__input"
                               name="header"
                               value={kmTo}
                               onChange={(e) => { setKmTo(e.target.value) }}
                               type="number"
                               placeholder="Do km (włącznie)" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        <input className="addProduct__input"
                               name="subheader"
                               value={price}
                               onChange={(e) => { setPrice(e.target.value) }}
                               type="number"
                               step="0.01"
                               placeholder="Cena" />
                    </label>

                    <button className="addProduct__btn" type="submit">
                        Dodaj przedział kilometrowy
                    </button>
                </form> : <section className="addedMsgWrapper">
                    <h2 className="addedMsg">
                        {addedMsg}
                    </h2>
                </section>}
            </section>

            <section className="panelContent__frame__section categoryList">
                <h1 className="panelContent__frame__header">
                    Przedziały kilometrowe dla dostawy
                </h1>

                <main className="panelContent__content">
                    {deliveryPrices.map((item, index) => (
                        <section className="panelContent__item productItem">
                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Od (w kilometrach)
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.km_from}
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Do (w kilometrach)
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.km_to}
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Cena
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.price} PLN
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

export default PanelDeliveryContent;
