import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import productImg from '../static/img/product-image.png'
import {getAllProducts} from "../helpers/productFunctions";
import convertToURL from "../helpers/convertToURL";
import settings from "../admin/helpers/settings";

import { useLocation } from "react-router-dom";

const OfferContent = ({type}) => {
    const [title, setTitle] = useState("");
    const [deliveryTime, setDeliveryTime] = useState("");
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("");

    useEffect(() => {
        getAllProducts()
            .then(res => {
                setProducts(res.data.result);
                console.log(res.data.result);
            });

        if(type === "indywidualna") {
            setCategory(("Oferta indywidualna"));
            setTitle("Oferta indywidualna: pudełko");
            setDeliveryTime("(dostawa w 2-3 godziny)");
        }
        else if(type === "bankietowa") {
            setCategory("Oferta dla grup");
            setTitle("Menu Bankietowe");
            setDeliveryTime("(dostawa od 48 godzin)");
        }
        else {
            setCategory("Menu bankietowe");
            setTitle("Oferta dla grup: Pudełko");
            setDeliveryTime("(dostawa od 36 godzin)");
        }
    }, []);

    return <main className="offerContent">
        <h1 className="offerContent__header">
            {title} <span className="thin">{deliveryTime}</span>
        </h1>

        <div className="offerContent__grid">
            {products.map((item, index) => {
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
                                {item.product_name} ({item.bracket_name})
                            </h3>
                            <img className="offerContent__item__img"
                                 src={settings.API_URL + "/image?url=/media/" + item.image} alt="produkt"/>
                        </div>
                        <button className="offerContent__item__btn">
                            Więcej informacji
                        </button>
                    </Link>
                }
                else return "";
            })}
        </div>
    </main>
}

export default OfferContent;
