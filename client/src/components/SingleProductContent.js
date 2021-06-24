import React, {useEffect, useRef, useState} from 'react'

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

import productImg from '../static/img/product-image.png'
import cartImg from '../static/img/cartIcon.png'

import { editCart } from "../helpers/editCart";
import Modal from 'react-modal'
import closeImg from '../static/img/close.png'
import tickImg from '../static/img/tick-sign.svg'
import arrowDown from '../static/img/caret_down.svg'

import { useLocation } from "react-router";
import {getProductByName, getSingleProduct} from "../helpers/productFunctions";
import settings from "../admin/helpers/settings";

const SingleProductContent = () => {
    const [size, setSize] = useState("M");
    const [product, setProduct] = useState({});
    const [option, setOption] = useState("Mięsna");
    const [photoIndex, setPhotoIndex] = useState(0);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [price, setPrice] = useState(0);
    const [longDesc, setLongDesc] = useState(false);
    const [currentDesc, setCurrentDesc] = useState("");

    const [modal, setModal] = useState(false);

    const location = useLocation();

    const images = [
        productImg,
        productImg,
        productImg,
        productImg
    ];

    const getProductIdByURL = (name) => {
        let id = 0;
        const newName = name[name.length-1].replace(/-/g, " ");
        return getProductByName(newName);
    }

    useEffect(() => {
        let id;
        if(location.state) {
            id = location.state.id;
            getSingleProduct(id)
                .then(res => {
                    console.log(res.data.result);
                    setProduct(res.data.result[0]);
                    setPrice(res.data.result[0].price_m_meat);
                    setCurrentDesc(res.data.result[0].meat_description);
                });
        }
        else {
            getProductIdByURL(window.location.pathname.split("/"))
                .then(res => {
                    id = res.data.result[0].id
                })
                .then(() => {
                    getSingleProduct(id)
                        .then(res => {
                            console.log(res.data.result);
                            setProduct(res.data.result[0]);
                            setPrice(res.data.result[0].price_m_meat);
                            setCurrentDesc(res.data.result[0].meat_description);
                        });
                });
        }


    }, []);

    useEffect(() => {
        if(option === "Mięsna") setCurrentDesc(product.meat_description);
        else setCurrentDesc(product.vege_description);

        if((size === "M")&&(option === "Mięsna")) setPrice(product.price_m_meat);
        else if((size === "L")&&(option === "Mięsna")) setPrice(product.price_l_meat);
        else if((size === "M")&&(option === "Wegetariańska")) setPrice(product.price_m_vege);
        else if((size === "L")&&(option === "Wegetariańska")) setPrice(product.price_l_vege);
    }, [size, option])

    const addToCart = (id, option, size) => {
        editCart(id, option, size, 1);
        setModal(true);
    }

    const toggleDescription = () => {
        setLongDesc(!longDesc);
    }

    return <>
        <main className="singleProduct">

        <Modal
            isOpen={modal}
            portalClassName="smallModal"
            onRequestClose={() => { setModal(false) }}
        >

            <button className="modalClose" onClick={() => { setModal(false) }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>

            <img className="modalTick" src={tickImg} alt="dodano-do-koszyka" />
            <h2 className="modalHeader">
                Produkt został dodany do koszyka
            </h2>
            <section className="modal__buttons">
                <button className="modal__btn" onClick={() => { setModal(false) }}>
                    Kontynuuj zakupy
                </button>
                <button className="modal__btn" onClick={() => { window.location = "/koszyk" }}>
                    Przejdź do kasy
                </button>
            </section>

        </Modal>


        <section className="singleProduct__left">
            <button className="singleProduct__mainImage" onClick={() => setGalleryOpen(true)}>
                <img className="singleProduct__img" src={settings.API_URL + "/image?url=/media/" + product.file_path} alt="produkt" />
            </button>
        </section>
        <section className="singleProduct__right">
            <section className="singleProduct__right__header">
                <h1 className="singleProduct__title">
                    {product.name} <span className="thin">({product.bracket_name})</span>
                </h1>
                <h2 className="singleProduct__price">
                    {price} PLN
                </h2>
            </section>

            <div className="singleProduct__description" dangerouslySetInnerHTML={{__html: product.short_description?.replace(/&nbsp;/g, " ")}}>
            </div>

            {product.l ? <div className="singleProduct__options">
                <h3 className="singleProduct__options__header">
                    Dostępne rozmiary:
                </h3>
                <div className="singleProduct__options__buttons">
                    <button className={size === "M" ? "singleProduct__options__btn singleProduct--checked" : "singleProduct__options__btn"}
                            onClick={() => setSize("M")}>
                        M
                    </button>
                    <button className={size === "L" ? "singleProduct__options__btn singleProduct--checked" : "singleProduct__options__btn"}
                            onClick={() => setSize("L")}>
                        L
                    </button>
                </div>
            </div> : ""}
            {product.vege ? <div className="singleProduct__options">
                <h3 className="singleProduct__options__header">
                    Dostępne opcje:
                </h3>
                <section className="singleProduct__options__buttons singleProduct__options__buttons--lower">
                    <button className={option === "Mięsna" ? "singleProduct__options__btn singleProduct--checked" : "singleProduct__options__btn"}
                            onClick={() => setOption("Mięsna")}
                    >
                        Mięsna
                    </button>
                    <button className={option === "Wegetariańska" ? "singleProduct__options__btn singleProduct--checked" : "singleProduct__options__btn"}
                            onClick={() => setOption("Wegetariańska")}
                    >
                        Wegetariańska
                    </button>
                </section>
            </div> : ""}
            <div className="singleProduct__parts" dangerouslySetInnerHTML={{__html: currentDesc}}>

            </div>

            <section className="singleProduct__options">
                <button className="button button--addToCart" onClick={() => { addToCart(product.id, option, size) }}>
                    Dodaj do koszyka
                    <img className="button--addToCart__img" src={cartImg} alt="koszyk" />
                </button>
            </section>
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
        <section className="singleProduct__bottom">
            <button className="singleProduct__bottom__btn" onClick={() => { toggleDescription() }}>
                {longDesc ? "Zwiń" : "Zobacz"} pełny opis produktu
                <img className={longDesc ? "arrowDown rotate180" : "arrowDown"} src={arrowDown} alt="na-dol" />
            </button>

            <main className={longDesc ? "singleProduct__longDesc" : "o-0"} dangerouslySetInnerHTML={{__html: product.long_description?.replace(/&nbsp;/g, " ")}}>

            </main>
        </section>
        </>
}

export default SingleProductContent;
