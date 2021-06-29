import React, { useState, useEffect } from 'react'

import * as Yup from 'yup'
import { useFormik } from "formik";
import {addAdmin} from "../helpers/settingsFunctions";

const AddAdminForm = () => {
    const [formMsg, setFormMsg] = useState("");

    const validationSchema = Yup.object({
        username: Yup.string()
            .required("Pole login jest wymagane")
            .min(3, "Login musi zawierać co najmniej trzy znaki"),
        password1: Yup.string()
            .required("Wpisz hasło"),
        password2: Yup.string()
            .required("Powtórz hasło")
            .oneOf([Yup.ref('password1'), null], "Podane hasła nie są identyczne"),
        email: Yup.string()
            .required("Wpisz adres email")
            .email("Niepoprawny adres email")
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password1: "",
            password2: "",
            email: ""
        },
        validationSchema,
        onSubmit: values => {
            addAdmin(values)
                .then(res => {
                    const result = res.data.result;
                    if(result === 1) {
                        /* User added */
                        setFormMsg("Nowe konto administratora zostało dodane");
                        formik.resetForm();
                    }
                    else if(result === 0) {
                        /* User already exists */
                        setFormMsg("Nazwa użytkownika lub adres email jest już w użyciu");
                    }
                    else {
                        /* Database error */
                        setFormMsg("Coś poszło nie tak... Prosimy spróbować później");
                    }
                });
        }
    });

    useEffect(() => {
        if(formMsg !== "") {
            setTimeout(() => {
                setFormMsg("");
            }, 3000);
        }
    }, [formMsg]);

    return <form className="panelContent__frame__form settingsForm" onSubmit={formik.handleSubmit}>
        {formMsg === "" ? <>
            <label className="addProduct__label--frame addProduct__label--frame--margin">
                <input className="addProduct__input"
                       name="username"
                       type="text"
                       value={formik.values.username}
                       onChange={formik.handleChange}
                       placeholder="Login" />
                <span className="formError--panel">
                 {formik.errors.username ? formik.errors.username : ""}
             </span>
            </label>
            <label className="addProduct__label--frame addProduct__label--frame--margin">
                <input className="addProduct__input"
                       name="password1"
                       type="password"
                       value={formik.values.password1}
                       onChange={formik.handleChange}
                       placeholder="Hasło" />
                <span className="formError--panel">
                 {formik.errors.password1 ? formik.errors.password1 : ""}
             </span>
            </label>
            <label className="addProduct__label--frame addProduct__label--frame--margin">
                <input className="addProduct__input"
                       name="password2"
                       type="password"
                       value={formik.values.password2}
                       onChange={formik.handleChange}
                       placeholder="Potwórz hasło" />
                <span className="formError--panel">
                 {formik.errors.password2 ? formik.errors.password2 : ""}
             </span>
            </label>
            <label className="addProduct__label--frame addProduct__label--frame--margin">
                <input className="addProduct__input"
                       name="email"
                       type="email"
                       value={formik.values.email}
                       onChange={formik.handleChange}
                       placeholder="Adres e-mail" />
                <span className="formError--panel">
                 {formik.errors.email ? formik.errors.email : ""}
             </span>
            </label>
        </> : <h3 className="formMsg">
            {formMsg}
        </h3> }

        <button className="addProduct__btn marginTop10" type="submit">
            Dodaj nowego administratora
        </button>
    </form>
}

export default AddAdminForm;
