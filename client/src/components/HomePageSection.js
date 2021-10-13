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
                <p className="homePageSection__text" data-aos="fade-right">
                    {item.header}
                </p>

                <figure className="homePageSection__imgWrapper" data-aos="fade-left">
                    <img className="homePageSection__img" src={settings.API_URL + "/image?url=/media/" + item.img_path} alt="pasja-do-gotowania" />
                </figure>
            </section>
        })}
    </section>
}

export default HomePageSection;
