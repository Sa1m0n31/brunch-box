import React, {useContext, useEffect, useState} from 'react'

import trash from '../static/img/trash.svg'
import write from '../static/img/eye.png'

import {calculatePrice, deleteFromCart, editCart} from '../helpers/editCart'
import { getSingleProduct } from "../helpers/productFunctions";
import convertToURL from "../helpers/convertToURL";
import settings from "../admin/helpers/settings";
import closeImg from "../static/img/close.png";
import Modal from "react-modal";
import {LangContext} from "../App";

const Cart = () => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('sec-cart')));
    const [cartBanquet, setCartBanquet] = useState(JSON.parse(localStorage.getItem('sec-cart-banquet')));
    const [cartProducts, setCartProducts] = useState([]);
    const [update, setUpdate] = useState(false);
    const [cartSum, setCartSum] = useState(0);
    const [error50, setError50] = useState(false);
    const [error50Modal, setError50Modal] = useState(false);

    const { content } = useContext(LangContext);

    useEffect(async () => {
       let newArr = [];
       if((cart)||(cartBanquet)) {
           const cb = () => {
               setCartProducts(newArr);
               setUpdate(!update);
               setCartSum(calculateSum());
           }

           let promises = [];

           cart?.forEach(async (item) => {
               promises.push(getSingleProduct(item.id)
                   .then(res => {
                       newArr.push(res.data.result[0]);
                   }));
           });

           Promise.all(promises)
               .then(() => {
                   cb();
               });
       }
    }, []);

    const calculateSum = () => {
        const s = document.querySelectorAll("#price");
        let sum = 0;
        s.forEach(item => {
            sum += parseInt(item.textContent.substr(0, item.textContent.length-4));
        });
        localStorage.setItem('sec-amount', sum.toString());
        return sum;
    }

    const deleteCart = id => {
        /* Delete from cart */
            deleteFromCart(id);
            setCart(JSON.parse(localStorage.getItem('sec-cart')));
            setCartBanquet(JSON.parse(localStorage.getItem('sec-cart-banquet')));
            setTimeout(() => {
                setCartSum(calculateSum());
            }, 100);
    }

    const validateCart = () => {
        let snacksSum = 0;
        let halfs = 0;
        cartBanquet?.forEach(item => {
            item.forEach(itemChild => {
               snacksSum += itemChild.selected25 ? itemChild.amount * 25 : 50;
            });
        });
        cart?.forEach(item => {
           if(item.size === "1/2 boxa") halfs += item.quantity;
        });

        if((snacksSum % 50 !== 0)||(halfs % 2 !== 0)) {
            setError50(true);
            setError50Modal(true);
        }
        else {
            window.location = "/dostawa-i-platnosc";
        }
    }

    const changeItemQuantity = (e, id) => {
        if(!isNaN(parseInt(e.target.value)) && parseInt(e.target.value) > 0 && parseInt(e.target.value) < 100) {
            setCart(cart.map((item) => {
                if(id === item.id) {
                    editCart(id, item.option, item.size, parseInt(e.target.value), true);
                    return {
                        id: item.id,
                        option: item.option,
                        quantity: parseInt(e.target.value),
                        size: item.size
                    }
                }
                else {
                    return item;
                }
            }));
        }
        if(e.target.value === '') {
            setCart(cart.map((item) => {
                if(id === item.id) {
                    deleteFromCart({uuid: item.uuid, id, size: item.size, option: item.option, banquet: false});
                    return {
                        id: item.id,
                        option: item.option,
                        quantity: 0,
                        size: item.size
                    }
                }
                else {
                    return item;
                }
            }));
        }
    }

    useEffect(() => {
        setCartSum(calculateSum());
    }, [cart]);

    return <main className="cartContent">
        <Modal
            isOpen={error50Modal}
            portalClassName="smallModal"
            onRequestClose={() => { setError50Modal(false) }}
        >

            <button className="modalClose" onClick={() => { setError50Modal(false) }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>

            <img className="modalTick" src={closeImg} alt="ostrzezenie" />
            <h2 className="modalHeader">
                {content.cartHalfBoxError}
            </h2>
            <section className="modal__buttons">
                <button className="modal__btn" onClick={() => { setError50Modal(false) }}>
                    {content.checkoutBackToCart}
                </button>
            </section>
        </Modal>

        <h1 className="cart__header">
            {content.cartHeader}
        </h1>
        <main className="cart">
            {cart?.length || cartBanquet?.flat()?.length ? <>
                {cart?.map((item, index) => {
                    return <section className="cart__item" id={"cart" + item.id + item.size + item.option}>
                        <a className="cart__item__imgWrapper" href={"https://brunchbox.pl/produkt/" + convertToURL(cartProducts[index]?.name.split("/")[0])}>
                            <img className="cart__item__img" src={settings.API_URL + "/image?url=/media/" + cartProducts[index]?.file_path} alt="produkt"/>
                        </a>

                        <a href={"https://brunchbox.pl/produkt/" + convertToURL(cartProducts[index]?.name.split("/")[0])} className="cart__item__column firstCol">
                            <h3 className="cart__item__label">
                                {content.cartCols[0]}
                            </h3>
                            <h2 className="cart__item__value">
                                {cartProducts[index]?.name?.split("/")[0]}<br/>
                                ({cartProducts[index]?.bracket_name?.split("/")[0]})
                            </h2>
                        </a>

                        <section className="cart__item__column secondCol">
                            <h3 className="cart__item__label">
                                {content.cartCols[1]}
                            </h3>
                            <h2 className="cart__item__value uppercase">
                                {item.option}
                            </h2>
                        </section>

                        <section className="cart__item__column thirdCol">
                            <h3 className="cart__item__label">
                                {content.cartCols[2]}
                            </h3>
                            <h2 className="cart__item__value">
                                {item.size}
                            </h2>
                        </section>

                        <section className="cart__item__column fourthCol">
                            <h3 className="cart__item__label">
                                {content.cartCols[3]}
                            </h3>
                            <span className="cart__item__value">
                                <input className="cart__input"
                                       value={item.quantity}
                                       onChange={(e) => { changeItemQuantity(e, item.id); }} />
                            </span>
                        </section>

                        <section className="cart__item__column fifthCol">
                            <h3 className="cart__item__label">
                                {content.cartCols[4]}
                            </h3>
                            <h2 className="cart__item__value noWrap" id="price">
                                {calculatePrice(item.size, item.option, item.quantity, {mMeat: cartProducts[index]?.price_m_meat, lMeat: cartProducts[index]?.price_l_meat, mVege: cartProducts[index]?.price_m_vege, lVege: cartProducts[index]?.price_l_vege})} PLN
                            </h2>
                        </section>

                        <section className="cart__item__column sixthCol">
                            <h3 className="cart__item__label">
                                {content.cartCols[5]}
                            </h3>
                            <section className="cart__item__value cart__item__value--flex">
                                <button className="cart__item__value cart__item__value--button">
                                    <a href={"https://brunchbox.pl/produkt/" + convertToURL(cartProducts[index]?.name.split("/")[0])}>
                                        <img className="cart__item__icon" src={write} alt="wroc-do-produktu"/>
                                    </a>
                                </button>
                                <button className="cart__item__value cart__item__value--button" onClick={() => {
                                    deleteCart({
                                        id: item.id,
                                        size: item.size,
                                        option: item.option,
                                        banquet: false
                                    })
                                }}>
                                    <img className="cart__item__icon" src={trash} alt="kosz"/>
                                </button>
                            </section>
                        </section>
                    </section>
                })}

                {cartBanquet?.flat()?.length ?
                    <>
                        {/*<h2 className="cartBanquet__header">*/}
                        {/*    Menu bankietowe*/}
                        {/*</h2>*/}
                        <section className="cart__item__banquetWrapper" id={"cart-banquet"}>
                        {cartBanquet?.flat()?.map((itemChild, index) => {
                            if(itemChild.amount !== 0) {
                                return <section className="cart__item cart__item__banquet">
                                    <a className="cart__item__imgWrapper" href="https://brunchbox.pl/menu-bankietowe/">
                                        <img className="cart__item__img" src={settings.API_URL + "/image?url=/media/" + itemChild?.image} alt="produkt"/>
                                    </a>

                                    <a href="https://brunchbox.pl/menu-bankietowe/" className="cart__item__column firstCol">
                                        <h3 className="cart__item__label">
                                            {content.cartCols[0]}
                                        </h3>
                                        <h2 className="cart__item__value">
                                            {itemChild?.name?.split("/")[0]}<br/>
                                        </h2>
                                    </a>

                                    <section className="cart__item__column secondCol">
                                        <h3 className="cart__item__label">
                                            {content.cartCols[2]}
                                        </h3>
                                        <h2 className="cart__item__value uppercase">
                                            {itemChild.selected25 ? "25 szt." : "50 szt."}
                                        </h2>
                                    </section>

                                    <section className="cart__item__column fourthCol">
                                        <h3 className="cart__item__label">
                                            {content.cartCols[3]}
                                        </h3>
                                        <h2 className="cart__item__value">
                                            {itemChild.amount}
                                        </h2>
                                    </section>

                                    <section className="cart__item__column fifthCol">
                                        <h3 className="cart__item__label">
                                            {content.cartCols[4]}
                                        </h3>
                                        <h2 className="cart__item__value noWrap" id="price">
                                            {itemChild.selected25 ? itemChild.price25 * itemChild.amount : itemChild.price50 * itemChild.amount} PLN
                                        </h2>
                                    </section>

                                    <section className="cart__item__column sixthCol">
                                        <h3 className="cart__item__label">
                                            {content.cartCols[5]}
                                        </h3>
                                        <section className="cart__item__value cart__item__value--flex">
                                            <button className="cart__item__value cart__item__value--button">
                                                <a href="https://brunchbox.pl/menu-bankietowe/">
                                                    <img className="cart__item__icon" src={write} alt="wroc-do-produktu"/>
                                                </a>
                                            </button>
                                            <button className="cart__item__value cart__item__value--button" onClick={() => {
                                                deleteCart({
                                                    uuid: itemChild.uuid,
                                                    id: itemChild.id,
                                                    size: itemChild.selected25 ? "25 szt." : "50 szt.",
                                                    option: itemChild.amount,
                                                    banquet: true
                                                })
                                            }}>
                                                <img className="cart__item__icon" src={trash} alt="kosz"/>
                                            </button>
                                        </section>
                                    </section>
                                </section>
                            }
                        })}</section></> : ""}

                <section className="cart__summary">
                    <header className="cart__summary__header">
                        <h3 className="cart__summary__header__label">
                            {content.cartSum}:
                        </h3>
                        <h4 className="cart__summary__header__value">
                            { cartSum } PLN
                        </h4>
                    </header>
                    <button className="cart__summary__button" onClick={() => { validateCart(); }}>
                        <span className="button--landing__link button__link--smaller">
                            {content.cartBtn}
                        </span>
                    </button>
                </section>
            </> : <>
                <h2 className="emptyCart">
                    {content.emptyCart}
                </h2>
                <button className="button button--landing button--emptyCart">
                    <a className="button--landing__link button--emptyCart__link" href="/">
                        {content.backToShop}
                    </a>
                </button>
            </> }
        </main>
    </main>
}

export default Cart;
