import React from 'react'

const Footer = () => {
    return <footer className="footer">
        <section className="footer__headerWrapper">
                <h5 className="footer__header__link italic">
                    &copy; { new Date().getFullYear() } BrunchBox. Wszystkie prawa zastrzeżone
                </h5>
        </section>

        <menu className="footer__menu footer__menu--footer">
            <ul className="footer__list">
                <li className="footer__menu__item">
                    <a className="footer__menu__item__link" href="/polityka-prywatnosci">
                        Polityka prywatności
                    </a>
                </li>
                <li className="footer__menu__item">
                    <a className="footer__menu__item__link" href="/regulamin">
                        Regulamin
                    </a>
                </li>
                <li className="footer__menu__item">
                    <a className="footer__menu__item__link" href="/kontakt">
                        Kontakt
                    </a>
                </li>
            </ul>
        </menu>
    </footer>
}

export default Footer;
