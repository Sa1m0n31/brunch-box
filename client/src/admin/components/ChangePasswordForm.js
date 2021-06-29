import React, { useState, useEffect } from 'react'

import * as Yup from 'yup'
import { useFormik } from "formik";
import {changePassword} from "../helpers/settingsFunctions";

const ChangePasswordForm = () => {
    const [formMsg, setFormMsg] = useState("");

    const validationSchema = Yup.object({
       oldPassword: Yup.string()
           .required("Wpisz stare hasło"),
        newPassword1: Yup.string()
            .required("Wpisz nowe hasło"),
        newPassword2: Yup.string()
            .required("Powtórz nowe hasło")
            .oneOf([Yup.ref('newPassword1'), null], "Podane hasła nie są identyczne")
    });

    const formik = useFormik({
       initialValues: {
           oldPassword: "",
           newPassword1: "",
           newPassword2: ""
       },
        validationSchema,
        onSubmit: values => {
           const newValues = {
               username: localStorage.getItem('sec-username'),
               oldPassword: values.oldPassword,
               newPassword: values.newPassword1
           }
           changePassword(newValues)
               .then(res => {
                   const result = res.data.result;
                    if(result === 1) {
                        setFormMsg("Hasło zostało zmienione");
                        formik.resetForm();
                    }
                    else if(result === 0) {
                        setFormMsg("Niepoprawne hasło");
                    }
                    else {
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
                       name="oldPassword"
                       type="password"
                       value={formik.values.oldPassword}
                       onChange={formik.handleChange}
                       placeholder="Stare hasło" />
                <span className="formError--panel">
                {formik.errors.oldPassword ? formik.errors.oldPassword : ""}
            </span>
            </label>
            <label className="addProduct__label--frame addProduct__label--frame--margin">
                <input className="addProduct__input"
                       name="newPassword1"
                       type="password"
                       value={formik.values.newPassword1}
                       onChange={formik.handleChange}
                       placeholder="Nowe hasło" />
                <span className="formError--panel">
                {formik.errors.newPassword1 ? formik.errors.newPassword1 : ""}
            </span>
            </label>
            <label className="addProduct__label--frame addProduct__label--frame--margin">
                <input className="addProduct__input"
                       name="newPassword2"
                       type="password"
                       value={formik.values.newPassword2}
                       onChange={formik.handleChange}
                       placeholder="Potwórz nowe hasło" />
                <span className="formError--panel">
                {formik.errors.newPassword2 ? formik.errors.newPassword2 : ""}
            </span>
            </label>
        </> : <h3 className="formMsg">
            {formMsg}
        </h3>}

        <button className="addProduct__btn marginTop10" type="submit">
            Zmień hasło
        </button>
    </form>
}

export default ChangePasswordForm;
