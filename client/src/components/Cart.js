import React, { useEffect, useState } from 'react'

import exampleImg from '../static/img/pudelko.png'
import trash from '../static/img/trash.svg'
import write from '../static/img/write.svg'

import { deleteFromCart } from '../helpers/editCart'

const Cart = () => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('sec-cart')));
    let sum = 0;

    useEffect(() => {

    }, []);

    const deleteCart = id => {
        deleteFromCart(id);
        setCart(JSON.parse(localStorage.getItem('sec-cart')));
    }

    return <main className="cartContent">
        <h1 className="cart__header">
            Podsumowanie koszyka
        </h1>
        <main className="cart">
            {cart.length ? <>
                {cart.map((item, index) => {
                    sum += 1;
                    return <section className="cart__item">
                        <section className="cart__item__imgWrapper">
                            <img className="cart__item__img" src={exampleImg} alt="produkt"/>
                        </section>

                        <section className="cart__item__column firstCol">
                            <h3 className="cart__item__label">
                                Nazwa produktu
                            </h3>
                            <h2 className="cart__item__value">
                                Brunch Box (Romantyczny wieczór)
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
                            <input className="cart__item__input" type="number" value={item.quantity} name="size"/>
                        </section>

                        <section className="cart__item__column fifthCol">
                            <h3 className="cart__item__label">
                                Wartość
                            </h3>
                            <h2 className="cart__item__value noWrap">
                                {item.price * item.quantity} PLN
                            </h2>
                        </section>

                        <section className="cart__item__column sixthCol">
                            <h3 className="cart__item__label">
                                Działania
                            </h3>
                            <section className="cart__item__value cart__item__value--flex">
                                <button className="cart__item__value cart__item__value--button">
                                    <img className="cart__item__icon" src={write} alt="wroc-do-produktu"/>
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
                            { sum } PLN
                        </h4>
                    </header>
                    <button className="cart__summary__button">
                        <a className="button--landing__link button__link--smaller" href="/dostawa-i-platnosc">
                            Przjedź dalej
                        </a>
                    </button>
                </section>
            </> : <h2 className="emptyCart">
                Twój koszyk jest pusty
            </h2> }


        </main>
    </main>
}

export default Cart;
