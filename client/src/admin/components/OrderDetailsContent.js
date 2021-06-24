import React, { useEffect, useState } from 'react'
import {calculateCartSum, getOrderDetails} from "../helpers/orderFunctions";

import { useLocation } from "react-router";
import x from '../static/img/close.png'
import tick from '../static/img/tick-sign.svg'
import {getDate, getTime} from "../helpers/formatFunctions";

import Modal from 'react-modal'
import closeImg from "../static/img/close.png";
import {deleteProductById} from "../helpers/productFunctions";

const OrderDetailsContent = () => {
    const location = useLocation();

    const [id, setId] = useState(0);
    const [cart, setCart] = useState([1]);
    const [sum, setSum] = useState(0);
    const [modal, setModal] = useState(false);
    const [deleteMsg, setDeleteMsg] = useState("");

    useEffect(() => {
        /* Get order id from url string */
        const id = parseInt(new URLSearchParams(location.search).get("id"));

        if(!id) window.location = "/panel";
        setId(id);

        getOrderDetails(id)
            .then(res => {
               setCart(res.data.result);
               setSum(calculateCartSum(res.data.result));
            });

    }, []);

    const openModal = () => {
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
    }

    const deleteProduct = () => {
        deleteProductById(id)
            .then(res => {
                if(res.data.result === 1) {
                    setDeleteMsg("Produkt został usunięty");
                    setTimeout(() => {
                        window.location = "/panel";
                    }, 2000);
                }
                else {
                    setDeleteMsg("Coś poszło nie tak... Spróbuj ponownie później");
                }
            });
    }

    return <main className="panelContent">

        <Modal
            isOpen={modal}>

            {deleteMsg === "" ? <>
                <h2 className="modalQuestion">
                    Czy na pewno chcesz usunąć ten produkt?
                </h2>

                <section className="modalQuestion__buttons">
                    <button className="modalQuestion__btn" onClick={() => { deleteProduct() }}>
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
                Szczegóły zamówienia #{id}
            </h1>
        </header>

        <section className="panelContent__frame">
            <section className="panelContent__cart">
                <header className="panelContent__cart__header">
                    <h2 className="panelContent__header--smaller">
                        Zawartość koszyka
                    </h2>

                    <section className="panelContent__buttons">
                        <button className="panelContent__btn btn--neutral">
                            <a className="button--link" href="/panel/zamowienia">
                                Wróć do zamówień
                            </a>
                        </button>
                        <button className="panelContent__btn btn--red" onClick={() => { openModal() }}>
                            Usuń zamówienie
                        </button>
                    </section>
                </header>
                <main className="panelContent__cart__content">
                    {cart.map((item, index) => {
                        return <section key={index} className="panelContent__cart__item">
                            <section className="panelContent__cart__column">
                                <span>{item.name}</span>
                            </section>
                            <section className="panelContent__cart__column">
                                <span>{item.price_m} PLN</span>
                            </section>
                            <section className="panelContent__cart__column">
                                <span>{item.quantity} szt.</span>
                            </section>
                            <section className="panelContent__cart__column">
                                <span>{item.option}</span>
                            </section>
                            <section className="panelContent__cart__column">
                                <span>Rozmiar {item.size}</span>
                            </section>
                        </section>
                    })}

                    <section className="panelContent__cart__sum">
                        <h3>
                            Suma koszyka: {sum} PLN
                        </h3>
                    </section>
                </main>

            </section>

            <section className="panelContent__orderDetails">
                <section className="panelContent__clientData">
                    <h2 className="panelContent__header--smaller">
                        Dane klienta
                    </h2>
                    <main className="panelContent__clientData__content">
                        <h3 className="panelContent__data w-50">
                            {cart[0].first_name}
                        </h3>
                        <h3 className="panelContent__data w-50">
                            {cart[0].last_name}
                        </h3>
                        <h3 className="panelContent__data w-70">
                            {cart[0].email}
                        </h3>
                        <h3 className="panelContent__data w-30">
                            {cart[0].phone_number ? cart[0].phone_number : "Brak numeru telefonu"}
                        </h3>
                        <h3 className="panelContent__data w-100">
                            {cart[0].date ? getDate(cart[0].date) + " " + getTime(cart[0].date) : ""}
                        </h3>
                    </main>

                    <section className="panelContent__orderStatus">
                        <h2 className="panelContent__orderStatus__header">
                            Opłacone:
                            <img className="panelContent__orderStatus__img" src={cart[0].payment_status === "Opłacone" ? tick : x} alt="oplacone" />
                        </h2>
                    </section>
                </section>

                <section className="panelContent__shipping">
                    <h2 className="panelContent__header--smaller">
                        Dostawa
                    </h2>
                    <main className="panelContent__clientData__content">
                        <h3 className="panelContent__data w-70">
                            {cart[0].city}
                        </h3>
                        <h3 className="panelContent__data w-30">
                            {cart[0].postal_code}
                        </h3>
                        <h3 className="panelContent__data w-50">
                            {cart[0].street}
                        </h3>
                        <h3 className="panelContent__data w-20">
                            {cart[0].building}
                        </h3>
                        <h3 className="panelContent__data w-20">
                            {cart[0].flat ? cart[0].flat : "-"}
                        </h3>
                        {cart[0].order_comment !== null ? <p className="panelContent__data w-100">
                            {cart[0].order_comment}
                        </p> : ""}
                    </main>
                </section>
            </section>

        </section>
    </main>
}

export default OrderDetailsContent;
