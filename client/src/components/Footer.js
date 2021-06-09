import React from 'react'

const Footer = () => {
    return <footer className="footer">
        <h5 className="footer__header">
            &copy; { new Date().getFullYear() } BrunchBox.pl. Wszelkie prawa zastrzeżone.
        </h5>

        <menu className="footer__menu">
            <ul className="footer__list">
                <li className="footer__menu__item">
                    <a className="footer__menu__item__link" href="#">
                        Regulamin
                    </a>
                </li>
                <li className="footer__menu__item">
                    <a className="footer__menu__item__link" href="#">
                        Polityka prywatności
                    </a>
                </li>
                <li className="footer__menu__item">
                    <a className="footer__menu__item__link" href="#">
                        Kontakt
                    </a>
                </li>
            </ul>
        </menu>

        <h6 className="footer__header">
            Projekt i wykonanie <a className="footer__link" href="https://skylo.pl" rel="noreferrer">skylo.pl</a>
        </h6>
    </footer>
}

export default Footer;
