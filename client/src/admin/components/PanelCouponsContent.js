import React, { useState, useEffect } from 'react'
import exit from "../static/img/exit.svg";
import trash from "../static/img/trash.svg";
import {addCoupon, deleteCoupon, getAllCoupons, getCouponDetails, updateCoupon} from "../helpers/couponFunctions";
import Modal from "react-modal";
import closeImg from "../static/img/close.png";
import { useLocation } from "react-router";

const PanelCouponsContent = () => {
    const [id, setId] = useState(-1);
    const [addedMsg, setAddedMsg] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [code, setCode] = useState("");
    const [percent, setPercent] = useState(true);
    const [discountValue, setDiscountValue] = useState(0);
    const [coupons, setCoupons] = useState([]);
    const [update, setUpdate] = useState(false);
    const [candidate, setCandidate] = useState(0);
    const [modal, setModal] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [deleteMsg, setDeleteMsg] = useState("");
    const [error, setError] = useState("");
    const [timesToUse, setTimesToUse] = useState(0);
    const [infinite, setInfinite] = useState(false);

    const location = useLocation();

    useEffect(() => {
        /* Check if update mode */
        const param = parseInt(new URLSearchParams(location.search).get("id"));
        if(param) {
            getCouponDetails(param)
                .then(res => {
                    console.log(res.data.result);
                    const result = res.data.result[0];
                    if(result) {
                        setId(param);
                        setUpdate(true);
                        setCode(result.code);
                        setFrom(result.date_from.substring(0, 10));
                        setTo(result.date_to.substring(0, 10));
                        if(result.percent) {
                            setPercent(true);
                            setDiscountValue(result.percent);
                        }
                        else {
                            setPercent(false);
                            setDiscountValue(result.amount);
                        }
                    }
                });
        }

        getAllCoupons()
            .then(res => {
                if(res.data.result) {
                    setCoupons(res.data.result);
                }
            });
    }, []);

    useEffect(() => {
        getAllCoupons()
            .then(res => {
                if(res.data.result) {
                    setCoupons(res.data.result);
                }
            });
    }, [deleted]);

    useEffect(() => {
        if(addedMsg !== "") {
            setTimeout(() => {
                setAddedMsg("");
            }, 3000);
        }
    }, [addedMsg]);

    const handleSubmit = (e) => {
        e.preventDefault();
        /* Validation */
        if(code.length < 3) {
            setError("Długość kodu powinna być nie mniejsza niż 3");
            return 0;
        }
        if(!from) {
            setError("Ustal datę rozpoczęcia");
            return 0;
        }
        if(!to) {
            setError("Ustal datę zakończenia");
            return 0;
        }
        if((!infinite)&&(!timesToUse)) {
            setError("Ustal liczbę możliwych użyć kodu");
            return 0;
        }
        if(timesToUse === "Nieograniczony") {
            setTimesToUse(null);
        }

        if(!update) {
            addCoupon(code, from, to, percent, discountValue, timesToUse)
                .then(res => {
                    if(res.data.result) {
                        setAddedMsg("Kupon został dodany");
                    }
                    else {
                        setAddedMsg("Coś poszło nie tak... Prosimy spróbować później");
                    }
                });
        }
        else {
            updateCoupon(id, code, from, to, percent, discountValue, timesToUse)
                .then(res => {
                    if(res.data.result) {
                        setAddedMsg("Kupon został zaktualizowany");
                    }
                    else {
                        setAddedMsg("Coś poszło nie tak... Prosimy spróbować później");
                    }
                });
        }
    }

    const openModal = (id) => {
        setCandidate(id);
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
        setCandidate(-1);
    }

    const deleteCouponById = () => {
        deleteCoupon(candidate)
            .then(res => {
                if(res.data.result) setDeleted(true);
            });
    }

    useEffect(() => {
        if(infinite) setTimesToUse("Nieograniczony");
        else setTimesToUse(0);
    }, [infinite]);

    return <main className="panelContent">
        <Modal
            isOpen={modal}
            portalClassName="panelModal"
        >

            {!deleted ? <>
                <h2 className="modalQuestion">
                    Czy na pewno chcesz usunąć ten kod?
                </h2>

                <section className="modalQuestion__buttons">
                    <button className="modalQuestion__btn" onClick={() => { deleteCouponById() }}>
                        Tak
                    </button>
                    <button className="modalQuestion__btn" onClick={() => { closeModal() }}>
                        Nie
                    </button>
                </section>
            </> : <h2 className="modalQuestion">
                {deleteMsg === "" ? "Kod został usunięty" : deleteMsg}
            </h2>}

            <button className="modalClose" onClick={() => { closeModal() }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>
        </Modal>



        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Kupony rabatowe
            </h1>
        </header>
        <section className="panelContent__frame">
            <section className="panelContent__frame__section">
                <h1 className="panelContent__frame__header">
                    Dodaj nowy kupon
                </h1>

                {addedMsg === "" ? <form className="panelContent__frame__form categoriesForm"
                                         onSubmit={(e) => { handleSubmit(e) }}
                >

                    <label className="addProduct__label addProduct__label--frame">
                        <input className="addProduct__input"
                               name="code"
                               value={code}
                               onChange={(e) => { setCode(e.target.value) }}
                               type="text"
                               placeholder="Kod rabatowy"
                        />
                    </label>

                    <section className="d-flex">
                        <label className="panelContent__filters__btnWrapper">
                            <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => { e.preventDefault(); setPercent(true); }}>
                                <span className={percent ? "panelContent__filters__btn--active" : "d-none"} />
                            </button>
                            Obniżka w procentach
                        </label>
                        <label className="panelContent__filters__btnWrapper">
                            <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => { e.preventDefault(); setPercent(false); }}>
                                <span className={!percent ? "panelContent__filters__btn--active" : "d-none"} />
                            </button>
                            Obniżka w złotówkach
                        </label>
                    </section>

                    <label className="addProduct__label addProduct__label--frame">
                        <input className="addProduct__input"
                               name="discountValue"
                               value={discountValue}
                               onChange={(e) => { setDiscountValue(e.target.value) }}
                               type="number"
                               min={0}
                               placeholder={`Wartość obniżki${percent ? ' (w procentach)' : ' (w złotych)'}`}
                        />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Aktywny od
                        <input className="addProduct__input"
                               name="from"
                               value={from}
                               onChange={(e) => { setFrom(e.target.value) }}
                               type="date" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Aktywny do
                        <input className="addProduct__input"
                               name="to"
                               value={to}
                               onChange={(e) => { setTo(e.target.value) }}
                               type="date" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Ilość możliwych użyć kodu
                        <input className="addProduct__input"
                               name="timesToUse"
                               disabled={infinite}
                               value={timesToUse}
                               onChange={(e) => { setTimesToUse(e.target.value) }}
                               type="number" />
                    </label>
                    <label className="panelContent__filters__btnWrapper">
                        <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => { e.preventDefault(); setInfinite(!infinite); }}>
                            <span className={infinite ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        Nieograniczona liczba użyć
                    </label>

                    <span className="errorsContainer">
                        {error ? error : ""}
                    </span>
                    <button className="addProduct__btn" type="submit">
                        Dodaj kod rabatowy
                    </button>
                </form> : <section className="addedMsgWrapper">
                    <h2 className="addedMsg">
                        {addedMsg}
                    </h2>
                </section>}
            </section>

            <section className="panelContent__frame__section categoryList">
                <h1 className="panelContent__frame__header">
                    Lista kodów rabatowych
                </h1>

                <main className="panelContent__content">
                    {coupons?.map((item, index) => (
                        <section className="panelContent__item productItem" key={index}>
                            <section className="panelContent__column">
                                    <h4 className="panelContent__column__value">
                                        #{item.id}
                                    </h4>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Kod
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.code}
                                </h3>
                            </section>

                            <section className="panelContent__column">
                                <h4 className="panelContent__column__label">
                                    Obniżka
                                </h4>
                                <h3 className="panelContent__column__value">
                                    {item.percent ? "-" + item.percent + "%" : "-" + item.amount + " PLN"}
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
                                        <button className="panelContent__column__btn" onClick={() => { openModal(item.id); }}>
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

export default PanelCouponsContent;
