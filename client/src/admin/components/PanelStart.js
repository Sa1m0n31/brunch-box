import React from 'react'
import back from '../static/img/back.png'
import settings from "../helpers/settings";

import box from '../static/img/box.svg'
import checkboxSquare from '../static/img/checkbox_square.svg'
import creditCart from '../static/img/credit_card.svg'
import home from '../static/img/home_alt_fill.svg'
import layers from '../static/img/layers_alt.svg'
import list from '../static/img/list_ul.svg'
import settingsImg from '../static/img/settings_filled.svg'

const PanelStart = () => {
    return <main className="panelContent">
        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Start
            </h1>

            <a className="panelContent__header__back" href={settings.homepage}>
                Wróć na stronę główną
                <img className="panelContent__header__back__img" src={back} alt="wroc-na-strone-glowna" />
            </a>
        </header>
        <main className="panelContent__startContent">
            <a className="panelContent__start__item" href="/panel/produkty">
                <img className="panelContent__start__item__img" src={layers} alt="produkty" />
                <h3 className="panelContent__start__item__header">Produkty</h3>
            </a>

            <a className="panelContent__start__item" href="/panel/zamowienia">
                <img className="panelContent__start__item__img" src={checkboxSquare} alt="produkty" />
                <h3 className="panelContent__start__item__header">Zamówienia</h3>
            </a>

            <a className="panelContent__start__item" href="/panel/kategorie">
                <img className="panelContent__start__item__img" src={list} alt="produkty" />
                <h3 className="panelContent__start__item__header">Kategorie</h3>
            </a>

            <a className="panelContent__start__item" href="/panel/wysylka">
                <img className="panelContent__start__item__img" src={box} alt="produkty" />
                <h3 className="panelContent__start__item__header">Wysyłka</h3>
            </a>

            <a className="panelContent__start__item" href="/panel/platnosci">
                <img className="panelContent__start__item__img" src={creditCart} alt="produkty" />
                <h3 className="panelContent__start__item__header">Płatności</h3>
            </a>

            <a className="panelContent__start__item" href="/panel/ustawienia">
                <img className="panelContent__start__item__img" src={settingsImg} alt="produkty" />
                <h3 className="panelContent__start__item__header">Ustawienia</h3>
            </a>
        </main>
    </main>
}

export default PanelStart;
