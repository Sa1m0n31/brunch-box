import React from 'react'
import cart from '../static/img/cartIcon.png'

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
    </footer>
}

export default Footer;
