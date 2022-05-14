import React, {useContext, useEffect, useState} from 'react'
import img from '../static/img/img.webp'
import arrow from '../static/img/arrow.svg'
import ReactSiema from 'react-siema'
import {LangContext} from "../App";
import axios from "axios";
import settings from "../admin/helpers/settings";

const Landing = () => {
    const { content, langIndex } = useContext(LangContext);
    const [dataPl, setDataPl] = useState({});
    const [dataEn, setDataEn] = useState({});
    const [data, setData] = useState({});

    let slider, sliderMobile;

    useEffect(() => {
        axios.get(`${settings.API_URL}/slider/get`)
            .then((res) => {
                const r = res?.data?.result;
                console.log(r);
                if(r) {
                    setDataPl(r[r.findIndex((item) => (item.language === 'pl'))]);
                    setDataEn(r[r.findIndex((item) => (item.language === 'en'))]);
                }
            });
    }, []);

    useEffect(() => {
        if(langIndex === 0) {
            setData(dataPl);
        }
        else {
            setData(dataEn);
        }
    }, [langIndex, dataPl, dataEn]);

    const prevSlide = () => {
        slider.prev();
    }

    const nextSlide = () => {
        slider.next();
    }

    return <main className="landing">
        <div className="sliderMobile d-mobile">
            <ReactSiema loop={true}
                        duration={500}
                        easing="ease-in-out"
                        ref={siema => sliderMobile = siema}
                        perPage={1}>
                <a href={data.slide1link}>
                    <img className="img" src={`${settings.API_URL}/image?url=/media/${dataPl.mobile1}`} alt="img" />
                </a>
                <a href={data.slide2link}>
                    <img className="img" src={`${settings.API_URL}/image?url=/media/${dataPl.mobile2}`} alt="img" />
                </a>
                <a href={data.slide3link}>
                    <img className="img" src={`${settings.API_URL}/image?url=/media/${dataPl.mobile3}`} alt="img" />
                </a>
            </ReactSiema>
            <div className="sliderMobile__dots">
                <button className="dot" onClick={() => { sliderMobile.goTo(0); }}>

                </button>
                <button className="dot" onClick={() => { sliderMobile.goTo(1); }}>

                </button>
                <button className="dot" onClick={() => { sliderMobile.goTo(2); }}>

                </button>
            </div>
        </div>

        <div className="slider d-desktop">
            <button className="sliderArrow sliderArrow--prev" onClick={() => { prevSlide(); }}>
                <img className="btn__img" src={arrow} alt="poprzedni" />
            </button>
            <button className="sliderArrow sliderArrow--next" onClick={() => { nextSlide(); }}>
                <img className="btn__img" src={arrow} alt="nastepny" />
            </button>
            <ReactSiema loop={true}
                        duration={500}
                        easing="ease-in-out"
                        draggable={false}
                        ref={siema => slider = siema}
                        perPage={1}>
                <div className="slider__item">
                    <img className="slider__item__img" src={`${settings.API_URL}/image?url=/media/${dataPl.slide1image}`} alt="img" />
                    <div className="slider__item__content">
                        <h3 className="slider__item__header">
                            {data.slide1header}
                        </h3>
                        <h4 className="slider__item__subheader">
                            {data.slide1text}
                        </h4>
                        <a className="slider__item__btn" href={data.slide1link}>
                            {data.slide1btn}
                        </a>
                    </div>
                </div>
                <div className="slider__item">
                    <img className="slider__item__img" src={`${settings.API_URL}/image?url=/media/${dataPl.slide2image}`} alt="img" />
                    <div className="slider__item__content">
                        <h3 className="slider__item__header">
                            {data.slide2header}
                        </h3>
                        <h4 className="slider__item__subheader">
                            {data.slide2text}
                        </h4>
                        <a className="slider__item__btn" href={data.slide2link}>
                            {data.slide2btn}
                        </a>
                    </div>
                </div>
                <div className="slider__item">
                    <img className="slider__item__img" src={`${settings.API_URL}/image?url=/media/${dataPl.slide3image}`} alt="img" />
                    <div className="slider__item__content">
                        <h3 className="slider__item__header">
                            {data.slide3header}
                        </h3>
                        <h4 className="slider__item__subheader">
                            {data.slide3text}
                        </h4>
                        <a className="slider__item__btn" href={data.slide3link}>
                            {data.slide3btn}
                        </a>
                    </div>
                </div>
            </ReactSiema>
        </div>
        <div className="sliderBottom d-desktop">
            <a className="sliderBottom__item" href={data.slidebottom1link}>
                <figure className="sliderBottom__item__imgWrapper">
                    <img className="sliderBottom__item__img" src={`${settings.API_URL}/image?url=/media/${dataPl.slidebottom1image}`} alt="img" />
                </figure>
                <div className="sliderBottom__item__content">
                    <h4 className="sliderBottom__item__content__header">
                        {data.slidebottom1header}
                    </h4>
                    <p className="sliderBottom__item__content__text">
                        {data.slidebottom1text}
                    </p>
                </div>
            </a>
            <a className="sliderBottom__item" href={data.slidebottom2link}>
                <figure className="sliderBottom__item__imgWrapper">
                    <img className="sliderBottom__item__img" src={`${settings.API_URL}/image?url=/media/${dataPl.slidebottom2image}`} alt="img" />
                </figure>
                <div className="sliderBottom__item__content">
                    <h4 className="sliderBottom__item__content__header">
                        {data.slidebottom2header}
                    </h4>
                    <p className="sliderBottom__item__content__text">
                        {data.slidebottom2text}
                    </p>
                </div>
            </a>
            <a className="sliderBottom__item" href={data.slidebottom3link}>
                <figure className="sliderBottom__item__imgWrapper">
                    <img className="sliderBottom__item__img" src={`${settings.API_URL}/image?url=/media/${dataPl.slidebottom3image}`} alt="img" />
                </figure>
                <div className="sliderBottom__item__content">
                    <h4 className="sliderBottom__item__content__header">
                        {data.slidebottom3header}
                    </h4>
                    <p className="sliderBottom__item__content__text">
                        {data.slidebottom3text}
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
