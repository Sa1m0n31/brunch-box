import React, { useEffect, useState } from 'react'
import example from '../static/img/o-pomysle.png'
import {getAllSections} from "../admin/helpers/aboutUsFunctions";
import settings from "../helpers/settings";

const HomePageSection = () => {
    const [sections, setSections] = useState([]);

    useEffect(() => {
        getAllSections()
            .then((res) => {
                setSections(res?.data?.result.filter((item) => {
                    return !item.content && !item.content_en;
                }));
            });
    }, []);

    return <section className="homePageSection">
        {sections?.map((item, index) => {
            return  <section className={index % 2 ? "homePageSection__item homePageSection__item--odd" : "homePageSection__item"}>
                <section className="homePageSection__item__content" data-aos={index % 2 ? "fade-right" : "fade-left"}>
                    <p className="homePageSection__text">
                        {item.header}
                    </p>

                    <button className="button button--landing">
                        <a className="button--landing__link" href="/oferta">
                            Zobacz dostępne zestawy
                        </a>
                    </button>
                </section>

                <figure className="homePageSection__imgWrapper" data-aos={index % 2 ? "fade-left" : "fade-right"}>
                    <img className="homePageSection__img" src={settings.API_URL + "/image?url=/media/" + item.img_path} alt="pasja-do-gotowania" />
                </figure>
            </section>
        })}
    </section>
}

export default HomePageSection;
