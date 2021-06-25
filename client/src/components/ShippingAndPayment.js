import React, { useState, useEffect } from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import { useFormik } from 'formik'

const ShippingAndPayment = () => {
    const [msg, setMsg] = useState("");
    const [amount, setAmount] = useState(parseInt(localStorage.getItem('sec-amount')));
    const [ribbon, setRibbon] = useState(false);
    const [formValidate, setFormValidate] = useState(false);

    useEffect(() => {
        if(!amount) window.location = "/";
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
                        city: formik.values.city,
                        street: formik.values.street,
                        building: formik.values.building,
                        flat: formik.values.flat,
                        postalCode: formik.values.postalCode,
                        user: insertedUserId,
                        comment: formik.values.comment,
                        ribbon: formik.values.ribbon
                    })
                        .then(res => {
                            const orderId = res.data.result;

                            /* Add sells */
                            const cart = JSON.parse(localStorage.getItem('sec-cart'));
                            cart.forEach(item => {
                                console.log(item);
                                axios.post("http://brunchbox.skylo-test3.pl/order/add-sell", {
                                    orderId,
                                    productId: item.id,
                                    option: item.option,
                                    quantity: item.quantity,
                                    size: item.size
                                })
                                    .then(res => {
                                        let paymentUri = "https://sandbox.przelewy24.pl/trnRequest/";

                                        axios.post("http://brunchbox.skylo-test3.pl/payment/payment", {
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
                                    });
                            });
                        })
                });
        }
    }, [formValidate]);

    const addRibbon = (e) => {
        e.preventDefault();
        if(ribbon) {
            setAmount(amount-10);
            setRibbon(false);
        }
        else {
            setAmount(amount+10);
            setRibbon(true);
        }
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

                <label className={ribbon ? "ribbonDedication" : "o-none"}>
                    <input className="shippingAndPayment__input"
                           name="ribbon"
                           type="text"
                           value={formik.values.ribbon}
                           onChange={formik.handleChange}
                           placeholder="Dedykacja na wstążce" />
                </label>
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
