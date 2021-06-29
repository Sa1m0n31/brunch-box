import React, { useEffect, useState } from 'react'

import trash from '../static/img/trash.svg'
import exit from '../static/img/exit.svg'
import searchImg from '../static/img/search.svg'

import {deleteOrderById, getAllOrders} from "../helpers/orderFunctions";
import { getDate, getTime } from "../helpers/formatFunctions";
import { orderSearch, sortByDate } from "../helpers/search";
import closeImg from "../static/img/close.png";
import Modal from "react-modal";

const PanelOrdersContent = () => {
    const [orders, setOrders] = useState([]);
    const [sorting, setSorting] = useState(0);
    const [filter, setFilter] = useState(0);
    const [modal, setModal] = useState(false);
    const [candidate, setCandidate] = useState(0);
    const [deleteMsg, setDeleteMsg] = useState("");

    const [filterOplacone, setFilterOplacone] = useState(true);
    const [filterNieoplacone, setFilterNieoplacone] = useState(true);

    useEffect(() => {
        getAllOrders()
            .then(res => {
                const result = res.data.result;
                setOrders(result.reverse());
                sessionStorage.setItem('skylo-e-commerce-orders', JSON.stringify(result));
            });
    }, [deleteMsg]);

    const search = (e) => {
        const filteredOrders = orderSearch(e.target.value);
        setOrders(filteredOrders);
    }

    const filterByStatus = (n) => {
        setFilter(n);
    }

    const deleteOrder = () => {
        deleteOrderById(candidate)
            .then(res => {
                if(res.data.result) setDeleteMsg("Zamówienie zostało usunięte");
                else setDeleteMsg("Coś poszło nie tak... Prosimy spróbować później");
            })
    }

    const openModal = (id) => {
        setCandidate(id);
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
        setDeleteMsg("");
    }

    return <main className="panelContent">
        <Modal
            portalClassName="panelModal"
            isOpen={modal}>

            {deleteMsg === "" ? <>
                <h2 className="modalQuestion">
                    Czy na pewno chcesz usunąć to zamówienie?
                </h2>

                <section className="modalQuestion__buttons">
                    <button className="modalQuestion__btn" onClick={() => { deleteOrder() }}>
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
                Zamówienia
            </h1>
        </header>

        <main className="panelContent__contentWrapper">
            <header className="panelContent__filters">
                <section className="panelContent__filters__item">
                    <span className="panelContent__filters__label">
                        Wyszukiwanie:
                    </span>
                    <label className="panelContent__input__label">
                        <input className="panelContent__input"
                               placeholder="Szukaj..."
                               onChange={(e) => { search(e) }}
                               name="search" />

                        <span className="panelContent__input__span">
                            <img className="panelContent__input__icon" src={searchImg} alt="szukaj" />
                        </span>
                    </label>
                </section>

                <section className="panelContent__filters__item">
                    <span className="panelContent__filters__label">
                        Status zamówienia:
                    </span>
                    <label className="panelContent__filters__label__label">
                        <button className="panelContent__filters__btn" onClick={() => { setFilterOplacone(!filterOplacone) }}>
                            <span className={filterOplacone ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        Opłacone
                    </label>
                    <label className="panelContent__filters__label__label">
                        <button className="panelContent__filters__btn" onClick={() => { setFilterNieoplacone(!filterNieoplacone) }}>
                            <span className={filterNieoplacone ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        Nieopłacone
                    </label>
                </section>

                <section className="panelContent__filters__item">
                    <span className="panelContent__filters__label">
                        Sortuj wg daty:
                    </span>

                    <button className={sorting === 0 ? "panelContent__sortBtn panelContent__sortBtn--active" : "panelContent__sortBtn"} onClick={() => { setOrders(sortByDate(true)); setSorting(0); }}>
                        Najnowsze
                    </button>
                    <button className={sorting === 1 ? "panelContent__sortBtn panelContent__sortBtn--active" : "panelContent__sortBtn"} onClick={() => { setOrders(sortByDate(false)); setSorting(1); }}>
                        Najstarsze
                    </button>
                </section>
            </header>

            <main className="panelContent__content">
                {orders.map((item, index) => {
                    if(((filterOplacone)&&(filterNieoplacone))||((filterOplacone)&&(item.payment_status.toLowerCase() === "opłacone"))||((filterNieoplacone)&&(item.payment_status.toLowerCase() === "nieopłacone"))) {
                        return <section className="panelContent__item orderItem">
                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Id
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.id}
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Imię i nazwisko
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.first_name} {item.last_name}
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
                                    Data zamówienia
                                </h4>
                                <h3 className="panelContent__column__value">
                            <span className="dateTime">
                                { getDate(item.date) }
                            </span>
                                    <span className="dateTime">
                                    { getTime(item.date) }
                            </span>
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Płatność
                                </h4>
                                <h3 className="panelContent__column__value">
                            <span className={item.payment_status.toLowerCase() === "opłacone" ? "panelContent__column__status status--positive" : "panelContent__column__status status--negative"}>
                                {item.payment_status}
                            </span>
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Działania
                                </h4>
                                <div className="panelContent__column__value panelContent__column__value--buttons">
                                    <button className="panelContent__column__btn">
                                        <a className="panelContent__column__link" href={"/panel/szczegoly-zamowienia?id=" + item.id}>
                                            <img className="panelContent__column__icon" src={exit} alt="przejdz" />
                                        </a>
                                    </button>
                                    <button className="panelContent__column__btn" onClick={() => { openModal(item.id) }}>
                                        <img className="panelContent__column__icon" src={trash} alt="usuń" />
                                    </button>
                                </div>
                            </section>

                        </section>
                    }
                    else {
                        return "";
                    }
                })}
            </main>
        </main>
    </main>
}

export default PanelOrdersContent;
