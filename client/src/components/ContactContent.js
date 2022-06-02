import React, {useContext, useEffect, useState} from 'react'

import logo from '../static/img/brunch-box-logo.png'
import {getPagesContent} from "../helpers/pagesFunctions";
import {LangContext} from "../App";

const ContactContent = () => {
    const { langIndex } = useContext(LangContext);

    const [contactSections, setContactSections] = useState("");
    const [contactSectionsEn, setContactSectionsEn] = useState("");

    useEffect(() => {
        getPagesContent()
            .then(res => {
                if(res.data.result) {
                    const contactText = res.data.result[0].contact;
                    const contactTextEn = res.data.result[0].contact_en;
                    setContactSections(contactText.split("---"));
                    setContactSectionsEn(contactTextEn.split("---"));
                }
            })
    }, []);

    return <main className="offerContent offerContent--contact">
        <section className="offerContent__header">
            <img className="offerContent__logo" src={logo} alt="logo" />
        </section>
        <main className="contactContent">
            <section className="contactContent__section">
                {langIndex === 0 && contactSections ? contactSections.map((item, index) => (
                    <section className="contactContent__frame"
                        key={index}
                             dangerouslySetInnerHTML={{__html: item}}
                    >

                    </section>
                )) : ""}

                {langIndex === 1 && contactSectionsEn ? contactSectionsEn.map((item, index) => (
                    <section className="contactContent__frame"
                             key={index}
                             dangerouslySetInnerHTML={{__html: item}}
                    >

                    </section>
                )) : ""}
            </section>
        </main>
    </main>
}

export default ContactContent;
