import React, { useEffect, useState } from 'react'

import { useFormik } from "formik";
import {changePaymentData, getPaymentData} from "../helpers/paymentFunctions";

const PanelPaymentContent = () => {
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({
        marchant_id: "",
        crc: "",
        api_key: ""
    });

    useEffect(() => {
        getPaymentData()
            .then(res => {
                setData(res.data.result[0]);
            });
    }, []);

    useEffect(() => {
        if(msg !== "") {
            setTimeout(() => {
                setMsg("");
            }, 3000);
        }
    }, [msg]);

    const formik = useFormik({
        initialValues: {
            marchantId: data.marchant_id,
            crc: data.crc,
            apiKey: data.api_key
        },
        enableReinitialize: true,
        onSubmit: values => {
            changePaymentData(values)
                .then(res => {
                    if(res.data.result === 1) setMsg("Zmiany zostały wprowadzone");
                    else setMsg("Coś poszło nie tak... Prosimy spróbować później");
                });
        }
    });

    return <main className="panelContent paymentContent">
        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Płatności
            </h1>
        </header>
        <section className="panelContent__frame">
            <h1 className="panelContent__frame__header">
                Ustawienia płatności (Przelewy24)
            </h1>

            <form className="panelContent__frame__form" onSubmit={formik.handleSubmit}>
                <span className="labelSpan">ID sprzedawcy</span>
                <label className="panelContent__input__label panelContent__input__label--payment">
                    <input className="panelContent__input"
                           placeholder="ID sprzedawcy"
                           value={formik.values.marchantId}
                           onChange={formik.handleChange}
                           name="marchantId" />
                </label>

                <span className="labelSpan">Klucz CRC</span>
                <label className="panelContent__input__label panelContent__input__label--payment">
                    <input className="panelContent__input"
                           placeholder="Klucz CRC"
                           value={formik.values.crc}
                           onChange={formik.handleChange}
                           name="crc" />
                </label>

                <span className="labelSpan">Klucz do API</span>
                <label className="panelContent__input__label panelContent__input__label--payment">
                    <input className="panelContent__input"
                           placeholder="Klucz do API"
                           value={formik.values.apiKey}
                           onChange={formik.handleChange}
                           name="apiKey" />
                </label>

                {msg === "" ? <button className="addProduct__btn marginTop10" type="submit">
                    Aktualizuj ustawienia płatności
                </button> : <h3 className="paymentMethods__msg">
                    {msg}
                </h3>}
            </form>
        </section>
    </main>
}

export default PanelPaymentContent;
