import React, {useContext} from 'react';
import {LangContext} from "../App";
import icon1 from '../static/img/visa.svg'
import icon2 from '../static/img/mastercard.svg'
import icon3 from '../static/img/blik.svg'
import icon4 from '../static/img/apple.svg'
import icon5 from '../static/img/google.svg'

const Footer = () => {
    const { content } = useContext(LangContext);

    return <footer className="footer">
        <section className="footer__headerWrapper">
                <h5 className="footer__header__link italic">
                    &copy; { new Date().getFullYear() } BrunchBox. {content.footerCopyright}
                </h5>
        </section>

        <div className="footer__paymentBanner">
            <img className="img" src={icon1} alt="baner" />
            <img className="img" src={icon2} alt="baner" />
            <img className="img" src={icon3} alt="baner" />
            <img className="img" src={icon4} alt="baner" />
            <img className="img" src={icon5} alt="baner" />
        </div>

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
