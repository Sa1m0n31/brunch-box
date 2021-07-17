import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {getAllProducts} from "../helpers/productFunctions";
import convertToURL from "../helpers/convertToURL";
import settings from "../admin/helpers/settings";

import Loader from "react-loader-spinner";
import {getAllCategories} from "../helpers/categoryFunctions";
import HomePageSection from "./HomePageSection";

const FullOffer = () => {
    const [products, setProducts] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productsMode, setProductsMode] = useState(-1);

    useEffect(() => {
        /* Check number of categories available */
        getAllCategories()
            .then(res => {
                if(res.data) {
                    const cats = res.data.result;
                    setCategories(res.data.result);
                    const availableCats = cats.filter(item => {
                        return !item.hidden;
                    });
                    if(availableCats.length > 1) {
                        /* Show categories */
                        setProductsMode(0);
                    }
                    else {
                        /* Show products */
                        setProductsMode(1);
                    }
                }
            });

        getAllProducts()
            .then(res => {
                setProducts(res.data.result);
                setLoaded(true);
            });
    }, []);

    return <main className="offerContent">
        {/*{category ? <h1 className="offerContent__header">*/}
        {/*    {header}*/}
        {/*    <span className="thin marginLeft15">({subheader})</span>*/}
        {/*</h1> : <h1 className="offerContent__header">*/}
        {/*    Nasza oferta*/}
        {/*</h1>}*/}

        {productsMode !== 0 ? (loaded ? <section className="offerContent__grid">
                {products.map((item, index) => {
                    if(!item.hidden) {
                        return <Link className="offerContent__item"
                                     data-aos="zoom-in"
                                     key={index}
                                     to={{
                                         pathname: `/produkt/${convertToURL(item.product_name.split("/")[0])}`,
                                         state: {
                                             id: item.id,
                                             title: item.name,
                                             price: item.price_m_meat
                                         }
                                     }}
                        >
                            <div className="offerContent__item__border">
                                <h3 className="offerContent__item__header">
                                    {item.product_name.split("/")[0]}
                                    <span className="offerContent__item__header--cursive">
                                    {item.bracket_name.split("/")[0]}
                                </span>
                                </h3>
                                <section className="offerContent__imgWrapper">
                                    <img className="offerContent__item__img"
                                         src={settings.API_URL + "/image?url=/media/" + item.image} alt="produkt"/>
                                </section>
                            </div>
                            <button className="offerContent__item__btn">
                                Więcej informacji
                            </button>
                        </Link>
                    }
                    else return "";
                })}
            </section> : <main className="loading">
                <Loader
                    type="puff"
                    color="#000"
                    width={100}
                    height={100}
                />
            </main>) : <HomePageSection />}
    </main>
}

export default FullOffer;
