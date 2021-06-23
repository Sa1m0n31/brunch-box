import React, { useState, useEffect } from 'react'
import settings from "../helpers/settings";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import auth from "../helpers/auth";

const LoginPage = () => {
    const [tried, setTried] = useState(false);
    const [render, setRender] = useState(false);

    useEffect(() => {
        auth(localStorage.getItem('sec-sessionKey'))
            .then(res => {
                if(res.data.result === 1) {
                    window.location = "/panel";
                }
                else {
                    setRender(true);
                }
            });
    }, []);

    const validationSchema = Yup.object({
        username: Yup.string()
            .required("Wpisz swój login"),
        password: Yup.string()
            .required("Wpisz swoje hasło")
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            axios.post(`${settings.API_URL}/auth/login-admin`, values)
                .then(res => {
                    if(res.data.result === 1) {
                        localStorage.setItem('sec-sessionKey', res.data.sessionKey);
                        localStorage.setItem('sec-username', res.data.username);
                        window.location = "/panel";
                    }
                    else {
                        setTried(true);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    })

    return <main className="loginPage">
        {render ? <form className="loginPage__form" onSubmit={formik.handleSubmit}>
            <label className="label">
                Nazwa użytkownika
                <input className="input input--adminLogin"
                       type="text"
                       name="username"
                       onFocus={() => setTried(false)}
                       onChange={formik.handleChange}
                       value={formik.username}
                />
            </label>
            <label className="label">
                Hasło
                <input className="input input--adminLogin"
                       type="password"
                       name="password"
                       onFocus={() => setTried(false)}
                       onChange={formik.handleChange}
                       value={formik.password}
                />
            </label>

            <button className="button button--loginForm">
                Zaloguj się
            </button>
        </form> : ""}
        {tried ? <h5 className="formError">
            Nieprawidłowa nazwa użytkownika lub hasło
        </h5> : ""}
    </main>
}

export default LoginPage;
