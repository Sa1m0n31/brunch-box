import React from 'react'
import fb from '../static/img/facebook.svg'
import insta from '../static/img/instagram.svg'


const Footer = () => {
    return <footer className="footer">
        <section className="footer__headerWrapper">
            <h5 className="footer__header footer__header--label">
                Telefon:
            </h5>
            <h5 className="footer__header">
                <a className="footer__header__link" href="tel:+48575868872">
                    575 868 872
                </a>
            </h5>
        </section>

        <menu className="footer__menu">
            <ul className="footer__list">
                <li className="footer__menu__item">
                    <a className="footer__menu__item__link" target="_blank" href="https://www.facebook.com/BrunchBox-103661678517716">
                        <img className="footer__menu__item__img" src={fb} alt="facebook" />
                    </a>
                </li>
                <li className="footer__menu__item">
                    <a className="footer__menu__item__link" target="_blank" href="https://www.instagram.com/brunchbox_pl/">
                        <img className="footer__menu__item__img" src={insta} alt="instagram" />
                    </a>
                </li>
            </ul>
        </menu>
    </footer>
}

export default Footer;
