import React from 'react'

import contact from '../static/img/contact.jpg'

const ContactContent = () => {
    return <main className="offerContent">
        <h1 className="offerContent__header">
            Kontakt
        </h1>
        <main className="contactContent">
            <section className="contactContent__section" data-aos="fade-right">
                <img className="contactContent__img" src={contact} alt="kontakt" />
            </section>

            <section className="contactContent__section" data-aos="fade-left">
                <section className="contactContent__frame">
                    <h3 className="contactContent__frame__header">
                        Infolinia
                    </h3>
                    <p className="contactContent__frame__text">
                        Telefoniczne biuro obsługi czynne jest:<br/>
                        od poniedziałku do soboty w godzinach <b>12:00-21:00</b><br/>
                        w niedziele w godzinach <b>12:00-20:00</b>
                    </p>
                </section>

                <section className="contactContent__frame">
                    <h3 className="contactContent__frame__header">
                        Adres do korespondencji
                    </h3>
                    <p className="contactContent__frame__text">
                        BRUNCHBOX<br/>
                        ul. Xxx<br/>
                        Xx-xxx Warszawa
                    </p>
                </section>

                <section className="contactContent__frame">
                    <h3 className="contactContent__frame__header">
                        Telefon
                    </h3>
                    <p className="contactContent__frame__text">
                        <a className="link--animated" href="tel:+48575868872">
                            575 868 872
                        </a>
                    </p>
                </section>

                <section className="contactContent__frame">
                    <h3 className="contactContent__frame__header">
                        E-mail
                    </h3>
                    <p className="contactContent__frame__text">
                        <a className="link--animated" href="mailto:kontakt@brunchbox.pl">
                            kontakt@brunchbox.pl
                        </a>
                    </p>
                </section>

                <section className="contactContent__frame">
                    <h3 className="contactContent__frame__header">
                        Dane spółki
                    </h3>
                    <p className="contactContent__frame__text">
                        BRUNCHBOX Paweł Gwoździej<br/>
                        ul. Xxx<br/>
                        Xx-xxx Warszawa<br/>
                        NIP: 1133033364<br/>
                        REGON: 388964591
                    </p>
                </section>

                <section className="contactContent__frame">
                    <h3 className="contactContent__frame__header">
                        Numer konta bankowego do płatności
                    </h3>
                    <p className="contactContent__frame__text">
                        39 1140 2004 0000 3702 8124 4998
                    </p>
                </section>


            </section>
        </main>
    </main>
}

export default ContactContent;
