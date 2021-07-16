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
    const [addedMsg, setAddedMsg] = useState("");
    const [address, setAddress] = useState("");
    const [addressEn, setAddressEn] = useState("");
    const [personal, setPersonal] = useState(false);

    useEffect(() => {
        axios.get(`${settings.API_URL}/shipping/get-info`)
            .then(res => {
                if(res.data.result) {
                    const result = res.data.result[0];
                    setAddress(result.address);
                    setAddressEn(result.address_en);
                    setPersonal(result.is_on);
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
        axios.post(`${settings.API_URL}/shipping/update`, {
            address,
            addressEn,
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
                    <section className="d-flex">
                        <label className="jodit--label">
                            <span>Adres do odbioru osobistego (polski)</span>
                            <JoditEditor
                                name="address"
                                value={address}
                                tabIndex={1} // tabIndex of textarea
                                onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                                onChange={newContent => { setAddress(newContent) }}
                            />
                        </label>
                        <label className="jodit--label">
                            <span>Adres do odbioru osobistego (angielski)</span>
                            <JoditEditor
                                name="address_en"
                                value={addressEn}
                                tabIndex={1} // tabIndex of textarea
                                onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                                onChange={newContent => { setAddressEn(newContent) }}
                            />
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
