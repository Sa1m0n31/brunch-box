import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import productImg from '../static/img/product-image.png'
import {getAllProducts} from "../helpers/productFunctions";
import convertToURL from "../helpers/convertToURL";
import settings from "../admin/helpers/settings";

import { useLocation } from "react-router-dom";
import {getCategoryByName} from "../helpers/categoryFunctions";

const OfferContent = ({type}) => {
    const [title, setTitle] = useState("");
    const [deliveryTime, setDeliveryTime] = useState("");
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("");
    const [header, setHeader] = useState("");
    const [subheader, setSubheader] = useState("");

    useEffect(() => {
        getCategoryByName(type)
            .then(res => {
               const result = res.data.result[0];
               if(result) {
                   setHeader(result.header);
                   setSubheader(result.subheader);
               }
               else {
                   /* Offer page */

               }
            });

        getAllProducts()
            .then(res => {
                setProducts(res.data.result);
            });

        if(type !== "oferta") setCategory(type);
    }, []);

    return <main className="offerContent">
        {category ? <h1 className="offerContent__header">
            {header}
            <span className="thin marginLeft15">({subheader})</span>
        </h1> : <h1 className="offerContent__header">
            Nasza oferta
        </h1>}

        <div className="offerContent__grid">
            {products.map((item, index) => {
                if(category !== "") {
                    if(item.category_name === category) {
                        return <Link className="offerContent__item"
                                     key={index}
                                     to={{
                                         pathname: `/produkt/${convertToURL(item.product_name)}`,
                                         state: {
                                             id: item.id,
                                             title: item.name,
                                             price: item.price_m_meat
                                         }
                                     }}
                        >
                            <div className="offerContent__item__border">
                                <h3 className="offerContent__item__header">
                                    {item.product_name}
                                    <span className="offerContent__item__header--cursive">
                                    {item.bracket_name}
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
                }
                else {
                    return <Link className="offerContent__item"
                                 key={index}
                                 to={{
                                     pathname: `/produkt/${convertToURL(item.product_name)}`,
                                     state: {
                                         id: item.id,
                                         title: item.name,
                                         price: item.price_m_meat
                                     }
                                 }}
                    >
                        <div className="offerContent__item__border">
                            <h3 className="offerContent__item__header">
                                {item.product_name}
                                <span className="offerContent__item__header--cursive">
                                    {item.bracket_name}
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
            })}
        </div>
    </main>
}

export default OfferContent;
