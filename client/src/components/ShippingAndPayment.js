import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import {getProductById} from "../helpers/productFunctions";
import settings from "../admin/helpers/settings";
import {getNextDays} from "../helpers/datetimeFunctions";
import { v4 as uuidv4 } from 'uuid';

const ShippingAndPayment = () => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('sec-cart')));
    const [amount, setAmount] = useState(parseInt(localStorage.getItem('sec-amount')));
    const [ribbon, setRibbon] = useState(false);
    const [ribbons, setRibbons] = useState([{
        ribbon: false,
        text: "",
        sell: 0
    }]);
    const [formValidate, setFormValidate] = useState(false);
    const [cartNames, setCartNames] = useState([]);
    const [personalAvailable, setPersonalAvailable] = useState(false);
    const [personal, setPersonal] = useState(false);
    const [address, setAddress] = useState("");
    const [coupon, setCoupon] = useState(false);
    const [couponContent, setCouponContent] = useState("");
    const [couponUsed, setCouponUsed] = useState(false);
    const [discount, setDiscount] = useState("");
    const [couponError, setCouponError] = useState(false);
    const [calendar, setCalendar] = useState(getNextDays(14));
    const [dayOfDelivery, setDayOfDelivery] = useState(-1);
    const [hourOfDelivery, setHourOfDelivery] = useState(-1);
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
    const [fastest, setFastest] = useState(false);
    const [excludedHours, setExcludedHours] = useState([]);
    const [changeOnFastest, setChangeOnFastest] = useState(0);

    const fillRibbonsArray = () => {
        let arr = [];
        cart.forEach((item, index, array) => {
            for(let i=0; i<item.quantity; i++) {
                arr.push({
                    ribbon: false,
                    text: "",
                    sell: index
                });
            }
            if(index === array.length-1) {
                setRibbons(arr);
            }
        });
    }

    const setExcludedDates = () => {
        /* Get excluded days info */
        axios.get("http://localhost:5000/dates/get-all")
            .then(res => {
                const excludedDaysInfo = res.data.result;
                let excludedHoursTmp = [];
                excludedDaysInfo?.forEach((item, index, array) => {
                    excludedHoursTmp.push({
                        day: item.day.substring(0, 10),
                        hour: item.hour_start
                    });
                    if(index === array.length-1) {
                        setExcludedHours(excludedHoursTmp);
                    }
                });
            });
    }

    useEffect(() => {
        if(!amount) window.location = "/";

        /* Set excluded days and hours */
        setExcludedDates();
        console.log(excludedHours);

        /* Get personal takeaway info */
        axios.get(`${settings.API_URL}/shipping/get-info`)
            .then(res => {
                const result = res.data.result[0];
                if(result) {
                    if(result.is_on) {
                        setPersonalAvailable(true);
                        setAddress(result.address);
                    }
                }
            });

        /* Get cart products names */
        cart.forEach((item, index, array) => {
            getProductById(item.id)
                .then(res => {
                    if(res.data.result) {
                        let arr = cartNames;
                        cartNames.push(res.data.result);
                        setCartNames(arr);
                    }
                });
            if(index === cart.length-1) fillRibbonsArray();
        });

    }, []);

    const validationSchema = Yup.object({
        firstName: Yup.string()
            .required(),
        lastName: Yup.string()
            .required(),
        email: Yup.string()
            .required("Wpisz swój adres email")
            .email("Niepoprawny adres email"),
        phoneNumber: Yup.string()
            .required(),
        city: Yup.string()
            .required("Wpisz swoją miejscowość"),
        postalCode: Yup.string()
            .required("Wpisz swój kod pocztowy")
            .min(6, "Niepoprawny kod pocztowy")
            .max(6, "Niepoprawny kod pocztowy"),
        street: Yup.string()
            .required("Wpisz swoją ulicę"),
        building: Yup.string()
            .required("Wpisz numer swojego budynku")
    });

    const validationSchemaPersonal = Yup.object({
        firstName: Yup.string()
            .required(),
        lastName: Yup.string()
            .required(),
        email: Yup.string()
            .required("Wpisz swój adres email")
            .email("Niepoprawny adres email"),
        phoneNumber: Yup.string()
            .required()
    });

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            city: "",
            postalCode: "",
            street: "",
            building: "",
            flat: null,
            ribbonFrom: "",
            ribbonTo: "",
            comment: ""
        },
        validationSchema: personal ? validationSchemaPersonal : validationSchema,
        onSubmit: values => {
            /* Additional validation for delivery date and time */
            if((calendar[dayOfDelivery])&&(availableHours[hourOfDelivery])) {
                setFormValidate(true);
            }
        }
    });

    useEffect(() => {
        if(fastest) {
            /* Choose fastest possible hour */
            chooseFastestPossibleHourInLoop();
        }
        else {
            setDayOfDelivery(-1);
            setHourOfDelivery(-1);
        }
    }, [fastest]);

    useEffect(() => {
        //setFastest(false);
        if(fastest) {
            setChangeOnFastest(changeOnFastest+1);
        }
        else {
            setChangeOnFastest(0);
        }
        if((changeOnFastest)||(!fastest)) {
            setFastest(false);
            setHourOfDelivery(-1);
        }

        if(dayOfDelivery !== -1) {
            const selectedDay = calendar[dayOfDelivery];

            /* Exclude excluded days and hours */
            const isExcluded = (start) => {
                return excludedHours.findIndex(item => {
                    return ((item.day === selectedDay.fullDate)&&(start === item.hour));
                }) !== -1;
            }

            const findIndex = excludedHours.findIndex(item => (
                item.day === selectedDay.fullDate
            ));

            if(dayOfDelivery === 0) {
                /* For today */
                const hour = new Date().getHours();
                if(hour <= 9) {
                    if(findIndex !== -1) {
                        setAvailableHours(availableHours.map((item) => {
                            return {
                                start: item.start,
                                end: item.end,
                                available: !isExcluded(item.start) && item.start >= 12
                            }
                        }));
                    }
                    else {
                        setAvailableHours(availableHours.map((item) => {
                            return {
                                start: item.start,
                                end: item.end,
                                available: item.start >= 12
                            }
                        }));
                    }
                }
                else {
                    if(findIndex !== -1) {
                        setAvailableHours(availableHours.map((item) => {
                            return {
                                start: item.start,
                                end: item.end,
                                available: !isExcluded(item.start) && item.start > hour+2
                            }
                        }));
                    }
                    else {
                        setAvailableHours(availableHours.map((item) => {
                            return {
                                start: item.start,
                                end: item.end,
                                available: item.start > hour+2
                            }
                        }));
                    }
                }
            } else {
                /* For next days */
                if ((selectedDay.dayOfTheWeek === 0) || (selectedDay.dayOfTheWeek === 2) || (selectedDay.dayOfTheWeek === 3)) {
                    if(findIndex !== -1) {
                        setAvailableHours(availableHours.map((item) => {
                            return {
                                start: item.start,
                                end: item.end,
                                available: !isExcluded(item.start) && item.end !== 22
                            }
                        }));
                    }
                    else {
                        setAvailableHours(availableHours.map((item) => {
                            return {
                                start: item.start,
                                end: item.end,
                                available: item.end !== 22
                            }
                        }));
                    }
                } else {
                    if(findIndex !== -1) {
                        setAvailableHours(availableHours.map((item) => {
                            return {
                                start: item.start,
                                end: item.end,
                                available: !isExcluded(item.start)
                            }
                        }));
                    }
                    else {
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
        }
    }, [dayOfDelivery]);

    useEffect(() => {
        if(fastest) {
            setChangeOnFastest(changeOnFastest+1);
        }
        else {
            setChangeOnFastest(0);
        }

        if(changeOnFastest) setFastest(false);
    }, [hourOfDelivery]);

    const isHourAvailable = (dayIndex, hourIndex) => {
        if(hourIndex !== -1) {
            const newArr = excludedHours.filter(item => {
                return item.hour === availableHours[hourIndex].start && item.day === calendar[dayIndex].fullDate;
            });
            return !newArr.length;
        }
        else {
            return false;
        }
    }

    Date.prototype.addHours = function(h) {
        this.setTime(this.getTime() + (h*60*60*1000));
        return this;
    }

    const chooseFastestPossibleHourInLoop = () => {
        let i = 0;
        while((!chooseFastestPossibleHour(i))&&(i<14*24)) {
            i++;
        }
    }

    const daysDifference = (date1, date2) => {
        const diffTime = Math.abs(date2 - date1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const chooseFastestPossibleHour = (h) => {
        const myDate = new Date().addHours(h);
        const currentDate = new Date();
        const hour = myDate.getHours();
        const dayOfTheWeek = myDate.getDay();
        if ((dayOfTheWeek === 4) || (dayOfTheWeek === 5) || (dayOfTheWeek === 6)) {
            if (hour < 9) {
                /* For today */
                if (isHourAvailable(daysDifference(myDate, currentDate), 0)) {
                    setDayOfDelivery(daysDifference(myDate, currentDate));
                    setHourOfDelivery(0);
                    return true;
                } else return false;
            } else if (hour < 19) {
                /* For today */
                if (isHourAvailable(daysDifference(myDate, currentDate), availableHours.findIndex(item => {
                    return item.start === parseInt(parseInt(hour) + 3);
                }))) {
                    setDayOfDelivery(daysDifference(myDate, currentDate));
                    setHourOfDelivery(availableHours.findIndex(item => {
                        return item.start === parseInt(parseInt(hour) + 3);
                    }));
                    return true;
                } else {
                    return false;
                }
            } else {
                /* For next day */
                if (isHourAvailable(Math.max(1, daysDifference(myDate, currentDate)), 0)) {
                    setDayOfDelivery(Math.max(1, daysDifference(myDate, currentDate)));
                    setHourOfDelivery(0);
                    return true;
                } else return false;
            }
        } else {
            if (hour < 9) {
                /* For today */
                if (isHourAvailable(daysDifference(myDate, currentDate), 0)) {
                    setDayOfDelivery(daysDifference(myDate, currentDate));
                    setHourOfDelivery(0);
                    return true;
                } else return false;
            } else if (hour < 18) {
                /* For today */
                if (isHourAvailable(daysDifference(myDate, currentDate), availableHours.findIndex(item => {
                    return item.start === hour + 3;
                }))) {
                    setDayOfDelivery(daysDifference(myDate, currentDate));
                    setHourOfDelivery(availableHours.findIndex(item => {
                        return item.start === hour + 3;
                    }));
                    return true;
                } else return false;
            } else {
                /* For next day */
                if (isHourAvailable(Math.max(1, daysDifference(myDate, currentDate)), 0)) {
                    setDayOfDelivery(Math.max(1, daysDifference(myDate, currentDate)));
                    setHourOfDelivery(0);
                    return true;
                } else return false;
            }
        }
    }

    useEffect(() => {
        /* Payment */
        if(formValidate) {
            const sessionId = uuidv4();
            setFormValidate(false);

            /* Add user */
            axios.post("http://brunchbox.skylo-test3.pl/auth/add-user", {
                firstName: formik.values.firstName,
                lastName: formik.values.lastName,
                email: formik.values.email,
                phoneNumber: formik.values.phoneNumber
            })
                .then(res => {
                    let insertedUserId = res.data.result;

                    /* Add order */
                    axios.post("http://brunchbox.skylo-test3.pl/order/add", {
                        paymentMethod: null,
                        shippingMethod: null,
                        city: personal ? "Odbiór osobisty" : formik.values.city,
                        street: personal ? "0" : formik.values.street,
                        building: personal ? "0" : formik.values.building,
                        flat: personal ? "0" : formik.values.flat,
                        postalCode: personal ? "0" : formik.values.postalCode,
                        user: insertedUserId,
                        comment: formik.values.comment,
                        sessionId,
                        delivery: calendar[dayOfDelivery].humanDate + ", godz: " + availableHours[hourOfDelivery].start + ":00 - " + availableHours[hourOfDelivery].end + ":00"
                    })
                        .then(res => {
                            const orderId = res.data.result;

                            /* Add ribbon */
                            if(ribbon) {
                                axios.post("http://brunchbox.skylo-test3.pl/order/add-ribbon", {
                                    orderId: orderId,
                                    caption: "Od: " + formik.values.ribbonFrom + " dla: " + formik.values.ribbonTo
                                });
                            }

                            /* Add sells */
                            const cart = JSON.parse(localStorage.getItem('sec-cart'));
                            cart.forEach((item, cartIndex) => {
                                /* Add sells */
                                axios.post("http://brunchbox.skylo-test3.pl/order/add-sell", {
                                    orderId,
                                    productId: item.id,
                                    option: item.option,
                                    quantity: item.quantity,
                                    size: item.size
                                });
                            });

                            /* Decrement coupon times_to_use value */
                            if(sessionStorage.getItem('brunchbox-coupon-used') === 'T') {
                                sessionStorage.removeItem('brunchbox-coupon-used');
                                axios.post("http://brunchbox.skylo-test3.pl/coupon/decrement", {
                                    couponContent
                                });
                            }

                            /* PAYMENT PROCESS */
                            let paymentUri = "https://sandbox.przelewy24.pl/trnRequest/";

                            axios.post("http://brunchbox.skylo-test3.pl/payment/payment", {
                                sessionId,
                                amount,
                                email: formik.values.email
                            })
                                .then(res => {
                                    /* Remove cart from local storage */
                                    localStorage.removeItem('sec-cart');
                                    localStorage.removeItem('sec-amount');

                                    const token = res.data.result;
                                    window.location.href = `${paymentUri}${token}`;
                                });
                        })
                });
        }
    }, [formValidate]);

    const addRibbon = (e) => {
        e.preventDefault();
        if(ribbon) {
            setRibbon(false);
            setAmount(amount - 10);
        }
        else {
            setAmount(amount + 10);
            setRibbon(true);
        }
    }

    const checkCoupon = (e) => {
        e.preventDefault();

        axios.post("http://brunchbox.skylo-test3.pl/coupon/verify", {
            code: couponContent
        })
            .then(res => {
                if((res.data.result)&&(!couponUsed)) {
                    setCouponUsed(true);
                    setCouponError(false);
                    sessionStorage.setItem('brunchbox-coupon-used', 'T');
                    if(res.data.percent) {
                        /* Discount by percent */
                        const percent = res.data.percent;
                        setAmount(Math.round(amount - amount * (percent / 100)));
                        setDiscount(percent.toString() + "%");
                    }
                    else {
                        /* Discount by amount */
                        setDiscount(res.data.amount.toString() + " PLN");
                        setAmount(amount - res.data.amount);
                    }
                }
                else if(!res.data.result) {
                    setCouponError(true);
                }
            });
    }

    return <form className="cartContent" onSubmit={formik.handleSubmit}>
        <h1 className="cart__header cart__header--shippingAndPayment">
            Wpisz swoje dane i dokończ zamówienie
        </h1>

        <main className="cart cart--flex">
            <section className="shippingAndPayment__section">
                <h2 className="shippingAndPayment__header">
                    Wybierz dzień dostawy
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
                <label className="ribbonBtnLabel ribbonBtnLabel--hour">
                    <button className="ribbonBtn" onClick={(e) => {
                        e.preventDefault();
                        setFastest(!fastest);
                    }}>
                        <span className={fastest ? "ribbon" : "d-none"}></span>
                    </button>
                    Dostarcz zamówienie najszybciej jak to możliwe
                </label>
            </section>

            <section className="shippingAndPayment__section shippingAndPayment__section--noMarginBottom">
                <h2 className="shippingAndPayment__header">
                    Wybierz godzinę dostawy
                </h2>
                <section className="shippingAndPayment__section shippingAndPayment__section--hours">
                    {availableHours.map((item, index) => {
                            return <label className={item.available ? "ribbonBtnLabel ribbonBtnLabel--hour" : "ribbonBtnLabel ribbonBtnLabel--hour hour--disabled"}>
                                <button disabled={!item.available} className="ribbonBtn" onClick={(e) => {
                                    e.preventDefault();
                                    setHourOfDelivery(index);
                                }}>
                                    <span className={hourOfDelivery === index && item.available ? "ribbon" : "d-none"}></span>
                                </button>
                                {item.start.toString() + ":00 - " + item.end.toString() + ":00"}
                            </label>
                    })}
                </section>
            </section>
        </main>

        <main className="cart cart--flex">
            <section className="shippingAndPayment__section">
                <h2 className="shippingAndPayment__header">
                    Dane osobowe
                </h2>

                <div className="shippingAndPayment__form">
                    <label className="shippingAndPayment__label label-100">
                        <input className={formik.errors.firstName ? "shippingAndPayment__input shippingAndPayment--error" : "shippingAndPayment__input"}
                               name="firstName"
                               value={formik.values.firstName}
                               onChange={formik.handleChange}
                               placeholder="Twoje imię"
                               type="text" />
                    </label>
                    <label className="shippingAndPayment__label label-100">
                        <input className={formik.errors.lastName ? "shippingAndPayment__input shippingAndPayment--error" : "shippingAndPayment__input"}
                               name="lastName"
                               value={formik.values.lastName}
                               onChange={formik.handleChange}
                               placeholder="Twoje nazwisko"
                               type="text" />
                    </label>

                    <label className="shippingAndPayment__label label-50">
                        <input className={formik.errors.email ? "shippingAndPayment__input shippingAndPayment--error" : "shippingAndPayment__input"}
                               name="email"
                               value={formik.values.email}
                               onChange={formik.handleChange}
                               placeholder="Adres email"
                               type="text" />
                    </label>
                    <label className="shippingAndPayment__label label-50">
                        <input className={formik.errors.phoneNumber ? "shippingAndPayment__input shippingAndPayment--error" : "shippingAndPayment__input"}
                               name="phoneNumber"
                               value={formik.values.phoneNumber}
                               onChange={formik.handleChange}
                               placeholder="Numer telefonu"
                               type="text" />
                    </label>

                    <label className="shippingAndPayment__label label-70">
                        <input className={formik.errors.city ? "shippingAndPayment__input shippingAndPayment--error" : "shippingAndPayment__input"}
                               name="city"
                               value={formik.values.city}
                               onChange={formik.handleChange}
                               disabled={personal}
                               placeholder="Miejscowość"
                               type="text" />
                    </label>
                    <label className="shippingAndPayment__label label-30">
                        <input className={formik.errors.postalCode ? "shippingAndPayment__input shippingAndPayment--error" : "shippingAndPayment__input"}
                               name="postalCode"
                               value={formik.values.postalCode}
                               onChange={formik.handleChange}
                               disabled={personal}
                               placeholder="Kod pocztowy"
                               type="text" />
                    </label>

                    <label className="shippingAndPayment__label label-60">
                        <input className={formik.errors.street ? "shippingAndPayment__input shippingAndPayment--error" : "shippingAndPayment__input"}
                               name="street"
                               value={formik.values.street}
                               onChange={formik.handleChange}
                               placeholder="Ulica"
                               disabled={personal}
                               type="text" />
                    </label>
                    <label className="shippingAndPayment__label label-20">
                        <input className={formik.errors.building ? "shippingAndPayment__input shippingAndPayment--error" : "shippingAndPayment__input"}
                               name="building"
                               value={formik.values.building}
                               onChange={formik.handleChange}
                               placeholder="Numer domu"
                               disabled={personal}
                               type="text" />
                    </label>
                    <label className="shippingAndPayment__label label-20">
                        <input className="shippingAndPayment__input"
                               name="flat"
                               value={formik.values.flat}
                               onChange={formik.handleChange}
                               placeholder="Numer mieszkania"
                               disabled={personal}
                               type="text" />
                    </label>
                </div>

                {personalAvailable ?  <><label className="ribbonBtnLabel">
                    <button className="ribbonBtn" onClick={(e) => { e.preventDefault(); setPersonal(!personal); }}>
                        <span className={personal ? "ribbon" : "d-none"}></span>
                    </button>
                    Odbiór osobisty
                </label>
                    <section className="address" dangerouslySetInnerHTML={{__html: address}}>

                    </section>
                </> : ""}
            </section>

            <section className="shippingAndPayment__section">
                <h2 className="shippingAndPayment__header">
                    Pozostałe informacje
                </h2>

                <textarea
                    className="shippingAndPayment__textArea"
                    name="comment"
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    placeholder="Komentarz do zamówienia (opcjonalnie)" />

                <label className="ribbonBtnLabel">
                    <button className="ribbonBtn" onClick={(e) => { e.preventDefault(); setCoupon(!coupon); }}>
                        <span className={coupon ? "ribbon" : "d-none"}></span>
                    </button>
                    Mam kupon rabatowy
                </label>

                <section className={coupon ? "ribbonDedication" : "o-none"}>
                    <section className="couponSection">
                        {!couponUsed ? <><label className="ribbonLabel">
                                <input className="shippingAndPayment__input"
                                       name="coupon"
                                       type="text"
                                       value={couponContent}
                                       onChange={(e) => { setCouponContent(e.target.value); }}
                                       placeholder="Tu wpisz swój kupon" />
                            </label>
                            <button className="button button--coupon" onClick={(e) => { checkCoupon(e) }}>
                                Dodaj kupon
                            </button></> : <h3 className="couponUsed">
                                Kupon: { couponContent }, zniżka: { discount }
                            </h3>}
                    </section>
                    <span className="errorsContainer errorsContainer--coupon">
                        {couponError ? "Podany kupon rabatowy nie istnieje" : ""}
                    </span>
                </section>

                <label className="ribbonBtnLabel">
                    <button className="ribbonBtn" onClick={(e) => { addRibbon(e) }}>
                        <span className={ribbon ? "ribbon" : "d-none"}></span>
                    </button>
                    Wstążka z dedykacją (10 PLN)
                </label>

                <section className={ribbon ? "ribbonDedication" : "o-none"}>
                    <label className="ribbonLabel">
                    <input className="shippingAndPayment__input"
                           name="ribbonFrom"
                           type="text"
                           value={formik.values.ribbonFrom}
                           onChange={formik.handleChange}
                           placeholder="Od kogo" />
                    </label>
                    <label className="ribbonLabel">
                    <input className="shippingAndPayment__input"
                           name="ribbonTo"
                           type="text"
                           value={formik.values.ribbonTo}
                           onChange={formik.handleChange}
                           placeholder="Dla kogo" />
                    </label>
                </section>
            </section>
        </main>

        <section className="cart__summary cart__summary--shippingAndPayment">
            <button className="cart__summary__button cart__summary__button--back button__link--small">
                <a href="/koszyk">
                    Powrót do koszyka
                </a>
            </button>

            <section>
                <header className="cart__summary__header">
                    <h3 className="cart__summary__header__label">
                        Łącznie do zapłaty:
                    </h3>
                    <h4 className="cart__summary__header__value">
                        {amount} PLN
                    </h4>
                </header>
                <button className="cart__summary__button cart__summary__button--shippingAndPayment button__link--small" type="submit">
                    Przechodzę do płatności
                </button>
            </section>
        </section>
    </form>
}

export default ShippingAndPayment;
