import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import {getProductById} from "../helpers/productFunctions";

const ShippingAndPayment = () => {
    const [msg, setMsg] = useState("");
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

    let k = -1;

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

    useEffect(() => {
        if(!amount) window.location = "/";

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
            ribbon: "",
            comment: ""
        },
        validationSchema,
        onSubmit: values => {
            setFormValidate(true);
        }
    });

    useEffect(() => {
        /* Payment */
        if(formValidate) {
            setFormValidate(false);
            /* Add user */
            axios.post("http://localhost:5000/auth/add-user", {
                firstName: formik.values.firstName,
                lastName: formik.values.lastName,
                email: formik.values.email,
                phoneNumber: formik.values.phoneNumber
            })
                .then(res => {
                    let insertedUserId = res.data.result;

                    /* Add order */
                    axios.post("http://localhost:5000/order/add", {
                        paymentMethod: null,
                        shippingMethod: null,
                        city: formik.values.city,
                        street: formik.values.street,
                        building: formik.values.building,
                        flat: formik.values.flat,
                        postalCode: formik.values.postalCode,
                        user: insertedUserId,
                        comment: formik.values.comment
                    })
                        .then(res => {
                            const orderId = res.data.result;

                            console.log("START AFTER ADD ORDER");

                            /* Add sells and ribbons */
                            const cart = JSON.parse(localStorage.getItem('sec-cart'));
                            cart.forEach((item, cartIndex) => {
                                /* Add sells */
                                axios.post("http://localhost:5000/order/add-sell", {
                                    orderId,
                                    productId: item.id,
                                    option: item.option,
                                    quantity: item.quantity,
                                    size: item.size
                                })
                                    .then(res => {
                                        /* Add ribbons */
                                        const insertedId = res.data.result;
                                        ribbons.forEach((item, index) => {
                                            if((item.ribbon)&&(item.sell === cartIndex)) {
                                                axios.post("http://localhost:5000/order/add-ribbon", {
                                                    sellId: insertedId,
                                                    caption: item.text
                                                })
                                                    .then((res) => {

                                                    });
                                            }
                                        });
                                    });
                            });

                            /* Payment */
                            let paymentUri = "https://sandbox.przelewy24.pl/trnRequest/";

                            axios.post("http://localhost:5000/payment/payment", {
                                amount: parseInt(localStorage.getItem('sec-amount')),
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
        }
        else {
            setRibbon(true);
        }
    }

    const changeRibbon = (e) => {
        e.preventDefault();
        const id = e.target.id;
        let splittedId = id.split("-");
        if((id.substr(0, 2) === "id")||(id.substr(0, 2) === "sp")) {
            let n = parseInt(splittedId[0].substr(2));
            let ribs = ribbons;
            if(ribs[n].ribbon) setAmount(amount-10);
            else setAmount(amount+10);
            ribs[n] = {
                ribbon: !ribs[n].ribbon,
                text: ribs[n].text,
                sell: ribs[n].sell
            };
            setRibbons([...ribs]);
        }
        else {
            let n = parseInt(splittedId[0].substr(2));
            let ribs = ribbons;
            ribs[n] = {
                ribbon: ribs[n].ribbon,
                text: e.target.value,
                sell: ribs[n].sell
            }
            setRibbons([...ribs]);
        }
        console.log(ribbons);
    }

    return <form className="cartContent" onSubmit={formik.handleSubmit}>
        <h1 className="cart__header cart__header--shippingAndPayment">
            Wpisz swoje dane i dokończ zamówienie
        </h1>

        <main className="cart cart--flex"
        >
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
                               placeholder="Miejscowość"
                               type="text" />
                    </label>
                    <label className="shippingAndPayment__label label-30">
                        <input className={formik.errors.postalCode ? "shippingAndPayment__input shippingAndPayment--error" : "shippingAndPayment__input"}
                               name="postalCode"
                               value={formik.values.postalCode}
                               onChange={formik.handleChange}
                               placeholder="Kod pocztowy"
                               type="text" />
                    </label>

                    <label className="shippingAndPayment__label label-60">
                        <input className={formik.errors.street ? "shippingAndPayment__input shippingAndPayment--error" : "shippingAndPayment__input"}
                               name="street"
                               value={formik.values.street}
                               onChange={formik.handleChange}
                               placeholder="Ulica"
                               type="text" />
                    </label>
                    <label className="shippingAndPayment__label label-20">
                        <input className={formik.errors.building ? "shippingAndPayment__input shippingAndPayment--error" : "shippingAndPayment__input"}
                               name="building"
                               value={formik.values.building}
                               onChange={formik.handleChange}
                               placeholder="Numer domu"
                               type="text" />
                    </label>
                    <label className="shippingAndPayment__label label-20">
                        <input className="shippingAndPayment__input"
                               name="flat"
                               value={formik.values.flat}
                               onChange={formik.handleChange}
                               placeholder="Numer mieszkania"
                               type="text" />
                    </label>
                </div>
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
                    <button className="ribbonBtn" onClick={(e) => { addRibbon(e) }}>
                        <span className={ribbon ? "ribbon" : "d-none"}></span>
                    </button>
                    Wstążka z dedykacją (10 PLN)
                </label>

                <section className={ribbon ? "ribbonDedication" : "o-none"}>
                    {cart.map((item, i) => {
                        let arr = [];
                        for(let i=0; i<item.quantity; i++) {
                            arr.push(0);
                        }
                        // setRibbons(ribs);
                        return arr.map((itemInner, index) => {
                            k++;
                            return <label className="ribbonLabel" key={index}>
                                <input className="shippingAndPayment__input"
                                       id={"in" + k + "-" + i}
                                       name="ribbon"
                                       type="text"
                                       onChange={(e) => { changeRibbon(e) }}
                                       placeholder={"Dedykacja na wstążce do pudełka: " + cartNames[i] + "-" + item.size + "-" + item.option} />
                                <button className="ribbonBtn" id={"id" + k + "-" + i} onClick={(e) => { changeRibbon(e) }}>
                                    <span id={"sp" + k + "-" + i} className={ribbons[k]?.ribbon === true ? "ribbon" : "d-none"} onClick={() => { console.log("click!"); }}></span>
                                </button>
                            </label>
                        })
                    })}
                </section>
            </section>
        </main>

        <section className="cart__summary cart__summary--shippingAndPayment">
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
    </form>
}

export default ShippingAndPayment;
