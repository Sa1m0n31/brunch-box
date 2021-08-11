import React, { useEffect, useState } from 'react'
import productImg from '../static/img/pudelko.png'
import {getAllCategories} from "../helpers/categoryFunctions";
import settings from "../admin/helpers/settings";
import convertToURL from "../helpers/convertToURL";

const HomePageSection = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getAllCategories()
            .then((res) => {
                setCategories(res.data.result);
            });
    }, []);

    return <section className="homePageSection">
        <span id="zestawy"></span>
        {/*<h2 className="homePageSection__header">*/}
        {/*    Oferta*/}
        {/*</h2>*/}
        <div className="homePageSection__menu">
            {categories.map((item, index) => {
                if(!item.hidden) {
                    return <a key={index} className="homePageSection__item" href={convertToURL(item.name)}>
                        <img className="homePageSection__img" src={settings.API_URL + "/image?url=/media/" + item.img_path}
                             alt="produkt"/>
                        <h3 className="homePageSection__item__header">
                            {item.name}
                        </h3>
                        <button className="button button--landing button--homePageSection">
                            <a className="button--landing__link button--homePageSection__link">
                                Więcej informacji
                            </a>
                        </button>
                    </a>
                }
                else {
                    return "";
                }
            })}
        </div>
    </section>
}

export default HomePageSection;
