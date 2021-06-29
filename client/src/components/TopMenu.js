import React, { useRef, useState, useEffect } from 'react'
import logoImg from '../static/img/brunch-box-logo.png'
import poland from '../static/img/poland.png'
import uk from '../static/img/united-kingdom.png'
import hamburgerMenu from '../static/img/hamburger.png'
import closeImg from '../static/img/close.png'
import cart from '../static/img/cartIcon.png'

const TopMenu = () => {
    const mobileMenu = useRef(null);
    const topBar = useRef(null);
    const topBarChild1 = useRef(null);
    const topBarChild2 = useRef(null);
    const mobileMenuCloseBtn = useRef(null);
    const mobileMenuLogo = useRef(null);
    const mobileMenuList = useRef(null);

    useEffect(() => {
        let lastScrollTop = 0;

        window.addEventListener("scroll", function(){ // or window.addEventListener("scroll"....
            let st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
            if((topBar)&&(topBarChild1)&&(topBarChild2)) {
                if (st > lastScrollTop) {
                    // scroll down
                    if(window.pageYOffset > 100) {
                        topBarChild1.current.style.opacity = "0";
                        topBarChild2.current.style.opacity = "0";
                        setTimeout(() => {
                            topBar.current.style.transform = "scaleY(0)";
                        }, 200);
                    }
                } else {
                    // scroll up
                    topBar.current.style.transform = "scaleY(1)";
                    setTimeout(() => {
                        topBarChild1.current.style.opacity = "1";
                        topBarChild2.current.style.opacity = "1";
                    }, 200);
                }
                lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
            }
        }, false);
    },[]);

    const openMobileMenu = () => {
        mobileMenu.current.style.transform = "scaleX(1)";
        setTimeout(() => {
            mobileMenuCloseBtn.current.style.opacity = "1";
        }, 200);
        setTimeout(() => {
            mobileMenuLogo.current.style.opacity = "1";
        }, 400);
        setTimeout(() => {
            mobileMenuList.current.style.opacity = "1";
        }, 600);
    }

    const closeMobileMenu = () => {
        mobileMenuCloseBtn.current.style.opacity = "0";
        setTimeout(() => {
            mobileMenuLogo.current.style.opacity = "0";
        }, 200);
        setTimeout(() => {
            mobileMenuList.current.style.opacity = "0";
        }, 400);
        setTimeout(() => {
            mobileMenu.current.style.transform = "scaleX(0)";
        }, 600);
    }

    return <header className="topMenu" ref={topBar}>
        <a className="topMenu__homepage" href="/" ref={topBarChild1}>
            <img className="topMenu__logo" src={logoImg} alt="brunch-box-logo" />
        </a>

        {/* DESKTOP */}
        <menu className="topMenu__menu d-desktop" ref={topBarChild2}>
            <ul className="topMenu__list">
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="/">
                        Strona główna
                    </a>
                </li>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="#">
                        O nas
                    </a>
                </li>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="/oferta">
                        Oferta
                    </a>
                </li>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="#">
                        Kontakt
                    </a>
                </li>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="/koszyk">
                        <img className="topMenu__list__item__img" src={cart} alt="koszyk" />
                        <span className="cartCounter">
                            { JSON.parse(localStorage.getItem('sec-cart'))?.length || 0 }
                        </span>
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

        {/* MOBILE */}
        <a className="topMenu__list__item__link d-mobile" href="/koszyk">
            <img className="topMenu__list__item__img" src={cart} alt="koszyk" />
            <span className="cartCounter">
                            { JSON.parse(localStorage.getItem('sec-cart'))?.length || 0 }
                        </span>
        </a>
        <button className="button--hamburger d-mobile" onClick={() => openMobileMenu()}>
            <img className="hamburgerBtn__img" src={hamburgerMenu} alt="menu" />
        </button>

        <menu className="mobileMenu d-mobile" ref={mobileMenu}>
            <button className="mobileMenu__closeBtn" onClick={() => closeMobileMenu()} ref={mobileMenuCloseBtn}>
                <img className="mobileMenu__closeImg" src={closeImg} alt="wyjdz" />
            </button>

            <img className="mobileMenu__logo" src={logoImg} alt="brunch-box-logo" ref={mobileMenuLogo} />

            <ul className="mobileMenu__list" ref={mobileMenuList}>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="/">
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
                        Oferta
                    </a>
                </li>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="#">
                        Kontakt
                    </a>
                </li>
            </ul>
        </menu>
    </header>
}

export default TopMenu;
