import React, { useEffect, useState } from 'react'
import exit from "../static/img/exit.svg";
import trash from "../static/img/trash.svg";
import {deleteShippingMethod, getAllShippingMethods} from "../helpers/shippingFunctions";
import {useLocation} from "react-router";
import Modal from 'react-modal'
import closeImg from "../static/img/close.png";
import settings from "../helpers/settings";

const PanelShippingContent = () => {
    const [shippingMethods, setShippingMethods] = useState([]);
    const [image, setImage] = useState(null);
    const [addedMsg, setAddedMsg] = useState("");
    const [modal, setModal] = useState(false);
    const [candidate, setCandidate] = useState(-1);
    const [deleted, setDeleted] = useState(false);
    const [deleteMsg, setDeleteMsg] = useState("");

    const location = useLocation();

    useEffect(() => {
        getAllShippingMethods()
            .then(res => {
                setShippingMethods(res.data.shippingMethods);
                console.log(res.data.shippingMethods);
            });

        if(sessionStorage.getItem('sec-shipping-added')) {
            const added = new URLSearchParams(location.search).get("added");
            sessionStorage.removeItem('sec-shipping-added');

            if(added === "1") setAddedMsg("Metoda wysyłki została dodana");
            else if(added === "0") setAddedMsg("Nazwa metody wysyłki nie może być pusta");
            else if(added === "-1") setAddedMsg("Metoda wysyłki o podanej nazwie już istnieje");
        }
    }, [modal]);

    useEffect(() => {
        setTimeout(() => {
            setAddedMsg("");
        }, 3000);
    }, [addedMsg]);

    const handleSubmit = e => {
        sessionStorage.setItem('sec-shipping-added', 'T');
    }

    const openModal = (id) => {
        setCandidate(id);
        setModal(true);
    }

    const deleteShippingMethodById = () => {
        deleteShippingMethod(candidate)
            .then(res => {
                setDeleted(true);
                if(res.data.result === 0) {
                    /* Error */
                    setDeleteMsg("Coś poszło nie tak... Prosimy spróbować później");
                }
            });
    }

    const closeModal = () => {
        setModal(false);
        setDeleted(false);
    }

    return <main className="panelContent">

        <Modal
            isOpen={modal}
            portalClassName="panelModal"
        >

            {!deleted ? <>
                <h2 className="modalQuestion">
                    Czy na pewno chcesz usunąć tę metodę wysyłki?
                </h2>

                <section className="modalQuestion__buttons">
                    <button className="modalQuestion__btn" onClick={() => { deleteShippingMethodById() }}>
                        Tak
                    </button>
                    <button className="modalQuestion__btn" onClick={() => { closeModal() }}>
                        Nie
                    </button>
                </section>
            </> : <h2 className="modalQuestion">
                {deleteMsg === "" ? "Metoda wysyłki została usunięta" : deleteMsg}
            </h2>}

            <button className="modalClose" onClick={() => { closeModal() }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>
        </Modal>

        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Wysyłka
            </h1>
        </header>
        <section className="panelContent__frame">
            <section className="panelContent__frame__section">
                <h1 className="panelContent__frame__header">
                    Dodawanie metody wysyłki
                </h1>

                {addedMsg === "" ?  <form className="panelContent__frame__form"
                                          method="POST"
                                          action="http://localhost:5000/shipping/add"
                                          encType="multipart/form-data"
                                          onSubmit={(e) => { handleSubmit(e) }}
                >
                    <label className="addProduct__label addProduct__label--frame">
                        <input className="addProduct__input"
                               name="name"
                               type="text"
                               placeholder="Nazwa matody wysyłki" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        <input className="addProduct__input"
                               name="deliveryTime"
                               type="text"
                               placeholder="Czas dostawy" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        <input className="addProduct__input"
                               name="price"
                               type="text"
                               placeholder="Cena" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Zdjęcie metody wysłki
                        <input name="image"
                               type="file" />

                    </label>

                    <button className="addProduct__btn" type="submit">
                        Dodaj metodę wysyłki
                    </button>
                </form> :  <section className="addedMsgWrapper">
                    <h2 className="addedMsg">
                        {addedMsg}
                    </h2>
                </section>}
            </section>

            <section className="panelContent__frame__section">
                <h1 className="panelContent__frame__header">
                    Lista metod wysyłki
                </h1>

                <main className="panelContent__content">
                    {shippingMethods.map((item, index) => (
                        <section className="panelContent__item productItem" key={index}>
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
                                    Cena
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.price}
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Czas dostawy
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.delivery_time}
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

export default PanelShippingContent;
