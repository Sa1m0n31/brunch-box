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
        <h2 className="homePageSection__header">
            Oferta
        </h2>
        <div className="homePageSection__menu">
            {categories.map((item, index) => (
                <section key={index} className="homePageSection__item">
                    <img className="homePageSection__img" src={settings.API_URL + "/image?url=/media/" + item.img_path} alt="produkt" />
                    <h3 className="homePageSection__item__header">
                        {item.name}
                    </h3>
                    <button className="button button--landing button--homePageSection">
                        <a className="button--landing__link button--homePageSection__link" href={convertToURL(item.name)}>
                            Więcej informacji
                        </a>
                    </button>
                </section>
            ))}
        </div>
    </section>
}

export default HomePageSection;
