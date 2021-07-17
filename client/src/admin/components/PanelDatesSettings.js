import React, {useEffect, useState} from 'react'
import {getNextDays} from "../../helpers/datetimeFunctions";
import axios from "axios";
import trash from "../static/img/trash.svg";
import closeImg from "../static/img/close.png";
import Modal from "react-modal";

const PanelDatesSettings = () => {
    const [deleted, setDeleted] = useState(-1);
    const [modal, setModal] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState(-1);
    const [added, setAdded] = useState("");
    const [calendar, setCalendar] = useState(getNextDays(14));
    const [availableHours, setAvailableHours] = useState([
        { start: 10, end: 11, available: true },
        { start: 11, end: 12, available: true },
        { start: 12, end: 13, available: true },
        { start: 13, end: 14, available: true },
        { start: 14, end: 15, available: true },
        { start: 15, end: 16, available: true },
        { start: 16, end: 17, available: true },
        { start: 17, end: 18, available: true },
        { start: 18, end: 19, available: true },
        { start: 19, end: 20, available: true },
        { start: 20, end: 21, available: true },
        { start: 21, end: 22, available: true },
    ]);
    const [dayOfDelivery, setDayOfDelivery] = useState(-1);
    const [hoursOfDelivery, setHoursOfDelivery] = useState([]);
    const [hoursDatabase, setHoursDatabase] = useState([]);

    useEffect(() => {
        /* Get dates excluded */
        axios.get("http://localhost:5000/dates/get-all")
            .then(res => {
                if(res.data) {
                    setHoursDatabase(res.data.result);
                }
            })
    }, []);

    useEffect(() => {
        if(dayOfDelivery !== -1) {
            if (dayOfDelivery === 0) {
                /* For today */
                const hour = new Date().getHours();
                if(hour <= 9) {
                    setAvailableHours(availableHours.map(item => {
                        return {
                            start: item.start,
                            end: item.end,
                            available: item.start >= 12
                        }
                    }));
                }
                else {
                    setAvailableHours(availableHours.map(item => {
                        return {
                            start: item.start,
                            end: item.end,
                            available: item.start > hour+2
                        }
                    }));
                }
                console.log(new Date().getHours())
            } else {
                /* For next days */
                const selectedDay = calendar[dayOfDelivery];
                if ((selectedDay.dayOfTheWeek === 0) || (selectedDay.dayOfTheWeek === 2) || (selectedDay.dayOfTheWeek === 3)) {
                    setAvailableHours(availableHours.map((item) => {
                        return {
                            start: item.start,
                            end: item.end,
                            available: item.end !== 22
                        }
                    }));
                } else {
                    setAvailableHours(availableHours.map((item) => {
                        return {
                            start: item.start,
                            end: item.end,
                            available: true
                        }
                    }));
                }
            }
        }
    }, [dayOfDelivery]);

    useEffect(() => {
        setHoursOfDelivery([]);
    }, [dayOfDelivery]);

    const toggleHoursOfDelivery = (index) => {
        const isOnList = hoursOfDelivery.findIndex((item) => {
            return item === index;
        });
        if(isOnList !== -1) {
            setHoursOfDelivery(hoursOfDelivery.filter(item => {
                return item !== index;
            }))
        }
        else {
            setHoursOfDelivery([...hoursOfDelivery, index]);
        }
    }

    const excludeDay = (e) => {
        e.preventDefault();
        const hours = hoursOfDelivery.map(item => {
            return availableHours[item].start;
        });
        const choosenDay = calendar[dayOfDelivery];
        if((hours)&&(choosenDay)) {
            axios.post("http://localhost:5000/dates/add", {
                hours,
                day: {
                    day: choosenDay.day,
                    month: choosenDay.monthNumber,
                    year: choosenDay.year
                }
            })
                .then(res => {
                    if(res.data.result) {
                        setAdded("Godziny zostały wyłączone z dostawy");
                    }
                    else {
                        setAdded("Coś poszło nie tak... Prosimy spróbować później");
                    }
                });
        }
    }

    useEffect(() => {
        if(added !== "") {
            setTimeout(() => {
                setAdded("");
            }, 3000);
        }
        axios.get("http://localhost:5000/dates/get-all")
            .then(res => {
                if(res.data) {
                    setHoursDatabase(res.data.result);
                }
            });
    }, [added]);

    const openModal = (id) => {
        setCandidateToDelete(id);
        setModal(true);
    }

    useEffect(() => {
        if(deleted === 1) {
            setTimeout(() => {
                setDeleted(-1);
            }, 1000);
        }
        axios.get("http://localhost:5000/dates/get-all")
            .then(res => {
                if(res.data) {
                    setHoursDatabase(res.data.result);
                }
            });
    }, [deleted]);

    const deleteHourById = () => {
        axios.post("http://localhost:5000/dates/delete", {
            id: candidateToDelete
        })
            .then(res => {
                if(res.data) {
                    setModal(false);
                    setDeleted(1);
                }
            })
    }

    return <>
        <Modal
            isOpen={modal}
            portalClassName="panelModal"
        >

            {deleted === -1 ? <>
                <h2 className="modalQuestion">
                    Czy na pewno chcesz włączyć ponownie tę godzinę do dostawy?
                </h2>

                <section className="modalQuestion__buttons">
                    <button className="modalQuestion__btn" onClick={() => { deleteHourById(0) }}>
                        Tak
                    </button>
                    <button className="modalQuestion__btn" onClick={() => { setModal(false) }}>
                        Nie
                    </button>
                </section>
            </> : <h2 className="modalQuestion">
                Godzina została ponownie włączona do dostawy
            </h2>}

            <button className="modalClose" onClick={() => { setModal(false) }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>
        </Modal>

        <main className="panelContent__frame cart cart--flex cart--flex--admin">
            {added === "" ? <><section className="shippingAndPayment__section">
                    <h2 className="shippingAndPayment__header">
                        Wyłącz dzień z dostawy
                    </h2>
                    <section className="shippingAndPayment__calendar">
                        {calendar?.map((item, index) => (
                            <button className={dayOfDelivery === index ? "shippingAndPayment__calendar__btn shippingAndPayment__calendar__btn--checked" : "shippingAndPayment__calendar__btn"}
                                    key={index}
                                    onClick={(e) => { e.preventDefault(); setDayOfDelivery(index); }}
                            >
                                <h3 className="calendarDay">
                                    {item.day}
                                </h3>
                                <h4 className="calendarMonth">
                                    {item.month}
                                </h4>
                            </button>
                        ))}
                    </section>
                    <label>
                        Uwaga: pojedynczo wyłączyć możesz z dostawy tylko jeden dzień.
                    </label>
                </section>

                <section className="shippingAndPayment__section">
                    <h2 className="shippingAndPayment__header">
                        Wyłącz godziny z dostawy
                    </h2>
                    <section className="shippingAndPayment__section shippingAndPayment__section--hours">
                        {availableHours.map((item, index) => {
                            return <label className={item.available ? "ribbonBtnLabel ribbonBtnLabel--hour" : "ribbonBtnLabel ribbonBtnLabel--hour hour--disabled"}>
                                <button disabled={!item.available} className="ribbonBtn" onClick={(e) => {
                                    e.preventDefault();
                                    toggleHoursOfDelivery(index);
                                }}>
                                    <span className={hoursOfDelivery.findIndex(el => { return el === index }) !== -1 && item.available ? "ribbon" : "d-none"}></span>
                                </button>
                                {item.start.toString() + ":00 - " + item.end.toString() + ":00"}
                            </label>
                        })}
                    </section>
                </section></> : <h2 className="addedMsgWrapper w-100">
                    {added}
                </h2>}

            <button className="addProduct__btn marginTop10" onClick={(e) => { excludeDay(e); }}>
                Wyłącz godziny z dostawy
            </button>
        </main>
        <section className="panelContent__frame">
            <section className="panelContent__frame__section categoryList">
                <h1 className="panelContent__frame__header">
                    Godziny wyłączone z dostawy
                </h1>
                {hoursDatabase.length ? hoursDatabase.map((item, index) => {
                    return <section className="panelContent__item productItem" key={index}>
                        <section className="panelContent__column">
                            <h4 className="panelContent__column__label">
                                Dzień
                            </h4>
                            <h3 className="panelContent__column__value">
                                {item.day.substring(0, 10)}
                            </h3>
                        </section>

                        <section className="panelContent__column">
                            <h4 className="panelContent__column__label">
                                Godzina
                            </h4>
                            <h3 className="panelContent__column__value">
                                {item.hour_start + ":00 - " + parseInt(parseInt(item.hour_start)+1) + ":00" }
                            </h3>
                        </section>

                        <section className="panelContent__column">
                            <h4 className="panelContent__column__label">
                                Działania
                            </h4>
                            <div className="panelContent__column__value">
                                <div className="panelContent__column__value panelContent__column__value--buttons">
                                    <button className="panelContent__column__btn" onClick={() => { openModal(item.id) }}>
                                        <a className="panelContent__column__link" href="#">
                                            <img className="panelContent__column__icon" src={trash} alt="usuń"/>
                                        </a>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </section>

                }) : <label className="marginTop20">Brak</label>}
            </section>
        </section>
        </>
}

export default PanelDatesSettings;
