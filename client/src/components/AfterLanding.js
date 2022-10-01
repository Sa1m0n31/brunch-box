import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import settings from "../admin/helpers/settings";
import {Link} from "react-router-dom";
import convertToURL from "../helpers/convertToURL";
import {LangContext} from "../App";

const AfterLanding = () => {
    const [newProducts, setNewProducts] = useState([]);
    const [bestsellers, setBestsellers] = useState([]);

    const { content, langIndex } = useContext(LangContext);

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

    useEffect(() => {
        axios.get(`${settings.API_URL}/product/get-new-products`)
            .then((res) => {
                setNewProducts(res?.data?.result);
            });

        axios.get(`${settings.API_URL}/product/get-bestsellers`)
            .then((res) => {
                setBestsellers(res?.data?.result);
            });
    }, []);

    return <div className="afterLanding">
        <h3 className="afterLanding__header">
            {content.bestsellers}
        </h3>
        <section className="offerContent__grid offerContent__grid--landing">
            {bestsellers ? bestsellers.map((item, index) => {
                if(!item.hidden && index < 3) {
                    return <a className="offerContent__item"
                                 key={index}
                                 href={`/produkt/${convertToURL(item.product_name.split("/")[0])}`}
                    >
                        <div className="offerContent__item__border">
                            <section className="offerContent__imgWrapper">
                                <img className="offerContent__item__img"
                                     src={/*settings.API_URL + */"https://brunchbox.pl/image?url=/media/" + item.image} alt="produkt"/>
                            </section>
                            <h3 className="offerContent__item__header">
                                {item.product_name.split("/")[langIndex]}
                                {/*<span className="offerContent__item__header--cursive">*/}
                                {/*    {item.bracket_name.split("/")[langIndex]}*/}
                                {/*</span>*/}
                            </h3>
                            {/*<p className="offerContent__item__price">*/}
                            {/*    {printPrice(item.price_l_meat, item.price_m_meat, item.price_l_vege, item.price_m_vege)}*/}
                            {/*</p>*/}
                        </div>
                    </a>
                }
                else return "";
            }) : ''}
        </section>

        <h3 className="afterLanding__header">
            {content.newProducts}
        </h3>
        <section className="offerContent__grid offerContent__grid--landing">
            {newProducts ? newProducts.map((item, index) => {
                if(!item.hidden && index < 3) {
                    return <a className="offerContent__item"
                                 key={index}
                                 href={`/produkt/${convertToURL(item.product_name.split("/")[0])}`}
                    >
                        <div className="offerContent__item__border">
                            <section className="offerContent__imgWrapper">
                                <img className="offerContent__item__img"
                                     src={/*settings.API_URL + */"https://brunchbox.pl/image?url=/media/" + item.image} alt="produkt"/>
                            </section>
                            <h3 className="offerContent__item__header">
                                {item.product_name.split("/")[langIndex]}
                                {/*<span className="offerContent__item__header--cursive">*/}
                                {/*    {item.bracket_name.split("/")[langIndex]}*/}
                                {/*</span>*/}
                            </h3>
                            {/*<p className="offerContent__item__price">*/}
                            {/*    {printPrice(item.price_l_meat, item.price_m_meat, item.price_l_vege, item.price_m_vege)}*/}
                            {/*</p>*/}
                        </div>
                    </a>
                }
                else return "";
            }) : ''}
        </section>
    </div>
};

export default AfterLanding;
