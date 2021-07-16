import React, { useEffect, useState } from 'react'

import trash from '../static/img/trash.svg'
import write from '../static/img/write.svg'

import {calculatePrice, deleteFromCart} from '../helpers/editCart'
import { getSingleProduct } from "../helpers/productFunctions";
import convertToURL from "../helpers/convertToURL";
import settings from "../admin/helpers/settings";

const Cart = () => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('sec-cart')));
    const [cartProducts, setCartProducts] = useState([]);
    const [update, setUpdate] = useState(false);
    const [cartSum, setCartSum] = useState(0);

    useEffect(() => {
       let newArr = [];
       if(cart) {
           const cb = () => {
               setCartProducts(newArr);
               setUpdate(!update);
               setCartSum(calculateSum());
           }

           cart.forEach((item, index, array) => {
               const pr = getSingleProduct(item.id)
                   .then(res => {
                       newArr.push(res.data.result[0]);
                   });

               Promise.all([pr])
                   .then(() => {
                       if(index === array.length-1) {
                           cb();
                       }
                   })
           });
       }
    }, []);

    const calculateSum = () => {
        const s = document.querySelectorAll("#price");
        let sum = 0;
        s.forEach(item => {
            console.log(sum);
            sum += parseInt(item.textContent.substr(0, item.textContent.length-4));
        });
        localStorage.setItem('sec-amount', sum.toString());
        return sum;
    }

    const deleteCart = id => {
        /* First - animation */
        // const allCartItems = document.querySelectorAll(".cart__item");
        // allCartItems.forEach(item => {
        //     console.log(id.id + id.size + id.option);
        //     console.log(item.id);
        //     if(item.id === "cart" + id.id + id.size + id.option) {
        //         item.style.opacity = "0";
        //         setTimeout(() => {
        //             item.style.height = "0";
        //         }, 500);
        //         return 0;
        //     }
        // });

        /* Second - delete from cart */
        setTimeout(() => {
            deleteFromCart(id);
            setCart(JSON.parse(localStorage.getItem('sec-cart')));
            setTimeout(() => {
                setCartSum(calculateSum());
            }, 100);
        }, 1);
    }

    return <main className="cartContent">
        <h1 className="cart__header">
            Podsumowanie koszyka
        </h1>
        <main className="cart">
            {cart?.length ? <>
                {cart.map((item, index) => {
                    return <section className="cart__item" id={"cart" + item.id + item.size + item.option}>
                        <a className="cart__item__imgWrapper" href={"http://brunchbox.skylo-test3.pl/produkt/" + convertToURL(cartProducts[index]?.name.split("/")[0])}>
                            <img className="cart__item__img" src={settings.API_URL + "/image?url=/media/" + cartProducts[index]?.file_path} alt="produkt"/>
                        </a>

                        <section className="cart__item__column firstCol">
                            <h3 className="cart__item__label">
                                Nazwa produktu
                            </h3>
                            <h2 className="cart__item__value">
                                {cartProducts[index]?.name?.split("/")[0]}<br/>
                                ({cartProducts[index]?.bracket_name?.split("/")[0]})
                            </h2>
                        </section>

                        <section className="cart__item__column secondCol">
                            <h3 className="cart__item__label">
                                Opcja
                            </h3>
                            <h2 className="cart__item__value uppercase">
                                {item.option}
                            </h2>
                        </section>

                        <section className="cart__item__column thirdCol">
                            <h3 className="cart__item__label">
                                Rozmiar
                            </h3>
                            <h2 className="cart__item__value">
                                {item.size}
                            </h2>
                        </section>

                        <section className="cart__item__column fourthCol">
                            <h3 className="cart__item__label">
                                Ilość
                            </h3>
                            <h2 className="cart__item__value">
                                {item.quantity}
                            </h2>
                        </section>

                        <section className="cart__item__column fifthCol">
                            <h3 className="cart__item__label">
                                Wartość
                            </h3>
                            <h2 className="cart__item__value noWrap" id="price">
                                {calculatePrice(item.size, item.option, item.quantity, {mMeat: cartProducts[index]?.price_m_meat, lMeat: cartProducts[index]?.price_l_meat, mVege: cartProducts[index]?.price_m_vege, lVege: cartProducts[index]?.price_l_vege})} PLN
                            </h2>
                        </section>

                        <section className="cart__item__column sixthCol">
                            <h3 className="cart__item__label">
                                Działania
                            </h3>
                            <section className="cart__item__value cart__item__value--flex">
                                <button className="cart__item__value cart__item__value--button">
                                    <a href={"http://brunchbox.skylo-test3.pl/produkt/" + convertToURL(cartProducts[index]?.name.split("/")[0])}>
                                        <img className="cart__item__icon" src={write} alt="wroc-do-produktu"/>
                                    </a>
                                </button>
                                <button className="cart__item__value cart__item__value--button" onClick={() => {
                                    deleteCart({
                                        id: item.id,
                                        size: item.size,
                                        option: item.option
                                    })
                                }}>
                                    <img className="cart__item__icon" src={trash} alt="kosz"/>
                                </button>
                            </section>
                        </section>
                    </section>
                })}

                <section className="cart__summary">
                    <header className="cart__summary__header">
                        <h3 className="cart__summary__header__label">
                            Łącznie do zapłaty:
                        </h3>
                        <h4 className="cart__summary__header__value">
                            { cartSum } PLN
                        </h4>
                    </header>
                    <button className="cart__summary__button">
                        <a className="button--landing__link button__link--smaller" href="/dostawa-i-platnosc">
                            Przjedź dalej
                        </a>
                    </button>
                </section>
            </> : <>
                <h2 className="emptyCart">
                    Twój koszyk jest pusty
                </h2>
                <button className="button button--landing button--emptyCart">
                    <a className="button--landing__link button--emptyCart__link" href="/">
                        Wróć do sklepu
                    </a>
                </button>
            </> }


        </main>
    </main>
}

export default Cart;
