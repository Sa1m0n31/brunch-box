import React, {useContext} from 'react'
import {LangContext} from "../App";

const Footer = () => {
    const { content } = useContext(LangContext);

    return <footer className="footer">
        <section className="footer__headerWrapper">
                <h5 className="footer__header__link italic">
                    &copy; { new Date().getFullYear() } BrunchBox. {content.footerCopyright}
                </h5>
        </section>

        <menu className="footer__menu footer__menu--footer">
            <ul className="footer__list">
                <li className="footer__menu__item">
                    <a className="footer__menu__item__link" href="/polityka-prywatnosci">
                        {content.footerMenu[0]}
                    </a>
                </li>
                <li className="footer__menu__item">
                    <a className="footer__menu__item__link" href="/regulamin">
                        {content.footerMenu[1]}
                    </a>
                </li>
                <li className="footer__menu__item">
                    <a className="footer__menu__item__link" href="/kontakt">
                        {content.footerMenu[2]}
                    </a>
                </li>
            </ul>
        </menu>
    </footer>
}

export default Footer;
