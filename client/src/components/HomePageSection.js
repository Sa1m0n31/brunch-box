import React, {useContext, useEffect, useState} from 'react'
import {getAllSections} from "../admin/helpers/aboutUsFunctions";
import settings from "../helpers/settings";
import {LangContext} from "../App";

const HomePageSection = () => {
    const [sections, setSections] = useState([]);

    const { langIndex, content } = useContext(LangContext);

    useEffect(() => {
        getAllSections()
            .then((res) => {
                if(res?.data?.result) {
                    setSections(res?.data?.result?.filter((item) => {
                        return !item.content && !item.content_en;
                    }));
                }
            });
    }, []);

    return <section className="homePageSection">
        {sections?.map((item, index) => {
            return  <section className={index % 2 ? "homePageSection__item homePageSection__item--odd" : "homePageSection__item"}>
                <section className="homePageSection__item__content">
                    <p className="homePageSection__text">
                        {langIndex === 0 ? item.header : item.header_en}
                    </p>
                </section>

                <figure className="homePageSection__imgWrapper">
                    <img className="homePageSection__img" src={settings.API_URL + "/image?url=/media/" + item.img_path} alt="pasja-do-gotowania" />
                </figure>
            </section>
        })}

        <button className="button button--landing button--aboutUsPage">
            <a className="button--landing__link" href="/oferta">
                {content.aboutUsBtn}
            </a>
        </button>
    </section>
}

export default HomePageSection;
