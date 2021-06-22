import React, { useState } from 'react'

import * as Yup from 'yup'
import { useFormik } from 'formik'

const ShippingAndPayment = () => {
    const [msg, setMsg] = useState("");

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
            flat: ""
        },
        validationSchema,
        onSubmit: values => {

        }
    });

    return <main className="cartContent">
        <h1 className="cart__header">
            Wpisz swoje dane i dokończ zamówienie
        </h1>

        <main className="cart cart--flex">
            <section className="shippingAndPayment__section">
                <h2 className="shippingAndPayment__header">
                    Dane osobowe
                </h2>

                <form className="shippingAndPayment__form">
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
                </form>
            </section>

            <section className="shippingAndPayment__section">
                <h2 className="shippingAndPayment__header">
                    Dostawa i płatność
                </h2>

                <textarea
                    className="shippingAndPayment__textArea"
                    placeholder="Komentarz do zamówienia (opcjonalnie)" />
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
            <button className="cart__summary__button">
                <a className="button--landing__link button__link--smaller" href="/dostawa-i-platnosc">
                    Przechodzę do płatności
                </a>
            </button>
        </section>
    </main>
}

export default ShippingAndPayment;
