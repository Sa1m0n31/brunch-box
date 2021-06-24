import React from 'react'
import productImg from '../static/img/product-image.png'

const HomePageSection = () => {
    return <section className="homePageSection">
        <span id="zestawy"></span>
        <h2 className="homePageSection__header">
            Zestawy podstawowe
        </h2>
        <div className="homePageSection__menu">
            <div className="homePageSection__item">
                <img className="homePageSection__img" src={productImg} alt="produkt" />
                <h3 className="homePageSection__item__header">
                    Oferta indywidualna
                </h3>
                <button className="button button--landing button--homePageSection">
                    <a className="button--landing__link button--homePageSection__link" href="/oferta-indywidualna">
                        Więcej informacji
                    </a>
                </button>
            </div>

            <div className="homePageSection__item">
                <img className="homePageSection__img" src={productImg} alt="produkt" />
                <h3 className="homePageSection__item__header">
                    Oferta dla grup
                </h3>
                <button className="button button--landing button--homePageSection">
                    <a className="button--landing__link button--homePageSection__link" href="/dla-grup">
                        Więcej informacji
                    </a>
                </button>
            </div>

            <div className="homePageSection__item">
                <img className="homePageSection__img" src={productImg} alt="produkt" />
                <h3 className="homePageSection__item__header">
                    Menu bankietowe
                </h3>
                <button className="button button--landing button--homePageSection">
                    <a className="button--landing__link button--homePageSection__link" href="/menu-bankietowe">
                        Więcej informacji
                    </a>
                </button>
            </div>
        </div>
    </section>
}

export default HomePageSection;
