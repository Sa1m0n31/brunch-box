import React, {useContext} from 'react'
import img from '../static/img/img.webp'
import arrow from '../static/img/arrow.svg'
import {LangContext} from "../App";

const Landing = () => {
    const { content } = useContext(LangContext);

    const prevSlide = () => {

    }

    const nextSlide = () => {

    }

    return <main className="landing">
        <div className="slider">
            <button className="sliderArrow sliderArrow--prev" onClick={() => { prevSlide(); }}>
                <img className="btn__img" src={arrow} alt="poprzedni" />
            </button>
            <button className="sliderArrow sliderArrow--next" onClick={() => { nextSlide(); }}>
                <img className="btn__img" src={arrow} alt="nastepny" />
            </button>
            <div className="slider__item">
                <img className="slider__item__img" src={img} alt="img" />
                <div className="slider__item__content">
                    <h3 className="slider__item__header">
                        Bake at home
                    </h3>
                    <h4 className="slider__item__subheader">
                        Lorem ipsum dolor sit amet
                    </h4>
                    <a className="slider__item__btn" href=".">
                        Napis na buttonie
                    </a>
                </div>
            </div>
            <div className="slider__item">
                <img className="slider__item__img" src={img} alt="img" />
                <div className="slider__item__content">
                    <h3 className="slider__item__header">
                        Bake at home
                    </h3>
                    <h4 className="slider__item__subheader">
                        Lorem ipsum dolor sit amet
                    </h4>
                    <a className="slider__item__btn" href=".">
                        Napis na buttonie
                    </a>
                </div>
            </div>
            <div className="slider__item">
                <img className="slider__item__img" src={img} alt="img" />
                <div className="slider__item__content">
                    <h3 className="slider__item__header">
                        Bake at home
                    </h3>
                    <h4 className="slider__item__subheader">
                        Lorem ipsum dolor sit amet
                    </h4>
                    <a className="slider__item__btn" href=".">
                        Napis na buttonie
                    </a>
                </div>
            </div>
        </div>
        <div className="sliderBottom">
            <a className="sliderBottom__item" href=".">
                <figure className="sliderBottom__item__imgWrapper">
                    <img className="sliderBottom__item__img" src={img} alt="img" />
                </figure>
                <div className="sliderBottom__item__content">
                    <h4 className="sliderBottom__item__content__header">
                        Nagłówek pierwszy
                    </h4>
                    <p className="sliderBottom__item__content__text">
                        Celebrate with a seasonal assortment of festive and delicious cakes. Order for local pick up in Boston and DC.
                    </p>
                </div>
            </a>
            <a className="sliderBottom__item" href=".">
                <figure className="sliderBottom__item__imgWrapper">
                    <img className="sliderBottom__item__img" src={img} alt="img" />
                </figure>
                <div className="sliderBottom__item__content">
                    <h4 className="sliderBottom__item__content__header">
                        Nagłówek pierwszy
                    </h4>
                    <p className="sliderBottom__item__content__text">
                        Celebrate with a seasonal assortment of festive and delicious cakes. Order for local pick up in Boston and DC.
                    </p>
                </div>
            </a>
            <a className="sliderBottom__item" href=".">
                <figure className="sliderBottom__item__imgWrapper">
                    <img className="sliderBottom__item__img" src={img} alt="img" />
                </figure>
                <div className="sliderBottom__item__content">
                    <h4 className="sliderBottom__item__content__header">
                        Nagłówek pierwszy
                    </h4>
                    <p className="sliderBottom__item__content__text">
                        Celebrate with a seasonal assortment of festive and delicious cakes. Order for local pick up in Boston and DC.
                    </p>
                </div>
            </a>
        </div>
        <div className="afterSlider">
            <h3 className="afterSlider__header">
                {content.homepageHeader}
            </h3>
            <a className="slider__item__btn slider__item__btn--afterSlider" href="/oferta">
                {content.homepageCallToAction}
            </a>
        </div>
    </main>
}

export default Landing;
