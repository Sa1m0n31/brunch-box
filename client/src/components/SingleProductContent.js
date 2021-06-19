import React, {useEffect, useRef, useState} from 'react'

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

import productImg from '../static/img/product-image.png'
import cartImg from '../static/img/cartIcon.png'

import addToCart from "../helpers/addToCart";

const SingleProductContent = () => {
    const [size, setSize] = useState(0);
    const [option, setOption] = useState(0);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [galleryOpen, setGalleryOpen] = useState(false);

    const images = [
        productImg,
        productImg,
        productImg,
        productImg
    ];

    return <main className="singleProduct">
        <section className="singleProduct__left">
            <button className="singleProduct__mainImage" onClick={() => setGalleryOpen(true)}>
                <img className="singleProduct__img" src={productImg} alt="produkt" />
            </button>
            <div className="singleProduct__images">
                <img className="singleProduct__img" onClick={() => setGalleryOpen(true)} src={productImg} alt="produkt" />
                <img className="singleProduct__img" onClick={() => setGalleryOpen(true)} src={productImg} alt="produkt" />
                <img className="singleProduct__img" onClick={() => setGalleryOpen(true)} src={productImg} alt="produkt" />
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
                <section className="singleProduct__options__buttons singleProduct__options__buttons--lower">
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
                </section>
            </div>
            <section className="singleProduct__options">
                <button className="button button--addToCart" onClick={() => addToCart(1, option, size, 1)}>
                    Dodaj do koszyka
                    <img className="button--addToCart__img" src={cartImg} alt="koszyk" />
                </button>
            </section>

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

        {/* GALLERY */}
        {galleryOpen ? <Lightbox
            mainSrc={images[photoIndex]}
            onCloseRequest={() => {setGalleryOpen(false)} }
            nextSrc={images[(photoIndex+1) % 4]}
            prevSrc={images[(photoIndex-1) % 4]}
            onMovePrevRequest={() => {
                if(photoIndex > 0) setPhotoIndex(photoIndex-1);
                else setPhotoIndex(3);
            }}
            onMoveNextRequest={() => {
                if(photoIndex < 3) setPhotoIndex(photoIndex+1);
                else setPhotoIndex(0);
            }}
        /> : ""}
    </main>
}

export default SingleProductContent;
