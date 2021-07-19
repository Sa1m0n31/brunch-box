import React, { useRef, useState, useEffect } from 'react'
import logoImg from '../static/img/brunch-box-logo.png'
import poland from '../static/img/poland.png'
import uk from '../static/img/united-kingdom.png'
import hamburgerMenu from '../static/img/hamburger.png'
import closeImg from '../static/img/close.png'
import cart from '../static/img/cartIcon.png'
import fb from "../static/img/facebook.svg";
import insta from "../static/img/instagram.svg";
import settings from "../helpers/settings";

const TopMenu = () => {
    const mobileMenu = useRef(null);
    const topBar = useRef(null);
    const topBarAside = useRef(null);
    const topBarChild1 = useRef(null);
    const topBarChild2 = useRef(null);
    const mobileMenuCloseBtn = useRef(null);
    const mobileMenuLogo = useRef(null);
    const mobileMenuList = useRef(null);
    const mobileMenuLanguages = useRef(null);

    const [count, setCount] = useState(0);

    useEffect(() => {
        let lastScrollTop = 0;

        /* Calculate number of products in cart */
        let normalCart = 0, banquetCart = 0;
        normalCart = JSON.parse(localStorage.getItem('sec-cart'));
        banquetCart = JSON.parse(localStorage.getItem('sec-cart-banquet'));

        if(normalCart) {
            normalCart = normalCart.length;
        }
        if(banquetCart) {
            banquetCart = banquetCart.flat().length;
        }
        setCount(normalCart + banquetCart);

        window.addEventListener("scroll", function(){ // or window.addEventListener("scroll"....
            let st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
            if((topBar)&&(topBarChild1)&&(topBarChild2)) {
                if (st > lastScrollTop) {
                    // scroll down
                    if(window.pageYOffset > 100) {
                        if(topBarChild1.current) topBarChild1.current.style.opacity = "0";
                        if(topBarChild2.current) topBarChild2.current.style.opacity = "0";
                        setTimeout(() => {
                            if(topBar.current) topBar.current.style.transform = "scaleY(0)";
                            if(topBarAside.current) topBarAside.current.style.transform = "scaleY(0)";
                        }, 200);
                    }
                } else {
                    // scroll up
                    if(topBar.current) topBar.current.style.transform = "scaleY(1)";
                    if(topBarAside.current) topBarAside.current.style.transform = "scaleY(1)";
                    setTimeout(() => {
                        if(topBarChild1.current) topBarChild1.current.style.opacity = "1";
                        if(topBarChild2.current) topBarChild2.current.style.opacity = "1";
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
            mobileMenuLanguages.current.style.opacity = "1";
        }, 600);
    }

    const closeMobileMenu = () => {
        mobileMenuCloseBtn.current.style.opacity = "0";
        setTimeout(() => {
            mobileMenuLogo.current.style.opacity = "0";
        }, 200);
        setTimeout(() => {
            mobileMenuList.current.style.opacity = "0";
            mobileMenuLanguages.current.style.opacity = "0";
        }, 400);
        setTimeout(() => {
            mobileMenu.current.style.transform = "scaleX(0)";
        }, 600);
    }

    return <>
        <aside className="topBar" ref={topBarAside}>
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

            <menu className="footer__menu footer__menu--topBar">
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
        </aside>
        <header className="topMenu" ref={topBar}>
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
                    <a className="topMenu__list__item__link" href="/o-nas">
                        O nas
                    </a>
                </li>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="/oferta">
                        Oferta
                    </a>
                </li>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="/blog">
                        Blog
                    </a>
                </li>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="/kontakt">
                        Kontakt
                    </a>
                </li>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="/koszyk">
                        <img className="topMenu__list__item__img" src={cart} alt="koszyk" />
                        <span className="cartCounter">
                            { count }
                        </span>
                    </a>
                </li>
            </ul>

            <div className="topMenu__languages">
                <a className="topMenu__languages__btn" href={settings.API_URL}>
                    <img className="topMenu__languages__img" src={poland} alt="polski" />
                </a>
                <a className="topMenu__languages__btn" href="http://en.brunchbox.skylo-test3.pl">
                    <img className="topMenu__languages__img" src={uk} alt="angielski" />
                </a>
            </div>
        </menu>

        {/* MOBILE */}
        <a className="topMenu__list__item__link d-mobile" href="/koszyk">
            <img className="topMenu__list__item__img" src={cart} alt="koszyk" />
            <span className="cartCounter">
                            { count }
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
                    <a className="topMenu__list__item__link" href="/o-nas">
                        O nas
                    </a>
                </li>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="/oferta">
                        Oferta
                    </a>
                </li>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="/blog">
                        Blog
                    </a>
                </li>
                <li className="topMenu__list__item">
                    <a className="topMenu__list__item__link" href="/kontakt">
                        Kontakt
                    </a>
                </li>
            </ul>

            <div className="topMenu__languages topMenu__languages--mobile" ref={mobileMenuLanguages}>
                <a className="topMenu__languages__btn" href={settings.API_URL}>
                    <img className="topMenu__languages__img" src={poland} alt="polski" />
                </a>
                <a className="topMenu__languages__btn" href="http://en.brunchbox.skylo-test3.pl">
                    <img className="topMenu__languages__img" src={uk} alt="angielski" />
                </a>
            </div>
        </menu>
    </header>
        </>
}

export default TopMenu;
