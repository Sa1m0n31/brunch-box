import React, { useState, useEffect } from 'react'
import settings from "../helpers/settings";
import JoditEditor from "jodit-react";
import { useLocation } from "react-router";
import {getPagesContent} from "../../helpers/pagesFunctions";

const PanelOthersContent = () => {
    const [terms, setTerms] = useState("");
    const [termsEn, setTermsEn] = useState("");
    const [policy, setPolicy] = useState("");
    const [policyEn, setPolicyEn] = useState("");
    const [contact, setContact] = useState("");
    const [contactEn, setContactEn] = useState("");

    const [addMsg, setAddMsg] = useState("");

    const location = useLocation();

    useEffect(() => {
            /* Check if post added */
            const added = parseInt(new URLSearchParams(location.search).get("add"));
            if (added) {
                if (added === 1) {
                    setAddMsg("Treści zostały zaktualizowane");
                } else {
                    setAddMsg("Coś poszło nie tak... Prosimy spróbować później");
                }
            }

            /* Get pages content */
            getPagesContent()
                .then(res => {
                    if(res.data.result) {
                        const result = res.data.result[0];
                        setTerms(result.terms_of_service);
                        setTermsEn(result.terms_of_service_en);
                        setPolicy(result.privacy_policy);
                        setPolicyEn(result.privacy_policy_en);
                        setContact(result.contact);
                        setContactEn(result.contact_en);
                    }
                })
        }, []);

    useEffect(() => {
        if(addMsg !== "") {
            setTimeout(() => {
                setAddMsg("");
            }, 3000);
        }
    }, [addMsg]);


    return <main className="panelContent">
        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Pozostałe
            </h1>
        </header>
        <section className="panelContent__frame">
            <h1 className="panelContent__frame__header">
                Edycja podstron
            </h1>

            {addMsg === "" ? <form className="panelContent__frame__form panelContent--others"
                                   method="POST"
                                   action={`${settings.API_URL}/pages/update`}
            >
                <section className="panelContent__othersSection">
                    <label className="jodit--label">
                        <span>Regulamin</span>
                        <JoditEditor
                            name="termsOfService"
                            value={terms}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setTerms(newContent) }}
                        />
                    </label>

                    <label className="jodit--label">
                        <span>Regulamin (angielski)</span>
                        <JoditEditor
                            name="termsOfServiceEn"
                            value={termsEn}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setTermsEn(newContent) }}
                        />
                    </label>

                    <label className="jodit--label">
                        <span>Kontakt</span>
                        <JoditEditor
                            name="contact"
                            value={contact}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setContact(newContent) }}
                        />
                    </label>
                </section>

                <section className="panelContent__othersSection">
                    <label className="jodit--label">
                        <span>Polityka prywatności</span>
                        <JoditEditor
                            name="privacyPolicy"
                            value={policy}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setPolicy(newContent) }}
                        />
                    </label>

                    <label className="jodit--label">
                        <span>Polityka prywatności (angielski)</span>
                        <JoditEditor
                            name="privacyPolicyEn"
                            value={policyEn}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setPolicyEn(newContent) }}
                        />
                    </label>

                    <label className="jodit--label">
                        <span>Kontakt (angielski)</span>
                        <JoditEditor
                            name="contactEn"
                            value={contactEn}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setContactEn(newContent) }}
                        />
                    </label>
                </section>

                <button className="addProduct__btn marginTop10" type="submit">
                    Aktualizuj treści podstron
                </button>
            </form> : <h1 className="addedMsgWrapper">
                {addMsg}
            </h1> }
        </section>
    </main>
}

export default PanelOthersContent;
