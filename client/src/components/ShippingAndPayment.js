import React, { useState, useEffect } from 'react'
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import axios from 'axios'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import {getProductById} from "../helpers/productFunctions";
import settings from "../admin/helpers/settings";
import {getNextDays, numberToDayOfTheWeek} from "../helpers/datetimeFunctions";
import { v4 as uuidv4 } from 'uuid';
import Loader from "react-loader-spinner";
import {getAllDeliveryPrices} from "../admin/helpers/deliveryFunctions";
import deliverySchedule from "../helpers/deliverySchedule";
import {areShopOpen} from "../helpers/openCloseAlgorithm";

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
    const [coupon, setCoupon] = useState(false);
    const [couponContent, setCouponContent] = useState("");
    const [couponUsed, setCouponUsed] = useState(false);
    const [discount, setDiscount] = useState("");
    const [couponError, setCouponError] = useState(false);
    const [calendar, setCalendar] = useState(getNextDays(14));
    const [dayOfDelivery, setDayOfDelivery] = useState(0);
    const [hourOfDelivery, setHourOfDelivery] = useState(-1);
    const [schedule, setSchedule] = useState(deliverySchedule);
    const [excludedHours, setExcludedHours] = useState([]);
    const [fastest, setFastest] = useState(false);
    const [changeOnFastest, setChangeOnFastest] = useState(0);
    const [dateError, setDateError] = useState(false);
    const [routeResult, setRouteResult] = useState("");
    const [routeError, setRouteError] = useState("");
    const [routeLoader, setRouteLoader] = useState(false);
    const [deliveryPrice, setDeliveryPrice] = useState(-1);
    const [block, setBlock] = useState(0);
    const [originStreet, setOriginStreet] = useState("");
    const [originBuilding, setOriginBuilding] = useState("");
    const [originFlat, setOriginFlat] = useState("");
    const [originPostalCode, setOriginPostalCode] = useState("");
    const [originCity, setOriginCity] = useState("");
    const [deliveryValidate, setDeliveryValidate] = useState(-1);
    const [deliveryPriceSettled, setDeliveryPriceSettled] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);

    const [vat, setVat] = useState(false);

    useEffect(() => {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const currentDayOfTheWeek = currentDate.getDay();

        const shopOpenAlgorithm = areShopOpen();
        if(shopOpenAlgorithm) {
            shopOpenAlgorithm
                .then((res) => {
                    const result = res.data.result;
                    result.findIndex((item) => {
                        if((new Date(item.day).getDay() === currentDayOfTheWeek)&&(item.hour_start === currentHour)) {
                            setShopOpen(false);
                        }
                    })
                });
        }
        else {
            setShopOpen(false);
        }
    }, []);

    const fillRibbonsArray = () => {
        let arr = [];
        cart?.forEach((item, index, array) => {
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

    useEffect(() => {
        setExcludedHoursByAdminSettings(excludedHours);
    }, [excludedHours]);

    useEffect(() => {
        if(personal) {
            setDeliveryPrice(0);
        }
        else {
            calculateRoute(null, null, null, null);
        }
    }, [personal]);

    const isDayBlocked = (excludedHours, day) => {
        return excludedHours.findIndex((item) => {
            return item.day === day;
        }) !== -1;
    }

    const isHourBlocked = (excludedHours, day, hourStart) => {
        return excludedHours.findIndex((item) => {
           return item.hour === hourStart && item.day === day;
        }) !== -1;
    }

    const isShorterDay = (fullDate) => {
        const dayArray = fullDate.split("-");
        const year = parseInt(dayArray[0]);
        const month = parseInt(dayArray[1]);
        const day = parseInt(dayArray[2]);

        const dateObj = new Date(year, month-1, day);
        const dayOfTheWeek = dateObj.getDay();

        return ((dayOfTheWeek === 0)||(dayOfTheWeek === 2)||(dayOfTheWeek === 3));
    }

    const setExcludedHoursByCurrentTime = () => {
        const currentSchedule = JSON.parse(localStorage.getItem('schedule'));
        localStorage.setItem('schedule', JSON.stringify(currentSchedule.map((scheduleItem, scheduleIndex) => {
            if(scheduleIndex === 0) {
                /* Block hours for today */
                const hour = new Date().getHours();
                if(hour <= 9) {
                    /* Morning - block hours to 12 */
                    return {
                        day: scheduleItem.day,
                        hours: scheduleItem.hours.map((hoursItem) => {
                            return { start: hoursItem.start, end: hoursItem.end, available: hoursItem.start >= 12 ? hoursItem.available : 0 }
                        })
                    }
                }
                else {
                    /* During the day - block hours before current hour and next two */
                    return {
                        day: scheduleItem.day,
                        hours: scheduleItem.hours.map((hoursItem) => {
                            return { start: hoursItem.start, end: hoursItem.end, available: hour + 2 < hoursItem.start ? hoursItem.available : 0 }
                        })
                    }
                }
            }
            else return scheduleItem;
        })));
        setSchedule(JSON.parse(localStorage.getItem('schedule')));
    }

    const setExcludedHoursByAdminSettings = (excludedHours) => {
           localStorage.setItem('schedule', JSON.stringify(schedule.map((scheduleItem) => {
               if(isDayBlocked(excludedHours, scheduleItem.day)) {
                   return {
                       day: scheduleItem.day,
                       hours: scheduleItem.hours.map((hoursItem) => {
                           if(isHourBlocked(excludedHours, scheduleItem.day, hoursItem.start)) {
                               return { start: hoursItem.start, end: hoursItem.end, available: 0 }
                           }
                           else {
                               return hoursItem;
                           }
                       })
                   }
               }
               else return scheduleItem;
           })));
           setSchedule(JSON.parse(localStorage.getItem('schedule')));
           setExcludedHoursByDayOfTheWeek();
    }

    const setExcludedHoursByDayOfTheWeek = () => {
        const currentSchedule = JSON.parse(localStorage.getItem('schedule'));

        localStorage.setItem('schedule', JSON.stringify(currentSchedule.map((item) => {
            if(item.day) {
                if(isShorterDay(item.day)) {
                    return {
                        day: item.day,
                        hours: item.hours.map((hoursItem) => {
                            if(hoursItem.end === 22) {
                                return { start: hoursItem.start, end: hoursItem.end, available: 0 }
                            }
                            else return hoursItem;
                        })
                    }
                }
                else return item;
            }
            else return item;
        })));
        setSchedule(JSON.parse(localStorage.getItem('schedule')));
        setExcludedHoursByCurrentTime();
    }

    useEffect(() => {
        if(block !== 0) {
            setExcludedHoursByProductsInCart()
        }
    }, [block]);

    const setExcludedHoursByProductsInCart = () => {
        let currentBlock = block;
        localStorage.setItem('schedule', JSON.stringify(schedule.map((item) => {
            return {
                item: item.day,
                hours: item.hours.map((hoursItem) => {
                    if(hoursItem.available !== 0) currentBlock--;

                    if(currentBlock >= 0) return {start: hoursItem.start, end: hoursItem.end, available: 0}
                    else return hoursItem;
                })
            }
        })));
        setSchedule(JSON.parse(localStorage.getItem('schedule')));
    }

    useEffect(() => {
        if(!amount) window.location = "/";

        /* Set fastest/choose hour based on screen resolution (mobile/desktop) */
        if(window.innerWidth < 768) {
            setFastest(true);
        }

        /* Set string dates in schedule */
        const next14Days = getNextDays(14);
        setSchedule(schedule.map((item, index) => {
            return {
                day: next14Days[index].checkForExcludeDate,
                hours: item.hours
            }
        }));

        /* Set unavailable hours from admin panel */
        axios.get("https://brunchbox.pl/dates/get-all")
            .then(res => {
                const excludedDaysInfo = res.data.result;
                let excludedHoursTmp = [];
                excludedDaysInfo?.forEach((item, index, array) => {
                    excludedHoursTmp.push({
                        day: item.day.substring(0, 10),
                        hour: item.hour_start
                    });
                });
                setExcludedHours(excludedHoursTmp);
            });

        /* Get personal takeaway info */
        axios.get(`${settings.API_URL}/shipping/get-info`)
            .then(res => {
                const result = res.data.result[0];
                if(result) {
                    if(result.is_on) {
                        setPersonalAvailable(true);
                        setOriginStreet(result.street);
                        setOriginBuilding(result.building);
                        setOriginFlat(result.flat);
                        setOriginPostalCode(result.postal_code);
                        setOriginCity(result.city);
                    }
                }
            });

        /* Get cart products names */
        cart?.forEach((item, index, array) => {
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

        /* Get first hours excluded from database */
        axios.get(`https://brunchbox.pl/dates/get-first-hours-excluded`)
            .then(res => {
               if(res.data.result) {
                   const hoursToBlock = res.data.result;

                   /* Get number of hours to block according to current cart content */
                   const cartBanquet = JSON.parse(localStorage.getItem('sec-cart-banquet'));
                   const cartNormal = JSON.parse(localStorage.getItem('sec-cart'));

                   if(cartNormal?.findIndex(item => {
                        return item.size === "Cały box" || item.size === "1/2 boxa";
                   }) !== -1) {
                       setBlock(hoursToBlock.group_menu);
                   }
                   else if((cartBanquet)&&(cartBanquet?.findIndex(item => {
                       if(item.length) {
                           return item.findIndex(childItem => {
                               return childItem.uuid;
                           }) !== -1;
                       }
                       else return false;
                   }) !== -1)) {
                       setBlock(hoursToBlock.banquet_menu);
                   }
                   else setBlock(0);
               }
            });

        document.querySelectorAll(".input--address").forEach(item => {
            item.addEventListener("change", (event) => {
                event.preventDefault();
                setDeliveryPriceSettled(false);
                /* Check if should send request to Google Maps API */
                const allAddressInputs = Array.prototype.slice.call(document.querySelectorAll(".input--address"));
                if(allAddressInputs?.findIndex(item => {
                    return item.value === "" || (item.value.length !== 6 && item.name === "postalCode");
                }) === -1) {
                    const city = allAddressInputs[0].attributes.value.value;
                    const postalCode = allAddressInputs[1].attributes.value.value;
                    const street = allAddressInputs[2].attributes.value.value.split(" ")[0];
                    const building = allAddressInputs[2].attributes.value.value.split(" ")[1];
                    calculateRoute(city, postalCode, street, building);
                }
            });
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
            .required("Wpisz swoją ulicę")
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
            comment: "",
            vat: "",
            companyName: "",
            nip: ""
        },
        validationSchema: personal ? validationSchemaPersonal : validationSchema,
        onSubmit: values => {
            if(!submitted) {
                /* Additional validation for delivery price */
                if(((personal)||((deliveryPriceSettled))&&(deliveryPrice !== -1))&&(deliveryPrice !== -2)) {
                    setDeliveryValidate(1);
                    console.log("validate delivery");
                    /* Additional validation for delivery date and time and delivery price */
                    if(((calendar[dayOfDelivery])&&(hourOfDelivery !== -1))||(fastest)) {
                        setFormValidate(true);
                        console.log("validate calendar");
                        setSubmitted(true);
                    }
                    else {
                        console.log("date error");
                        setDateError(true);
                    }
                }
                else {
                    console.log("delivery error");
                    setDeliveryValidate(0);
                }
            }
        }
    });

    useEffect(() => {
        setHourOfDelivery(-1);
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

    Date.prototype.addHours = function(h) {
        this.setTime(this.getTime() + (h * 60 * 60 * 1000));
        return this;
    }

    useEffect(() => {
        if(fastest) {
            setHourOfDelivery(-1);
            setDayOfDelivery(-1);
        }
        else {
            setDayOfDelivery(0);
        }
    }, [fastest]);

    useEffect(() => {
        if(!deliveryValidate) {
            calculateRoute();
        }
    }, [deliveryValidate]);

    useEffect(() => {
        /* Payment */
        if((formValidate)&&(deliveryValidate)) {
            const sessionId = uuidv4();
            setFormValidate(false);

            /* Add user */
            axios.post("https://brunchbox.pl/auth/add-user", {
                firstName: formik.values.firstName,
                lastName: formik.values.lastName,
                email: formik.values.email,
                phoneNumber: formik.values.phoneNumber
            })
                .then(res => {
                    console.log(res.data);
                    let insertedUserId = res.data.result;
                    const banquetCart = JSON.parse(localStorage.getItem('sec-cart-banquet'));
                    /* Add order */
                    axios.post("https://brunchbox.pl/order/add", {
                        paymentMethod: null,
                        shippingMethod: null,
                        city: personal ? "Odbiór osobisty" : formik.values.city,
                        street: personal ? "0" : formik.values.street.split(" ")[0],
                        building: personal ? "0" : formik.values.street.split(" ")[1],
                        postalCode: personal ? "0" : formik.values.postalCode,
                        user: insertedUserId,
                        comment: formik.values.comment,
                        sessionId,
                        companyName: vat ? formik.values.companyName : null,
                        nip: vat ? formik.values.nip : null,
                        delivery: fastest ? "Najszybciej jak to możliwe" : calendar[dayOfDelivery].humanDate + ", godz: " + hourOfDelivery + ":00 - " + (hourOfDelivery+1) + ":00"
                    })
                        .then(res => {
                            const orderId = res.data.result;
                            console.log(res.data.result);

                            /* Add ribbon */
                            if(ribbon) {
                                axios.post("https://brunchbox.pl/order/add-ribbon", {
                                    orderId: orderId,
                                    caption: "Od: " + formik.values.ribbonFrom + " dla: " + formik.values.ribbonTo
                                });
                            }

                            /* Add sells - normal products */
                            const cart = JSON.parse(localStorage.getItem('sec-cart'));
                            cart?.forEach((item, cartIndex) => {
                                /* Add sells */
                                axios.post("https://brunchbox.pl/order/add-sell", {
                                    orderId,
                                    productId: item.id,
                                    option: item.option,
                                    quantity: item.quantity,
                                    size: item.size
                                });
                            });

                            /* Add sells - banquet products */
                            const banquetCart = JSON.parse(localStorage.getItem('sec-cart-banquet'));
                            banquetCart?.forEach((item) => {
                                item.forEach(itemChild => {
                                    /* Add banquet sells */
                                    if(itemChild.amount) {
                                        axios.post("https://brunchbox.pl/order/add-sell", {
                                            orderId,
                                            productId: itemChild.id,
                                            option: itemChild.selected25 ? "25 szt." : "50 szt.",
                                            quantity: itemChild.amount,
                                            size: null
                                        });
                                    }
                                });
                            });

                            /* Decrement coupon times_to_use value */
                            if(sessionStorage.getItem('brunchbox-coupon-used') === 'T') {
                                sessionStorage.removeItem('brunchbox-coupon-used');
                                axios.post("https://brunchbox.pl/coupon/decrement", {
                                    couponContent
                                });
                            }

                            /* PAYMENT PROCESS */
                            let paymentUri = "https://secure.przelewy24.pl/trnRequest/";

                            axios.post("https://brunchbox.pl/payment/payment", {
                                sessionId,
                                amount: amount + deliveryPrice,
                                email: formik.values.email
                            })
                                .then(res => {
                                    console.log(res.data);
                                    /* Remove cart from local storage */
                                    localStorage.removeItem('sec-cart');
                                    localStorage.removeItem('sec-amount');
                                    localStorage.removeItem('sec-cart-banquet');

                                    const token = res.data.result;
                                    window.location.href = `${paymentUri}${token}`;
                                });
                        });
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

        axios.post("https://brunchbox.pl/coupon/verify", {
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

    useEffect(() => {
        if(dateError) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }, [dateError]);

    const calculateRoute = (city, postalCode, street, building) => {
        if(!city) city = formik.values.city;
        if(!postalCode) postalCode = formik.values.postalCode;
        if(!street) street = formik.values.street.split(" ")[0];
        if(!building) building = formik.values.street.split(" ")[1];

        setRouteLoader(true);

        if((street)&&(building)&&(postalCode)&&(city)) {
            axios.post("https://brunchbox.pl/maps/get-distance", {
                street, building, postalCode, city
            })
                .then(res => {
                    if(res.data.result) {
                        setRouteResult(res.data.result.routes[0].legs[0].distance.text);
                        calculateDeliveryPrice(parseFloat(res.data.result.routes[0].legs[0].distance.text.split(" ")[0]));
                        setRouteLoader(false);
                        setRouteError("");
                    }
                });
        }
        else {
            setRouteError("Wpisz adres dostawy");
            setRouteLoader(false);
        }
    }

    const calculateDeliveryPrice = (km) => {
        getAllDeliveryPrices()
            .then(res => {
                const result = res.data.result;
                let block = false;
                result.forEach((item, index, array) => {
                   if((parseFloat(item.km_from) <= km)&&(parseFloat(item.km_to) > km)) {
                        block = true;
                        setDeliveryPrice(item.price);
                        setDeliveryPriceSettled(true);
                        return 0;
                   }

                   if((!block)&&(index === array.length-1)) {
                       setDeliveryPrice(-2);
                   }
                });
            });
    }

    return <form className="cartContent shippingAndPayment" onSubmit={formik.handleSubmit}>
        <h1 className="cart__header cart__header--shippingAndPayment">
            Wpisz swoje dane i dokończ zamówienie
        </h1>

        <main className={dateError ? "cart cart--flex cart--borderRed shakeAnimation" : "cart cart--flex"}>
            <section className="shippingAndPayment__section">
                <h2 className="shippingAndPayment__header">
                    Wybierz dzień dostawy
                </h2>
                <label className="ribbonBtnLabel ribbonBtnLabel--hour ribbonBtnLabel--fastest">
                    <button className="ribbonBtn" onClick={(e) => {
                        e.preventDefault();
                        setFastest(!fastest);
                    }}>
                        <span className={fastest ? "ribbon" : "d-none"}></span>
                    </button>
                    Dostarcz zamówienie najszybciej jak to możliwe
                </label>
                <label className="ribbonBtnLabel ribbonBtnLabel--hour ribbonBtnLabel--fastest ribbonBtnLabel--chooseHour">
                    <button className="ribbonBtn" onClick={(e) => {
                        e.preventDefault();
                        setFastest(!fastest);
                    }}>
                        <span className={!fastest ? "ribbon" : "d-none"}></span>
                    </button>
                    Wybierz datę i godzinę zamówienia
                </label>
                <section className={fastest ? "shippingAndPayment__calendar opacity-5" : "shippingAndPayment__calendar"} id={fastest && window.innerWidth < 768 ? "d-none" : ""}>
                    {fastest ? <div className="shippingAndPayment__calendar__overlay"></div> : ""}

                    {calendar?.map((item, index) => (
                        <button className={dayOfDelivery === index ? "shippingAndPayment__calendar__btn shippingAndPayment__calendar__btn--checked" : "shippingAndPayment__calendar__btn"}
                                key={index}
                                onClick={(e) => { e.preventDefault(); setDayOfDelivery(index); }}
                        >
                            <h3 className="calendarDay">
                                {item.day}
                            </h3>
                            <h4 className="calendarDayOfWeek">
                                {numberToDayOfTheWeek(item.dayOfTheWeek)}
                            </h4>
                            <h5 className="calendarMonth">
                                {item.month}
                            </h5>
                        </button>
                    ))}
                </section>

                {/* Second section */}
                {!fastest ? <h2 className="shippingAndPayment__header marginTop50">
                    Wybierz godzinę dostawy
                </h2> : ""}
                <section className={fastest ? "shippingAndPayment__section shippingAndPayment__section--hours opacity-5" : "shippingAndPayment__section shippingAndPayment__section--hours"}>
                    {fastest ? <div className="shippingAndPayment__calendar__overlay"></div> : ""}

                    {schedule[dayOfDelivery]?.hours?.map((item, index) => {
                        return <label className={item.available ? "ribbonBtnLabel ribbonBtnLabel--hour" : "ribbonBtnLabel ribbonBtnLabel--hour hour--disabled"}>
                            <button disabled={!item.available} className="ribbonBtn" onClick={(e) => {
                                e.preventDefault();
                                setHourOfDelivery(item.start);
                            }}>
                                <span className={hourOfDelivery === item.start && item.available ? "ribbon" : "d-none"}></span>
                            </button>
                            {item.start.toString() + ":00 - " + item.end.toString() + ":00"}
                        </label>
                    })}
                </section>

                {!shopOpen ? <p className="shopClosedText">
                    Przepraszamy. Jesteśmy teraz zamknięci.
                    Zapraszamy do zakładki "Kontakt" po więcej informacji
                    lub pod tel. 696-696-995.
                </p> : ""}
            </section>

            <section className="shippingAndPayment__section">
                <h2 className="shippingAndPayment__header">
                    Dane osobowe
                </h2>

                <div className="shippingAndPayment__form">
                    <input className="invisibleInput"
                           name="vat"
                           value={vat ? "vat" : ""} />

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
                        <input className={formik.errors.city ? "shippingAndPayment__input input--address shippingAndPayment--error" : "shippingAndPayment__input input--address"}
                               name="city"
                               value={formik.values.city}
                               onChange={formik.handleChange}
                               disabled={personal}
                               placeholder="Miejscowość"
                               type="text" />
                    </label>
                    <label className="shippingAndPayment__label label-30">
                        <input className={formik.errors.postalCode ? "shippingAndPayment__input input--address shippingAndPayment--error" : "shippingAndPayment__input input--address"}
                               name="postalCode"
                               value={formik.values.postalCode}
                               onChange={formik.handleChange}
                               disabled={personal}
                               placeholder="Kod pocztowy"
                               type="text" />
                    </label>

                    <label className="shippingAndPayment__label label-100">
                        <input className={formik.errors.street ? "shippingAndPayment__input input--address shippingAndPayment--error" : "shippingAndPayment__input input--address"}
                               name="street"
                               value={formik.values.street}
                               onChange={formik.handleChange}
                               placeholder="Ulica, numer domu, numer mieszkania"
                               disabled={personal}
                               type="text" />
                    </label>
                </div>

                <section className="afterFormSection">

                    <section className="extraInputs">
                        {personalAvailable ?  <div><label className="ribbonBtnLabel">
                            <button className="ribbonBtn" onClick={(e) => { e.preventDefault(); setPersonal(!personal); }}>
                                <span className={personal ? "ribbon" : "d-none"}></span>
                            </button>
                            <section className="address">
                                Odbiór osobisty: {originStreet} {originBuilding}{originFlat ? "/" + originFlat + ";" : ";"} <br/>
                                {originPostalCode} {originCity}
                            </section>
                        </label>
                        </div> : ""}

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

                        <label className="ribbonBtnLabel">
                            <button type="button" className="ribbonBtn" onClick={(e) => { setVat(!vat); }}>
                                <span className={vat ? "ribbon" : "d-none"}></span>
                            </button>
                            Chcę otrzymać fakturę
                        </label>

                        <section className={vat ? "ribbonDedication" : "o-none"}>
                            <label className="ribbonLabel">
                                <input className="shippingAndPayment__input"
                                       name="companyName"
                                       type="text"
                                       value={formik.values.companyName}
                                       onChange={formik.handleChange}
                                       placeholder="Nazwa firmy" />
                            </label>
                            <label className="ribbonLabel">
                                <input className="shippingAndPayment__input"
                                       name="nip"
                                       type="text"
                                       value={formik.values.nip}
                                       onChange={formik.handleChange}
                                       placeholder="NIP" />
                            </label>
                        </section>
                    </section>
                </section>


                {/* Second section */}
                <h2 className="shippingAndPayment__header marginTop50">
                    Pozostałe informacje
                </h2>

                <textarea
                    className="shippingAndPayment__textArea"
                    name="comment"
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    placeholder="Komentarz do zamówienia (opcjonalnie)" />

            </section>
        </main>

        <section className="cart__summary cart__summary--shippingAndPayment">
            <button className="cart__summary__button cart__summary__button--back button__link--small">
                <a href="/koszyk">
                    Powrót do koszyka
                </a>
            </button>

            <section className="cart__summary__bottomRight">
                {deliveryPrice !== -1 ? <>
                    <header className="cart__summary__header">
                        <h3 className="cart__summary__header__label">
                            Dostawa:
                        </h3>
                        <h4 className="cart__summary__header__value">
                            {deliveryPrice !== -2 ? (deliveryPrice + " PLN") : <span className="noDelivery">Brak możliwości dostawy na podany adres</span>}
                        </h4>
                    </header>
                </> : ""}
                <header className={deliveryPrice !== -1 ? "cart__summary__header cart__summary__header--sum" : "cart__summary__header"}>
                    <h3 className="cart__summary__header__label">
                        Łącznie do zapłaty:
                    </h3>
                    <h4 className="cart__summary__header__value">
                        {deliveryPrice > 0 ? amount + deliveryPrice : amount} PLN
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
