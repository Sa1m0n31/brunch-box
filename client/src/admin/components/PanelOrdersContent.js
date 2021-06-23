import React, { useEffect, useState } from 'react'

import trash from '../static/img/trash.svg'
import exit from '../static/img/exit.svg'
import searchImg from '../static/img/search.svg'

import { getAllOrders } from "../helpers/orderFunctions";
import { getDate, getTime } from "../helpers/formatFunctions";
import { orderSearch, sortByDate } from "../helpers/search";

const PanelOrdersContent = () => {
    const [orders, setOrders] = useState([]);
    const [sorting, setSorting] = useState(0);
    const [filter, setFilter] = useState(-1);

    useEffect(() => {
        getAllOrders()
            .then(res => {
                const result = res.data.result;
                setOrders(result);
                sessionStorage.setItem('skylo-e-commerce-orders', JSON.stringify(result));
            });
    }, []);

    const search = (e) => {
        const filteredOrders = orderSearch(e.target.value);
        setOrders(filteredOrders);
    }

    const filterByStatus = (n) => {
        if(n === 0) {
            if(filter === 0) setFilter(-1);
            else setFilter(0);
        }
        else {
            if(filter === 1) setFilter(-1);
            else setFilter(1);
        }
    }

    return <main className="panelContent">
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
                        <button className="panelContent__filters__btn" onClick={() => { filterByStatus(0) }}>
                            <span className={filter === 0 ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        Opłacone
                    </label>
                    <label className="panelContent__filters__label__label">
                        <button className="panelContent__filters__btn" onClick={() => { filterByStatus(1) }}>
                            <span className={filter === 1 ? "panelContent__filters__btn--active" : "d-none"} />
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
                {orders.map((item, index) => (
                    <section className="panelContent__item orderItem">
                        <section className="panelContent__column">
                            <h4 className="panelContent__column__label">
                                Id zamówienia
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
                                Wartość
                            </h4>
                            <h3 className="panelContent__column__value">
                                {item.price} PLN
                            </h3>
                        </section>

                        <section className="panelContent__column">
                            <h4 className="panelContent__column__label">
                                Płatność
                            </h4>
                            <h3 className="panelContent__column__value">
                            <span className="panelContent__column__status status--positive">
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
                                <button className="panelContent__column__btn">
                                        <img className="panelContent__column__icon" src={trash} alt="usuń" />
                                </button>
                            </div>
                        </section>

                    </section>
                ))}
            </main>
        </main>
    </main>
}

export default PanelOrdersContent;
