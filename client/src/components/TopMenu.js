import React from 'react'
import logoImg from '../static/img/brunch-box-logo.png'
import poland from '../static/img/poland.png'
import uk from '../static/img/united-kingdom.png'
import hamburgerMenu from '../static/img/hamburger.png'

const TopMenu = () => {
    return <header className="topMenu">
        <img className="topMenu__logo" src={logoImg} alt="brunch-box-logo" />

        <menu className="topMenu__menu d-desktop">
            <ul className="topMenu__list">
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="#">
                        Strona główna
                    </a>
                </li>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="#">
                        O nas
                    </a>
                </li>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="#">
                        Dostawa
                    </a>
                </li>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="#">
                        Płatności
                    </a>
                </li>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="#">
                        Kontakt
                    </a>
                </li>
            </ul>

            <div className="topMenu__languages">
                <button className="topMenu__languages__btn">
                    <img className="topMenu__languages__img" src={poland} alt="polski" />
                </button>
                <button className="topMenu__languages__btn">
                    <img className="topMenu__languages__img" src={uk} alt="angielski" />
                </button>
            </div>
        </menu>

        <button className="button--hamburger d-mobile">
            <img className="hamburgerBtn__img" src={hamburgerMenu} alt="menu" />
        </button>
    </header>
}

export default TopMenu;
