import React, {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

import {getAllProducts} from "../helpers/productFunctions";
import convertToURL from "../helpers/convertToURL";
import settings from "../admin/helpers/settings";

import Loader from "react-loader-spinner";
import {getAllCategories} from "../helpers/categoryFunctions";
import HomePageSection from "./HomePageSection";
import CategoriesMenu from "./CategoriesMenu";
import {LangContext} from "../App";

const FullOffer = () => {
    const [products, setProducts] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productsMode, setProductsMode] = useState(-1);

    const { content } = useContext(LangContext);

    useEffect(() => {
        console.log('hi');
        /* Check number of categories available */
        getAllCategories()
            .then(res => {
                if(res.data) {
                    const cats = res.data.result;
                    setCategories(res.data.result);
                    const availableCats = cats?.filter(item => {
                        return !item.hidden;
                    });
                    if(availableCats) {
                        if(availableCats.length > 1) {
                            /* Show categories */
                            setProductsMode(0);
                        }
                        else {
                            /* Show products */
                            setProductsMode(1);
                        }
                    }
                }
            });

        const sortByPriority = (a, b) => {
            if(a.priority < b.priority) return 1;
            else return -1;
        }

        getAllProducts()
            .then(res => {
                console.log(res?.data?.result);
                if(res?.data?.result) {
                    setProducts(res.data.result.sort(sortByPriority));
                    setLoaded(true);
                }
            });
    }, []);

    const printPrice = (lMeat, mMeat, lVege, mVege) => {
        if(lMeat && mMeat) {
            if(lMeat !== mMeat) {
                return `${lMeat} zł / ${mMeat} zł`;
            }
            else {
                return `${lMeat} zł`;
            }
        }
        else if(lVege && mVege) {
            if(lVege !== mVege) {
                return `${lVege} zł / ${mVege} zł`;
            }
            else {
                return `${lVege} zł`;
            }
        }
        else if(lMeat && lVege) {
            if(lMeat !== lVege) {
                return `${lMeat} zł / ${lVege} zł`;
            }
            else {
                return `${lMeat} zł`;
            }
        }
        else if(mMeat && mVege) {
            if(mMeat !== mVege) {
                return `${mMeat} zł / ${mVege} zł`;
            }
            else {
                return `${mMeat} zł`;
            }
        }
        else if(lMeat) {
            return `${lMeat} zł`;
        }
        else if(mMeat) {
            return `${mMeat} zł`;
        }
        else if(lVege) {
            return `${lVege} zł`;
        }
        else if(mVege) {
            return `${mVege} zł`;
        }
        else {
            return '';
        }
    }

    return <main className="offerContent offerContent--offer">
        <h1 className="offerContent__header">
            Menu
        </h1>
        <h2 className="offerContent__header offerContent__header--2">
            {content.offerSubheader}
        </h2>

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
                                <section className="offerContent__imgWrapper">
                                    <img className="offerContent__item__img"
                                         src={/*settings.API_URL + */"https://brunchbox.pl/image?url=/media/" + item.image} alt="produkt"/>
                                </section>
                                <h3 className="offerContent__item__header">
                                    {item.product_name.split("/")[0]}
                                    <span className="offerContent__item__header--cursive">
                                        {item.bracket_name.split("/")[0]}
                                    </span>
                                </h3>
                                <p className="offerContent__item__price">
                                    {printPrice(item.price_l_meat, item.price_m_meat, item.price_l_vege, item.price_m_vege)}
                                </p>
                            </div>
                            <button className="offerContent__item__btn">
                                {content.offerBtn}
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
            </main>) : <CategoriesMenu />}
    </main>
}

export default FullOffer;
