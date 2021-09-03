import React, { useEffect, useState } from 'react'

import logo from '../static/img/brunch-box-logo.png'
import {getPagesContent} from "../helpers/pagesFunctions";

const ContactContent = () => {
    const [contact, setContact] = useState("");
    const [contactSections, setContactSections] = useState("");

    useEffect(() => {
        getPagesContent()
            .then(res => {
                if(res.data.result) {
                    const contactText = res.data.result[0].contact;
                    setContactSections(contactText.split("---"));
                }
            })
    }, []);

    return <main className="offerContent offerContent--contact">
        <section className="offerContent__header">
            <img className="offerContent__logo" src={logo} alt="logo" />
        </section>
        <main className="contactContent">
            <section className="contactContent__section" data-aos="fade-left">
                {contactSections ? contactSections.map((item, index) => (
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
