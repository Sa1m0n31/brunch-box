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
                console.log(res);
                if(res.data) {
                    const cats = res.data.result;
                    setCategories(res.data.result);
                    const availableCats = cats?.filter(item => {
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

        const sortByPriority = (a, b) => {
            if(a.priority < b.priority) return 1;
            else return -1;
        }

        getAllProducts()
            .then(res => {
                console.log(res.data.result);
                setProducts(res.data.result.sort(sortByPriority));
                setLoaded(true);
            });
    }, []);

    return <main className="offerContent">
        <h1 className="offerContent__header">
            Wybierz idealny zestaw dla siebie
        </h1>

        {productsMode !== 0 ? (loaded ? <section className="offerContent__grid">
                {products.map((item, index) => {
                    if(!item.hidden) {
                        return <Link className="offerContent__item"
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
                                         src={/*settings.API_URL + */"https://brunchbox.pl/image?url=/media/" + item.image} alt="produkt"/>
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
