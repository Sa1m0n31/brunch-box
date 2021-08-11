import React, { useEffect, useState } from 'react'
import exit from "../static/img/exit.svg";
import trash from "../static/img/trash.svg";
import {deleteShippingMethod, getAllShippingMethods} from "../helpers/shippingFunctions";
import {useLocation} from "react-router";
import Modal from 'react-modal'
import closeImg from "../static/img/close.png";
import settings from "../helpers/settings";
import JoditEditor from "jodit-react";
import axios from "axios";

const PanelShippingContent = () => {
    const [street, setStreet] = useState("");
    const [building, setBuilding] = useState("");
    const [flat, setFlat] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [city, setCity] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [addedMsg, setAddedMsg] = useState("");
    const [personal, setPersonal] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:5000/shipping/get-info`)
            .then(res => {
                if(res.data.result) {
                    const result = res.data.result[0];

                    setStreet(result.street);
                    setBuilding(result.building);
                    setFlat(result.flat);
                    setPostalCode(result.postal_code);
                    setCity(result.city);
                    setPersonal(result.is_on);
                    setApiKey(result.google_maps_api_key);
                }
            })
    }, []);

    useEffect(() => {
        if(addedMsg !== "") {
            setTimeout(() => {
                setAddedMsg("");
            }, 3000);
        }
    }, [addedMsg]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:5000/shipping/update`, {
            street, building, flat, postalCode, city, apiKey,
            personal
        })
            .then(res => {
                if(res.data.result === 1) setAddedMsg("Dane pomyślnie zaktualizowane");
                else setAddedMsg("Coś poszło nie tak... Prosimy spróbować później");
            });
    }

    return <main className="panelContent">
        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Odbiór osobisty
            </h1>
        </header>
        <section className="panelContent__frame">
            <section className="panelContent__frame__section">
                <h1 className="panelContent__frame__header">
                    Edycja adresu odbioru osobistego
                </h1>

                {addedMsg === "" ? <form className="panelContent__frame__form categoriesForm shippingForm"
                                         onSubmit={(e) => { handleSubmit(e) }}
                >
                    <section className="d-flex panelShipping__section">
                        <label className="addProduct__label addProduct__label--frame">
                            <input className="addProduct__input"
                                   name="name"
                                   value={street}
                                   onChange={(e) => { setStreet(e.target.value) }}
                                   type="text"
                                   placeholder="Ulica" />
                        </label>
                        <label className="addProduct__label addProduct__label--frame">
                            <input className="addProduct__input"
                                   name="building"
                                   value={building}
                                   onChange={(e) => { setBuilding(e.target.value) }}
                                   type="text"
                                   placeholder="Budynek" />
                        </label>
                        <label className="addProduct__label addProduct__label--frame">
                            <input className="addProduct__input"
                                   name="flat"
                                   value={flat}
                                   onChange={(e) => { setFlat(e.target.value) }}
                                   type="text"
                                   placeholder="Mieszkanie" />
                        </label>
                    </section>

                    <section className="d-flex panelShipping__section">
                        <label className="addProduct__label addProduct__label--frame">
                            <input className="addProduct__input"
                                   name="postalCode"
                                   value={postalCode}
                                   onChange={(e) => { setPostalCode(e.target.value) }}
                                   type="text"
                                   placeholder="Kod pocztowy" />
                        </label>
                        <label className="addProduct__label addProduct__label--frame">
                            <input className="addProduct__input"
                                   name="city"
                                   value={city}
                                   onChange={(e) => { setCity(e.target.value) }}
                                   type="text"
                                   placeholder="Miasto" />
                        </label>
                    </section>

                    <section className="d-flex panelShipping__section">
                        <label className="addProduct__label addProduct__label--frame">
                            <input className="addProduct__input"
                                   name="apiKey"
                                   value={apiKey}
                                   onChange={(e) => { setApiKey(e.target.value) }}
                                   type="text"
                                   placeholder="Klucz API Google Maps" />
                        </label>
                    </section>

                    <label className="panelContent__filters__btnWrapper marginBottom40">
                        <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => { e.preventDefault(); setPersonal(!personal); }}>
                            <span className={personal ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        Włącz opcję odbioru osobistego
                    </label>

                    <button className="addProduct__btn btn--maxWidth" type="submit">
                        Aktualizuj
                    </button>
                </form> : <section className="addedMsgWrapper">
                    <h2 className="addedMsgWrapper">
                        {addedMsg}
                    </h2>
                </section>}
            </section>
        </section>
    </main>
}

export default PanelShippingContent;
