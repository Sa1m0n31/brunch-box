import React, { useEffect, useState } from 'react'

import contactImg from '../static/img/contact.jpg'
import {getPagesContent} from "../helpers/pagesFunctions";

const ContactContent = () => {
    const [contact, setContact] = useState("");
    const [contactSections, setContactSections] = useState("");

    useEffect(() => {
        getPagesContent()
            .then(res => {
                if(res.data.result) {
                    const contactText = res.data.result[0].contact;
                    console.log(contactText.split("---"))
                    setContactSections(contactText.split("---"));
                }
            })
    }, []);

    return <main className="offerContent">
        <h1 className="offerContent__header">
            Kontakt
        </h1>
        <main className="contactContent">
            <section className="contactContent__section" data-aos="fade-right">
                <img className="contactContent__img" src={contactImg} alt="kontakt" />
            </section>

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
