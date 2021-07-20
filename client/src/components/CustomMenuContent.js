import React, {useEffect, useRef, useState} from 'react'

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import {addToCartBanquet, editCart} from "../helpers/editCart";
import Modal from 'react-modal'
import closeImg from '../static/img/close.png'
import tickImg from '../static/img/tick-sign.svg'
import { v4 as uuidv4 } from 'uuid';
import arrow from '../static/img/caret_down.svg'

import { useLocation } from "react-router";
import {getImageById, getProductAllergens, getProductByName, getSingleProduct} from "../helpers/productFunctions";
import settings from "../admin/helpers/settings";
import {allergensImg, allergensList} from "../helpers/allergens";
import ReactTooltip from 'react-tooltip'
import Loader from "react-loader-spinner";

import bb1 from '../static/img/brunchbox-1.png';
import bb2 from '../static/img/brunchbox-2.png';
import bb3 from '../static/img/brunchbox-3.png';
import bb4 from '../static/img/brunchbox-4.png';
import axios from "axios";

const CustomMenuContent = () => {
    const [product, setProduct] = useState([1]);
    const [products, setProducts] = useState([]);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [price, setPrice] = useState(0);
    const [allergens, setAllergens] = useState([]);

    const [mainImage, setMainImage] = useState(null);
    const [gallery1, setGallery1] = useState(null);
    const [gallery2, setGallery2] = useState(null);
    const [gallery3, setGallery3] = useState(null);

    const [indexAtMain, setIndexAtMain] = useState(0);
    const [indexAt1, setIndexAt1] = useState(1);
    const [indexAt2, setIndexAt2] = useState(2);
    const [indexAt3, setIndexAt3] = useState(3);

    const [loaded, setLoaded] = useState(false);
    const [modal, setModal] = useState(false);

    const [amount, setAmount] = useState(1);
    const [productInfo, setProductInfo] = useState([
        { selected25: false, selected50: false, amount: 0 }
    ]);
    const [accordion, setAccordion] = useState([false]);
    const [snacksToChoose, setSnacksToChoose] = useState(50);
    const [snacksSet, setSnacksSet] = useState(false);
    const [snacksChoosen, setSnacksChoosen] = useState(0);
    const [modalWarning, setModalWarning] = useState(false);

    const location = useLocation();

    const images = [
        settings.API_URL + "/image?url=/media/" + mainImage,
        settings.API_URL + "/image?url=/media/" + gallery1,
        settings.API_URL + "/image?url=/media/" + gallery2,
        settings.API_URL + "/image?url=/media/" + gallery3
    ];

    const getProductIdByURL = (name) => {
        const newName = name[name.length-2].replace(/-/g, " ");
        return getProductByName(newName);
    }

    useEffect(() => {
        /* Get all products from 'Menu bankietowe' */
        axios.get("http://brunchbox.skylo-test3.pl/product/get-banquet-products")
            .then(res => {
                console.log(res.data.result);
                if(res.data) {
                    const result = res.data.result;
                    setProducts(result);
                    setMainImage(result[0].main_image);
                    setGallery1(result[0].gallery_1);
                    setGallery2(result[0].gallery_2);
                    setGallery3(result[0].gallery_3);
                    const productInfoArray = result.map(item => {
                        return { selected25: false, selected50: false, amount: 0 }
                    });
                    setProductInfo(productInfoArray);
                    setAccordion(result.map(item => { return false; } ));
                }
            })

        /* ... */
        setLoaded(true);
    }, []);

    const addToCart = (id) => {
        if((snacksChoosen % 50 === 0)&&(snacksChoosen !== 0)) {
           console.log(products);
           console.log(productInfo);
           const cartInfo = productInfo.map((item, index) => {
               return {
                   uuid: uuidv4(),
                   id: products[index].id,
                   name: products[index].name,
                   image: products[index].main_image,
                   price25: products[index].price_25,
                   price50: products[index].price_50,
                   selected25: item.selected25,
                   selected50: item.selected50,
                   amount: item.amount
               }
           });
           addToCartBanquet(cartInfo);
           setModal(true);
        }
        else {
            setModalWarning(true);
        }
    }

    const randomImages = (except) => {
        const arr = [0, 1, 2, 3].filter(item => {
            return item !== except;
        });

        setIndexAt1(arr[0]);
        setIndexAt2(arr[1]);
        setIndexAt3(arr[2]);
    }

    const switchMainImage = (index) => {
        setIndexAtMain(index);
        randomImages(index);
    }

    const changeSelected25 = (i) => {
        /* Test if 50 selected */
        let uncheck50 = false;
        if(productInfo[i].selected50) uncheck50 = true;

        const numberOf25Selected = productInfo.filter(item => {
            return item.selected25;
        }).length;
        console.log("NUMBER: " + numberOf25Selected);
        if(numberOf25Selected % 2 === 0) {
            console.log("hello!!!");
            setProductInfo(productInfo.map((item, index) => {
                return {
                    selected25: item.selected25,
                    selected50: item.selected50,
                    amount: 5
                }
            }));
        }

        setProductInfo(productInfo.map((item, index) => (
            {
                selected25: i === index ? !item.selected25 : item.selected25,
                selected50: i === index && uncheck50 ? false : item.selected50,
                amount: item.amount
            }
        )));

        handleAccordion(i);
    }

    const changeSelected50 = (i) => {
        /* Test if 25 selected */
        let uncheck25 = false;
        if(productInfo[i].selected25) uncheck25 = true;

        setProductInfo(productInfo.map((item, index) => (
            {
                selected25: i === index && uncheck25 ? false : item.selected25,
                selected50: i === index ? !item.selected50 : item.selected50,
                amount: item.amount
            }
        )));

        handleAccordion(i);
    }

    const changeAmount = (i, n) => {
        if(n !== 0) {
            setProductInfo(productInfo.map((item, index) => (
                {
                    selected25: item.selected25,
                    selected50: item.selected50,
                    amount: i === index ? parseInt(n) : 1
                }
            )));
        }
        else {
            setProductInfo(productInfo.map((item, index) => (
                {
                    selected25: i === index ? false : item.selected25,
                    selected50: i === index ? false : item.selected50,
                    amount: i === index ? parseInt(n) : item.amount
                }
            )));
        }

        handleAccordion(i);
    }

    const hideSection = () => {
        setAccordion(accordion.map((item, index) => {
            return false;
        }));
    }

    const handleAccordion = (i) => {
        /* Get allergens */
        getProductAllergens(products[i].id)
            .then(res => {
                setAllergens(res.data.result);
            });

        setAccordion(accordion.map((item, index) => {
            return i === index;
        }));
        setMainImage(products[i].main_image);
        setGallery1(products[i].gallery_1);
        setGallery2(products[i].gallery_2);
        setGallery3(products[i].gallery_3);
    }

    /* After every productInfo change */
    useEffect(() => {
        setSnacksToChoose(amount * 50);
        setSnacksSet(true);
    }, [productInfo]);

    useEffect(() => {
        if(snacksSet) {
            let snacksToSubtract = 0;
            let toPay = 0;
            productInfo.forEach((currentItem, index, array) => {
                if(currentItem.selected25) {
                    snacksToSubtract += currentItem.amount * 25;
                    toPay += currentItem.amount * products[index].price_25;
                }
                else if(currentItem.selected50) {
                    snacksToSubtract += currentItem.amount * 50;
                    toPay += currentItem.amount * products[index].price_50;
                }

                if(index === array.length-1) {
                    setSnacksToChoose(snacksToChoose - snacksToSubtract);
                    setSnacksChoosen(snacksToSubtract);
                    setPrice(toPay);
                }
            });
            setSnacksSet(false);
        }
    }, [snacksSet]);

    useEffect(() => {
        setSnacksToChoose(amount * 50);
    }, [amount]);

    return <>
        <main className="singleProduct singleProduct--banquet">

            <img className="singleProduct--img singleProduct--img--1" src={bb1} alt="brunch-box" />
            <img className="singleProduct--img singleProduct--img--2" src={bb2} alt="brunch-box" />
            <img className="singleProduct--img singleProduct--img--3" src={bb3} alt="brunch-box" />
            <img className="singleProduct--img singleProduct--img--4" src={bb4} alt="brunch-box" />

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

            <Modal
                isOpen={modalWarning}
                portalClassName="smallModal"
                onRequestClose={() => { setModalWarning(false) }}
            >

                <button className="modalClose" onClick={() => { setModalWarning(false) }}>
                    <img className="modalClose__img" src={closeImg} alt="zamknij" />
                </button>

                <img className="modalTick" src={closeImg} alt="ostrzezenie" />
                <h2 className="modalHeader">
                    {snacksChoosen === 0 ? "Wybierz co najmniej jeden box" : "Musisz skompletować całkowitą liczbę boxów"}
                </h2>
                <section className="modal__buttons">
                    <button className="modal__btn" onClick={() => { setModalWarning(false) }}>
                        Wróć do zamówienia
                    </button>
                </section>
            </Modal>


            {loaded ? <><section className="singleProduct__left">
                <button className="singleProduct__mainImage" onClick={() => { setPhotoIndex(indexAtMain); setGalleryOpen(true); }}>
                    <img className="singleProduct__img" src={images[indexAtMain]} alt="produkt" />
                </button>

                <section className="singleProduct__images">
                    {gallery1 ? <img className="singleProduct__img" src={images[indexAt1]} alt="produkt" onClick={() => { switchMainImage(indexAt1); }} /> : ""}
                    {gallery2 ? <img className="singleProduct__img" src={images[indexAt2]} alt="produkt" onClick={() => { switchMainImage(indexAt2); }} /> : ""}
                    {gallery3 ? <img className="singleProduct__img" src={images[indexAt3]} alt="produkt" onClick={() => { switchMainImage(indexAt3); }} /> : ""}

                </section>

            </section>
                <section className="singleProduct__right singleProduct__right--banquet">
                    <section className="singleProduct__right__header">
                        <h1 className="singleProduct__title">
                            Menu bankietowe
                        </h1>
                    </section>
                    <section className="section--banquet">
                        <section className="row row--banquetFirst">
                            <label className="label--banquet">
                                Liczba skompletowanych boxów: <b className="banquet--big">{snacksChoosen / 50}</b>
                            </label>
                            <label className="label--banquet">
                                Cena: <b className="banquet--big">{price} PLN</b>
                            </label>
                        </section>
                    </section>
                    <section className="section--banquet">
                        {products?.map((item, index) => (
                            <section className="banquet__product">
                                <section className="row">
                                    <button className="banquet__product__title"
                                        onClick={() => { accordion[index] ? hideSection() : handleAccordion(index); }}
                                    >
                                        {item.name?.split("/")[0]}
                                    </button>
                                    <label className="banquet__select--amount">
                                        Ilość
                                        <select className="section--banquet__select"
                                                value={productInfo[index]?.amount}
                                                onChange={(e) => { changeAmount(index, e.target.value); }}
                                        >
                                            <option value={0}>0</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                        </select>
                                    </label>
                                    <label className={productInfo[index]?.amount !== 0 ? "panelContent__filters__btnWrapper banquet__btn" : "panelContent__filters__btnWrapper banquet__btn btn--disabled"}>
                                        <button className="panelContent__filters__btn panelContent__filters__btn--options"
                                                disabled={productInfo[index]?.amount === 0}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    changeSelected25(index);
                                        }}>
                                            <span className={productInfo[index]?.selected25 ? "panelContent__filters__btn--active" : "d-none"} />
                                        </button>
                                        25 szt.
                                    </label>
                                    <label className={productInfo[index]?.amount !== 0 ? "panelContent__filters__btnWrapper banquet__btn" : "panelContent__filters__btnWrapper banquet__btn btn--disabled"}>
                                        <button className="panelContent__filters__btn panelContent__filters__btn--options"
                                                disabled={productInfo[index]?.amount === 0}
                                                onClick={(e) => { e.preventDefault();
                                            changeSelected50(index);
                                        }}>
                                            <span className={productInfo[index]?.selected50 ? "panelContent__filters__btn--active" : "d-none"} />
                                        </button>
                                        50 szt.
                                    </label>
                                </section>

                                <section className={accordion[index] ? "banquet__hiddenSection" : "banquet__hiddenSection banquet__hiddenSection--hidden"}>
                                    <h2 className="singleProduct__price">
                                        <span className="singleProduct__price--small">Cena za przekąskę przy zakupie 25 sztuk: </span> {(item.price_25 / 25, 2).toFixed(2)} PLN
                                    </h2>
                                    <h2 className="singleProduct__price marginTop20">
                                        <span className="singleProduct__price--small">Cena za przekąskę przy zakupie 50 sztuk: </span> {(item.price_50 / 50).toFixed(2)} PLN
                                    </h2>
                                    <p dangerouslySetInnerHTML={{__html: item.short_description?.split("---")[0]}}>

                                    </p>
                                    {allergens ? <div className="singleProduct__options singleProduct__options--allergens">
                                        <h3 className="singleProduct__options__header marginRight15">
                                            Alergeny:
                                        </h3>
                                        {allergens.map((item, index) => {
                                            const allergen = allergensList.findIndex(itemOnTheList => {
                                                return itemOnTheList === item.allergen;
                                            });
                                            if((allergen)||(allergen === 0)) {
                                                return <>
                                                    <img className="allergensImg allergensImg--client"
                                                         src={allergensImg[allergen]}
                                                         data-tip
                                                         data-for={`id${index}`}
                                                         alt="alergen" />
                                                    <ReactTooltip id={`id${index}`} type='dark' effect='float'>
                                                        {item.allergen.split("/")[0]}
                                                    </ReactTooltip>
                                                </>
                                            }
                                        })}
                                    </div> : ""}

                                    <button className="button--hide" onClick={() => { hideSection() }}>
                                        Zwiń
                                        <img className="button--hide__img" src={arrow} alt="zwin" />
                                    </button>
                                </section>
                            </section>
                        ))}
                    </section>

                    <section className="singleProduct__options">
                        <button className="button button--addToCart button--landing" onClick={() => { addToCart(product.id) }}>
                            Dodaj do koszyka
                        </button>
                    </section>
                </section></> : <main className="loading">
                <Loader
                    type="puff"
                    color="#000"
                    width={100}
                    height={100}
                />
            </main>}

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
    </>
}

export default CustomMenuContent;
