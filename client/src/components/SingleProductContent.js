import React, {useEffect, useRef, useState} from 'react'

import productImg from '../static/img/product-image.png'
import ImageGallery from 'react-image-gallery';
import { useLocation } from "react-router";

const SingleProductContent = () => {
    const [size, setSize] = useState(0);
    const [option, setOption] = useState(0);

    return <main className="singleProduct">
        <section className="singleProduct__left">
            <div className="singleProduct__mainImage">
                <img className="singleProduct__img" src={productImg} alt="produkt" />
            </div>
            <div className="singleProduct__images">
                <img className="singleProduct__img" src={productImg} alt="produkt" />
                <img className="singleProduct__img" src={productImg} alt="produkt" />
                <img className="singleProduct__img" src={productImg} alt="produkt" />
            </div>
        </section>
        <section className="singleProduct__right">
            <h1 className="singleProduct__title">
                DateBox <span className="thin">(romantyczny wieczór)</span>
            </h1>
            <div className="singleProduct__options">
                <h3 className="singleProduct__options__header">
                    Dostępne rozmiary:
                </h3>
                <div className="singleProduct__options__buttons">
                    <button className={size === 0 ? "singleProduct__options__btn singleProduct--checked" : "singleProduct__options__btn"}
                            onClick={() => setSize(0)}>
                        M
                    </button>
                    <button className={size === 1 ? "singleProduct__options__btn singleProduct--checked" : "singleProduct__options__btn"}
                            onClick={() => setSize(1)}>
                        L
                    </button>
                </div>
            </div>
            <div className="singleProduct__options">
                <h3 className="singleProduct__options__header">
                    Dostępne opcje:
                </h3>
                <div className="singleProduct__options__buttons singleProduct__options__buttons--lower">
                    <button className={option === 0 ? "singleProduct__options__btn singleProduct--checked" : "singleProduct__options__btn"}
                            onClick={() => setOption(0)}
                    >
                        Wegetariańska
                    </button>
                    <button className={option === 1 ? "singleProduct__options__btn singleProduct--checked" : "singleProduct__options__btn"}
                            onClick={() => setOption(1)}
                    >
                        Mięsna
                    </button>
                </div>
            </div>

            <p className="singleProduct__description">
                Wybierając Date Box możesz z pewnością liczyć na poezję smaków, która umili każdą chwilę spędzoną razem. Nasze wykwintne przystawki idealnie łącza się z winem lub Prosecco.
            </p>

            <ul className="singleProduct__list">
                <li>kanapeczki z ziołowym serkiem i ogórkiem</li>
                <li>maślane bułeczki z guacamole</li>
                <li>mini deska serów</li>
                <li>mozarella z brzoskwinią i bazylią</li>
                <li>mix domowych marynowanych oliwek</li>
                <li>mix owoców sezonowych truskawki w czekoladzie</li>
                <li>mus czekoladowy</li>
                <li>donut brownie z polewą z solonego karmelu</li>
            </ul>
        </section>
    </main>
}

export default SingleProductContent;
