import React, { useState } from 'react'
import axios from 'axios'
import * as Yup from 'yup'
import { useFormik } from 'formik'

const ShippingAndPayment = () => {
    const [msg, setMsg] = useState("");
    const [ribbon, setRibbon] = useState(false);

    const validationSchema = Yup.object({
        firstName: Yup.string()
            .required(),
        lastName: Yup.string()
            .required(),
        email: Yup.string()
            .required("Wpisz swój adres email")
            .email("Niepoprawny adres email"),
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
            flat: "",
            ribbon: "",
            comment: ""
        },
        validationSchema,
        onSubmit: values => {
            console.log(values);
        }
    });

    const goPay = () => {
        formik.handleSubmit();

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
                    comment: formik.values.comment,
                    ribbon: formik.values.ribbon
                })
                    .then(res => {
                        const orderId = res.data.result;

                        /* Add sells */
                        const cart = JSON.parse(localStorage.getItem('sec-cart'));
                        cart.forEach(item => {
                            console.log(item);
                            axios.post("http://localhost:5000/order/add-sell", {
                                orderId,
                                productId: item.id,
                                option: item.option,
                                quantity: item.quantity,
                                size: item.size
                            })
                                .then(res => {
                                    let paymentUri = "https://sandbox.przelewy24.pl/trnRequest/";

                                    axios.post("http://localhost:5000/payment/payment", {
                                        amount: 100,
                                        email: "test@gmail.com"
                                    })
                                        .then(res => {
                                            const token = res.data.result;
                                            window.location.href = `${paymentUri}${token}`;
                                        });
                                });
                        });
                    })
            });
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
                        <input className="shippingAndPayment__input"
                               name="firstName"
                               value={formik.values.firstName}
                               onChange={formik.handleChange}
                               placeholder="Twoje imię"
                               type="text" />
                    </label>
                    <label className="shippingAndPayment__label label-100">
                        <input className="shippingAndPayment__input"
                               name="lastName"
                               value={formik.values.lastName}
                               onChange={formik.handleChange}
                               placeholder="Twoje nazwisko"
                               type="text" />
                    </label>

                    <label className="shippingAndPayment__label label-50">
                        <input className="shippingAndPayment__input"
                               name="email"
                               value={formik.values.email}
                               onChange={formik.handleChange}
                               placeholder="Adres email"
                               type="text" />
                    </label>
                    <label className="shippingAndPayment__label label-50">
                        <input className="shippingAndPayment__input"
                               name="phoneNumber"
                               value={formik.values.phoneNumber}
                               onChange={formik.handleChange}
                               placeholder="Numer telefonu"
                               type="text" />
                    </label>

                    <label className="shippingAndPayment__label label-70">
                        <input className="shippingAndPayment__input"
                               name="city"
                               value={formik.values.city}
                               onChange={formik.handleChange}
                               placeholder="Miejscowość"
                               type="text" />
                    </label>
                    <label className="shippingAndPayment__label label-30">
                        <input className="shippingAndPayment__input"
                               name="postalCode"
                               value={formik.values.postalCode}
                               onChange={formik.handleChange}
                               placeholder="Kod pocztowy"
                               type="text" />
                    </label>

                    <label className="shippingAndPayment__label label-60">
                        <input className="shippingAndPayment__input"
                               name="street"
                               value={formik.values.street}
                               onChange={formik.handleChange}
                               placeholder="Ulica"
                               type="text" />
                    </label>
                    <label className="shippingAndPayment__label label-20">
                        <input className="shippingAndPayment__input"
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
                    <button className="ribbonBtn" onClick={() => { setRibbon(!ribbon) }}>
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

        <section className="cart__summary">
            <header className="cart__summary__header">
                <h3 className="cart__summary__header__label">
                    Łącznie do zapłaty:
                </h3>
                <h4 className="cart__summary__header__value">
                    123 PLN
                </h4>
            </header>
            <button className="cart__summary__button button__link--small" onClick={() => { goPay() }} type="submit">
                    Przechodzę do płatności
            </button>
        </section>
    </form>
}

export default ShippingAndPayment;
