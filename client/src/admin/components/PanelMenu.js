import React, { useEffect, useState } from 'react'
import axios from "axios";
import box from '../static/img/box.svg'
import checkboxSquare from '../static/img/checkbox_square.svg'
import creditCart from '../static/img/credit_card.svg'
import home from '../static/img/home_alt_fill.svg'
import layers from '../static/img/layers_alt.svg'
import list from '../static/img/list_ul.svg'
import settingsImg from '../static/img/settings_filled.svg'
import powerOff from '../static/img/power-off.png'
import addImg from '../static/img/add.png'

import settings from "../helpers/settings";
import auth from "../helpers/auth";

const PanelMenu = ({active, submenu}) => {
    const [render, setRender] = useState(false);

    useEffect(() => {
        auth(localStorage.getItem('sec-sessionKey'))
            .then((res) => {
                if(res.data.result === 1) {
                    setRender(true);
                }
                else {
                    window.location = "/";
                }
            })
    }, []);

    const logout = () => {
        axios.post(`${settings.API_URL}/auth/logout`, {
            sessionKey: localStorage.getItem('sec-sessionKey')
        })
            .then(res => {
                if(res.data.result === 1) {
                    window.location = "/";
                    localStorage.removeItem('sec-sessionKey');
                    localStorage.removeItem('sec-username');
                }
            })
    }

    return render ? <menu className="panelMenu">
            <section className="panelMenu__top">
                <figure className="panelMenu__top__logoWrapper">
                    <img className="panelMenu__top__logo" src={settings.logo} alt="logo" />
                </figure>
                <header className="panelMenu__top__info">
                    <h3 className="panelMenu__top__header">
                        Zalogowany jako:
                    </h3>
                    <h4 className="panelMenu__top__subheader">
                        {localStorage.getItem('sec-username')}
                    </h4>
                </header>
            </section>

            <nav className="panelMenu__menu">
                <ul className="panelMenu__list">
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 0 ? "menuItem--active" : ""} href="/panel">
                            <img className="panelMenu__list__item__img" src={home} alt="home" />
                            Home
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 1 && !submenu ? "menuItem--active" : ""} href="/panel/produkty">
                            <img className="panelMenu__list__item__img" src={layers} alt="produkty" />
                            Produkty
                        </a>
                        { active === 1 ? <a className="panelMenu__list__subitem" id={submenu ? "menuItem--active" : ""} href="/panel/dodaj-produkt">
                            <img className="panelMenu__list__subitem__img" src={addImg} alt="dodaj-produkt" />
                            Dodaj produkt
                        </a> : "" }
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 2 ? "menuItem--active" : ""} href="/panel/zamowienia">
                            <img className="panelMenu__list__item__img" src={checkboxSquare} alt="zamowienia" />
                            Zamówienia
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 3 ? "menuItem--active" : ""} href="/panel/kategorie">
                            <img className="panelMenu__list__item__img" src={list} alt="kategorie" />
                            Kategorie
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 4 ? "menuItem--active" : ""} href="/panel/wysylka">
                            <img className="panelMenu__list__item__img" src={box} alt="wysylka" />
                            Wysyłka
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 5 ? "menuItem--active" : ""} href="/panel/platnosci">
                            <img className="panelMenu__list__item__img" src={creditCart} alt="platnosci" />
                            Płatności
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <a className="panelMenu__list__item__link" id={active === 6 ? "menuItem--active" : ""} href="/panel/ustawienia">
                            <img className="panelMenu__list__item__img" src={settingsImg} alt="ustawienia" />
                            Ustawienia
                        </a>
                    </li>
                    <li className="panelMenu__list__item">
                        <button className="panelMenu__list__item__link" onClick={() => logout()}>
                            <img className="panelMenu__list__item__img" src={powerOff} alt="wyloguj-sie" />
                            Wyloguj się
                        </button>
                    </li>
                </ul>
            </nav>
        </menu> : ""
}

export default PanelMenu;
