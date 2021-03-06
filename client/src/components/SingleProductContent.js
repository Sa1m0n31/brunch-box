import React, {useEffect, useRef, useState} from 'react'

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import { editCart } from "../helpers/editCart";
import Modal from 'react-modal'
import closeImg from '../static/img/close.png'
import tickImg from '../static/img/tick-sign.svg'
import arrowDown from '../static/img/caret_down.svg'

import { useLocation } from "react-router";
import {getImageById, getProductAllergens, getProductByName, getSingleProduct} from "../helpers/productFunctions";
import settings from "../admin/helpers/settings";
import {allergensImg, allergensList} from "../helpers/allergens";
import ReactTooltip from 'react-tooltip'
import Loader from "react-loader-spinner";
import {areShopOpen} from "../helpers/openCloseAlgorithm";

const SingleProductContent = () => {
    const [size, setSize] = useState("L");
    const [product, setProduct] = useState({});
    const [option, setOption] = useState("Mieszana");
    const [photoIndex, setPhotoIndex] = useState(0);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [price, setPrice] = useState(0);
    const [longDesc, setLongDesc] = useState(false);
    const [currentDesc, setCurrentDesc] = useState("");
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
    const [modalHint, setModalHint] = useState(false);

    const [shopOpen, setShopOpen] = useState(true);

    const location = useLocation();

    const images = [
        settings.API_URL + "/image?url=/media/" + mainImage,
        settings.API_URL + "/image?url=/media/" + gallery1,
        settings.API_URL + "/image?url=/media/" + gallery2,
        settings.API_URL + "/image?url=/media/" + gallery3
    ];

    const imagesConst = {
        meatM: settings.API_URL + "/image?url=/media/" + mainImage,
        meatL: settings.API_URL + "/image?url=/media/" + gallery1,
        vegeM: settings.API_URL + "/image?url=/media/" + gallery2,
        vegeL: settings.API_URL + "/image?url=/media/" + gallery3,
    }

    const getProductIdByURL = (name) => {
        const newName = name[name.length-1].replace(/-/g, " ");
        return getProductByName(newName);
    }

    useEffect(() => {
        let id;
        if(location.state) {
            /* Get there by website */
            id = location.state.id;
            getSingleProduct(id)
                .then(res => {
                    console.log(res);
                    if(res?.data?.result) {
                        setProduct(res.data.result[0]);
                        setOption(res.data.result[0].meat ? "Mieszana" : "Wegetaria??ska");
                        setMainImage(res.data.result[0].file_path);
                        setPrice(res.data.result[0].meat ? res.data.result[0].price_l_meat : res.data.result[0].price_l_vege);
                        setCurrentDesc(res.data.result[0].meat_description);
                        /* Get gallery */
                        getImageById(res.data.result[0].gallery_1)
                            .then(res => {
                                setGallery1(res.data.result.file_path);
                            });
                        getImageById(res.data.result[0].gallery_2)
                            .then(res => {
                                setGallery2(res.data.result.file_path);
                            });
                        getImageById(res.data.result[0].gallery_3)
                            .then(res => {
                                setGallery3(res.data.result.file_path);
                            });
                    }
                    setLoaded(true);
                });
            getProductAllergens(id)
                .then(res => {
                    setAllergens(res.data.result);
                });
        }
        else {
            /* Get there by link */
            getProductIdByURL(window.location.pathname.split("/"))
                .then(res => {
                    console.log(res.data);
                    id = res.data.result[0]?.id
                })
                .then(() => {
                    console.log(id);
                    getSingleProduct(id)
                        .then(res => {
                            setProduct(res.data.result[0]);
                            setOption(res.data.result[0].meat ? "Mieszana" : "Wegetaria??ska");
                            setMainImage(res.data.result[0].file_path);
                            setPrice(res.data.result[0].meat ? res.data.result[0].price_l_meat : res.data.result[0].price_l_vege);
                            setCurrentDesc(res.data.result[0].meat_description);
                            /* Get gallery */
                            getImageById(res.data.result[0].gallery_1)
                                .then(res => {
                                    setGallery1(res.data.result.file_path);
                                });
                            getImageById(res.data.result[0].gallery_2)
                                .then(res => {
                                    setGallery2(res.data.result.file_path);
                                });
                            getImageById(res.data.result[0].gallery_3)
                                .then(res => {
                                    setGallery3(res.data.result.file_path);
                                });
                            setLoaded(true);
                        });
                    getProductAllergens(id)
                        .then(res => {
                            setAllergens(res.data.result);
                        });
                });
        }
    }, []);

    useEffect(() => {
        if(option === "Mieszana") {
            if(size === "M") setCurrentDesc(product.meat_description_m);
            else setCurrentDesc(product.meat_description);
        }
        else {
            if(size === "M") setCurrentDesc(product.vege_description_m);
            else setCurrentDesc(product.vege_description);
        }

        if((size === "M")&&(option === "Mieszana")) {
            setPrice(product.price_m_meat);
            switchMainImage(0);
        }
        else if((size === "L")&&(option === "Mieszana")) {
            setPrice(product.price_l_meat);
            switchMainImage(1);
        }
        else if((size === "M")&&(option === "Wegetaria??ska")) {
            setPrice(product.price_m_vege);
            switchMainImage(2);
        }
        else if((size === "L")&&(option === "Wegetaria??ska")) {
            setPrice(product.price_l_vege);
            switchMainImage(3);
        }
    }, [size, option]);

    const addToCart = (id, option, size) => {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        const currentDayOfTheWeek = currentDate.getDay();

        const shopOpenAlgorithm = areShopOpen();
        if(shopOpenAlgorithm) {
            shopOpenAlgorithm
                .then((res) => {
                    const result = res.data.result;
                    result.findIndex((item) => {
                        if((new Date(item.day).getDate() === new Date().getDate()+1)&&(item.hour_start === currentHour)) {
                            setShopOpen(false);
                        }
                    })
                });
        }
        else {
            setShopOpen(false);
        }

        if(product.category_id === 2) {
            /* Check number of half boxes in current cart */
            const currentCart = JSON.parse(localStorage.getItem('sec-cart'));
            let numberOfHalfs = 0;
            if(currentCart) {
                currentCart.forEach((item, index, array) => {
                    if(item.size === "1/2 boxa") {
                        numberOfHalfs += item.quantity;
                    }

                    if(index === array.length-1) {
                        if((numberOfHalfs % 2 === 0)&&(size === "1/2 boxa")) {
                            setModalHint(true);
                            editCart(id, option, size === "M" ? "1/2 boxa" : size, 1);
                        }
                        else {
                            setModalHint(false);
                            editCart(id, option, size === "M" ? "1/2 boxa" : size, 1);
                        }
                    }
                });
            }
            else {
                if(size === "M") setModalHint(true);
                editCart(id, option, size === "M" ? "1/2 boxa" : size, 1);
            }
        }
        else {
            editCart(id, option, size, 1);
        }
        setModal(true);
    }

    const toggleDescription = () => {
        setLongDesc(!longDesc);
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
            <h2 className={modalHint ? "modalHeader modalHeader--smaller" : "modalHeader"}>
                {!modalHint ? "Produkt zosta?? dodany do koszyka" : "Po??owa boxa zosta??a dodana do koszyka. Uzupe??nij sw??j box o drug?? po????wk??."}
            </h2>
            <section className="modal__buttons">
                {!modalHint ? <>
                    <button className="modal__btn" onClick={() => { setModal(false) }}>
                        Kontynuuj zakupy
                    </button>
                    <button className="modal__btn" onClick={() => { window.location = "/koszyk" }}>
                        Przejd?? do kasy
                    </button>
                </> : <a href="https://brunchbox.pl/przekaski-dla-grup" className="modal__btn">
                    Wybierz drug?? po??ow??
                </a>}
            </section>

            {!shopOpen ? <p className="shopClosedText">
                Przepraszamy. Nie prowadzimy w tej chwili dostaw. Wci???? mo??esz zaplanowa?? dostaw?? w trakcie godzin naszej pracy.
                Zapraszamy do zak??adki <a href="/kontakt">Kontakt</a> po wi??cej informacji lub pod tel. 696-696-995.
            </p> : ""}
        </Modal>


            {loaded ? <><section className="singleProduct__left">
                    <button className="singleProduct__mainImage" onClick={() => { setPhotoIndex(indexAtMain); setGalleryOpen(true); }}>
                        <img className="singleProduct__img" src={images[indexAtMain]} alt="produkt" />
                    </button>

                    <section className="singleProduct__images">
                        <img className="singleProduct__img" src={images[indexAt1]} alt="produkt" onClick={() => { switchMainImage(indexAt1); }} />
                        <img className="singleProduct__img" src={images[indexAt2]} alt="produkt" onClick={() => { switchMainImage(indexAt2); }} />
                        <img className="singleProduct__img" src={images[indexAt3]} alt="produkt" onClick={() => { switchMainImage(indexAt3); }} />
                    </section>

                </section>
                <section className="singleProduct__right">
                    <section className="singleProduct__right__header">
                        <h1 className="singleProduct__title">
                            {product.name.split("/")[0]}
                            <span className="thin singleProduct__title--cursive">
                        {product.bracket_name.split("/")[0]}
                    </span>
                        </h1>
                        <h2 className="singleProduct__price">
                            {price} PLN
                        </h2>
                    </section>

                    <div className="singleProduct__description" dangerouslySetInnerHTML={{__html: product.short_description?.split("---")[0]?.replace(/&nbsp;/g, " ")}}>
                    </div>

                    <div className="singleProduct__parts" dangerouslySetInnerHTML={{__html: currentDesc.split("---")[0]}}>

                    </div>

                    <section className="singleProduct__bottom">
                        <button className="singleProduct__bottom__btn button--landing" onClick={() => { toggleDescription() }}>
                            {longDesc ? "Zwi??" : "Zobacz"} pe??ny opis produktu
                            <img className={longDesc ? "arrowDown rotate180" : "arrowDown"} src={arrowDown} alt="na-dol" />
                        </button>

                        <main className={longDesc ? "singleProduct__longDesc" : "o-0"} dangerouslySetInnerHTML={{__html: product.long_description?.split("---")[0]?.replace(/&nbsp;/g, " ")}}>

                        </main>
                    </section>

                    {product.l && product.m ? <div className="singleProduct__options">
                        <h3 className="singleProduct__options__header">
                            Dost??pne rozmiary:
                        </h3>
                        <div className="singleProduct__options__buttons">
                            <button className={size === "M" || size === "1/2 boxa" ? "singleProduct__options__btn singleProduct--checked" : "singleProduct__options__btn"}
                                    onClick={() => setSize(product.category_id === 2 ? "1/2 boxa" : "M")}>
                                {product.category_id === 2 ? "1/2 boxa" : "M"}
                            </button>
                            <button className={size === "Ca??y box" || size === "L" ? "singleProduct__options__btn singleProduct--checked" : "singleProduct__options__btn"}
                                    onClick={() => setSize(product.category_id === 2 ? "Ca??y box" : "L")}>
                                {product.category_id === 2 ? "Ca??y box" : "L"}
                            </button>
                        </div>
                    </div> : ""}
                    {product.vege && product.meat ? <div className="singleProduct__options">
                        <h3 className="singleProduct__options__header">
                            Dost??pne opcje:
                        </h3>
                        <section className="singleProduct__options__buttons singleProduct__options__buttons--lower">
                            <button className={option === "Mieszana" ? "singleProduct__options__btn singleProduct--checked" : "singleProduct__options__btn"}
                                    onClick={() => setOption("Mieszana")}
                            >
                                Mieszana
                            </button>
                            <button className={option === "Wegetaria??ska" ? "singleProduct__options__btn singleProduct--checked" : "singleProduct__options__btn"}
                                    onClick={() => setOption("Wegetaria??ska")}
                            >
                                Wegetaria??ska
                            </button>
                        </section>
                    </div> : ""}

                    {allergens.length ? <div className="singleProduct__options singleProduct__options--allergens">
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

                    <section className="singleProduct__options marginTop20">
                        <button className="button button--addToCart button--landing" onClick={() => { addToCart(product.id, option, size) }}>
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
        {/*<section className="singleProduct__bottom">*/}
        {/*    <button className="singleProduct__bottom__btn button--landing" onClick={() => { toggleDescription() }}>*/}
        {/*        {longDesc ? "Zwi??" : "Zobacz"} pe??ny opis produktu*/}
        {/*        <img className={longDesc ? "arrowDown rotate180" : "arrowDown"} src={arrowDown} alt="na-dol" />*/}
        {/*    </button>*/}

        {/*    <main className={longDesc ? "singleProduct__longDesc" : "o-0"} dangerouslySetInnerHTML={{__html: product.long_description?.split("---")[0]?.replace(/&nbsp;/g, " ")}}>*/}

        {/*    </main>*/}
        {/*</section>*/}
        </>
}

export default SingleProductContent;
