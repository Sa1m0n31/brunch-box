import React, { useEffect, useState, useRef } from 'react'

import {addAllergens, getNewId, getProductDetails} from "../helpers/productFunctions";
import { useLocation } from "react-router";
import {getAllCategories} from "../helpers/categoriesFunctions";

import gluten from '../static/img/allergens/gluten.png'
import grzyby from '../static/img/allergens/grzyby.png'
import jajka from '../static/img/allergens/jajka.png'
import kukurydza from '../static/img/allergens/kukurydza.png'
import lubin from '../static/img/allergens/lubin.png'
import mieczaki from '../static/img/allergens/mieczaki.png'
import mleko from '../static/img/allergens/mleko.png'
import musztarda from '../static/img/allergens/musztarda.png'
import orzechy from '../static/img/allergens/orzechy.png'
import orzechyZiemne from '../static/img/allergens/orzechy-ziemne.png'
import ryba from '../static/img/allergens/ryba.png'
import seler from '../static/img/allergens/seler.png'
import sezam from '../static/img/allergens/sezam.png'
import siarka from '../static/img/allergens/siarka.png'
import skorupiaki from '../static/img/allergens/skorupiaki.png'
import soja from '../static/img/allergens/soja.png'

import JoditEditor from 'jodit-react';
import ReactTooltip from "react-tooltip";
import {getProductGallery} from "../../helpers/productFunctions";
import settings from "../helpers/settings";

const AddProductContent = () => {
    const editorR = useRef(null);

    const allergensImg = [gluten, grzyby, jajka, kukurydza, lubin, mieczaki, mleko, musztarda, orzechy, orzechyZiemne, ryba, seler,
        sezam, siarka, skorupiaki, soja];
    const allergensNames = ['gluten', 'grzyby', 'jajka', 'kukurydza', 'łubin', 'mięczaki', 'mleko', 'musztarda', 'orzechy', 'brokół', 'ryba', 'seler',
        'sezam', 'siarka', 'skorupiaki', 'soja'];

    const [update, setUpdate] = useState(false);
    const [name, setName] = useState("");
    const [bracket, setBracket] = useState("");
    const [id, setId] = useState(0);
    const [categoryId, setCategoryId] = useState(1); // 1 - Oferta indywidualna, 2 - Menu grupowe, 3 - Menu bankietowe
    const [currentCat, setCurrentCat] = useState(0);
    const [product, setProduct] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allergies, setAllergies] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [hidden, setHidden] = useState(false);
    const [gallery, setGallery] = useState([0, 0, 0, 0, 0, 0]);
    const [priority, setPriority] = useState(0);

    /* Prices */
    const [priceMMeat, setPriceMMeat] = useState("");
    const [priceLMeat, setPriceLMeat] = useState("");
    const [priceMWege, setPriceMWege] = useState(null);
    const [priceLWege, setPriceLWege] = useState(null);
    const [priceSWege, setPriceSWege] = useState(null);
    const [priceSMeat, setPriceSMeat] = useState(null);

    /* Descriptions */
    const [shortDescription, setShortDescription] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [meatDescription, setMeatDescription] = useState("");
    const [vegeDescription, setVegeDescription] = useState("");
    const [meatDescriptionM, setMeatDescriptionM] = useState("");
    const [vegeDescriptionM, setVegeDescriptionM] = useState("");
    const [meatDescriptionS, setMeatDescriptionS] = useState("");
    const [vegeDescriptionS, setVegeDescriptionS] = useState("");

    /* Options */
    const [optionMeat, setOptionMeat] = useState(true);
    const [optionWege, setOptionWege] = useState(false);
    const [sizeM, setSizeM] = useState(true);
    const [sizeL, setSizeL] = useState(false);
    const [sizeS, setSizeS] = useState(false);

    const [addMsg, setAddMsg] = useState("");

    const [deleteImg0, setDeleteImg0] = useState(false);
    const [deleteImg1, setDeleteImg1] = useState(false);
    const [deleteImg2, setDeleteImg2] = useState(false);
    const [deleteImg3, setDeleteImg3] = useState(false);
    const [deleteImg4, setDeleteImg4] = useState(false);
    const [deleteImg5, setDeleteImg5] = useState(false);

    const allergensList = ["gluten/gluten", "grzyby/mushrooms", "jajka/eggs",
        "kukurydza/corn", "łubin/lupin", "mięczaki/mollusca",
        "mleko/milk", "musztarda/mustard", "orzechy/nuts",
        "brokuł/broccoli", "ryba/fish",
        "seler/celery", "sezam/sesame", "siarka/sulphur",
        "skorupiaki/shellfish", "soja/soya"];

    const location = useLocation();

    useEffect(() => {
        /* PRODUCT ADDED */
        const added = parseInt(new URLSearchParams(location.search).get("add"));
        if(added) {
            if(added === 1) {
                setAddMsg("Produkt został dodany");
                /* Add allergens */
                addAllergens(parseInt(localStorage.getItem('sec-product-id')), JSON.parse(localStorage.getItem('sec-allergens-to-add')))
                    .then(res => {
                        localStorage.removeItem('sec-product-id');
                        localStorage.removeItem('sec-allergens-to-add');
                    });
            }
            else if(added === 0) {
                setAddMsg("Nie udało się dodać produktu. Prosimy spróbować później lub skontaktować się z administratorem systemu");
            }
        }

        getAllCategories()
            .then(res => {
                setCategories(res.data.result);
            });

        /* UPDATE PRODUCT MODE */
        const param = parseInt(new URLSearchParams(location.search).get("id"));
        if(param) {
            setId(param);
            setUpdate(true);

            getProductDetails(param)
                .then(async res => {
                    await setProduct(res.data.result[0]);
                    await setInitialValues(res.data.result[0]);
                    setInitialAllergens(res.data.result);
                });

            getProductGallery(param)
                .then(res => {
                    console.log(res.data.result);
                    setGallery(res.data?.result);
                });
        }
        else {
            getNewId()
                .then(res => {
                   setId(res.data.result+1);
                });
        }
    }, []);

    const setInitialAllergens = (allergensData) => {
        let newAllergies = allergies;
        allergensList.forEach((nameItem, nameIndex) => {
            allergensData.forEach((dataItem) => {
                if(nameItem === dataItem.allergen) {
                    newAllergies = newAllergies.map((item, index) => {
                        if(index === nameIndex) return 1;
                        else return item;
                    });
                    setAllergies(newAllergies);
                }
            });
        })
    }

    const setInitialValues = (productData) => {
        setName(productData.name);
        setBracket(productData.bracket_name);

        setOptionMeat(productData.meat);
        setOptionWege(productData.vege);

        setSizeL(productData.l);
        setSizeM(productData.m);
        setSizeS(productData.s);

        setPriceMMeat(productData.price_m_meat);
        setPriceLMeat(productData.price_l_meat);
        setPriceMWege(productData.price_m_vege);
        setPriceLWege(productData.price_l_vege);
        setPriceSMeat(productData.price_s_meat);
        setPriceSWege(productData.price_s_wege);

        setCategoryId(productData.category_id);
        setHidden(productData.hidden);
        setPriority(productData.priority);

        setShortDescription(productData.short_description);
        setLongDescription(productData.long_description);
        setMeatDescription(productData.meat_description);
        setVegeDescription(productData.vege_description);
        setMeatDescriptionM(productData.meat_description_m);
        setVegeDescriptionM(productData.vege_description_m)
        setMeatDescriptionS(productData.meat_description_s);
        setVegeDescriptionS(productData.vege_description_s);
    }

    const handleSubmit = (e) => {
        /* Add allergens to local storage */
        const allergensToAdd = allergensList.filter((item, index) => {
            return allergies[index];
        });
        localStorage.setItem('sec-allergens-to-add', JSON.stringify(allergensToAdd));
        localStorage.setItem('sec-product-id', id.toString());
    }

    const toggleAllergies = (e, i) => {
        e.preventDefault();
        const newAllergies = allergies.map((item, index) => {
           if(index === i) {
               if (item === 0) return 1;
               else return 0;
           }
           else return item;
        });
        setAllergies(newAllergies);
    }

    useEffect(() => {
        if(categoryId !== 3) setSizeM(true);
        else {
            setSizeL(true);
        }
    }, [categoryId]);

    return <main className="panelContent addProduct">
        <header className="addProduct__header">
            <h1 className="addProduct__header__h">
                Edycja produktu
            </h1>
        </header>
        {addMsg === "" ? <form className="addProduct__form addProduct__form--addProduct"
                               encType="multipart/form-data"
                               onSubmit={(e) => { handleSubmit(e) }}
                               action={update ? "https://brunchbox.pl/product/update-product" : "https://brunchbox.pl/product/add-product"}
                               method="POST"
        >
            <section className="addProduct__form__section">
                <input className="invisibleInput"
                       name="id"
                       value={id} />

                <label className="addProduct__label">
                    <input className="addProduct__input"
                           name="name"
                           value={name}
                           onChange={(e) => { setName(e.target.value) }}
                           placeholder="Nazwa produktu" />
                </label>
                <label className="addProduct__label">
                    <input className="addProduct__input"
                           name="bracketName"
                           value={bracket}
                           onChange={(e) => { setBracket(e.target.value) }}
                           placeholder="Nazwa w nawiasie" />
                </label>

                {/* PRICES */}
                {categoryId === 1 || categoryId === 2 ? <>
                    <label className={sizeS && optionMeat ? "addProduct__label" : "addProduct__input--invisible"}>
                        Cena dla rozmiaru S - opcja Mieszana (domyślna)
                        <input className={sizeS && optionMeat ? "addProduct__input" : "addProduct__input--invisible"}
                               name="priceS_meat"
                               type="number"
                               step={0.01}
                               value={priceSMeat}
                               onChange={(e) => { setPriceSMeat(e.target.value) }}
                               placeholder="Cena dla rozmiaru S - opcja Mieszana (domyślna)" />
                    </label>
                    <label className={sizeM && optionMeat ? "addProduct__label" : "addProduct__input--invisible"}>
                        Cena dla rozmiaru M - opcja Mieszana (domyślna)
                        <input className={sizeM && optionMeat ? "addProduct__input" : "addProduct__input--invisible"}
                               name="priceM_meat"
                               type="number"
                               step={0.01}
                               value={priceMMeat}
                               onChange={(e) => { setPriceMMeat(e.target.value) }}
                               placeholder="Cena dla rozmiaru M - opcja Mieszana (domyślna)" />
                    </label>
                    <label className={sizeL && optionMeat ? "addProduct__label" : "addProduct__input--invisible"}>
                        Cena dla rozmiaru L - opcja Mieszana (domyślna)
                        <input className={sizeL && optionMeat ? "addProduct__input" : "addProduct__input--invisible"}
                               name="priceL_meat"
                               type="number"
                               step={0.01}
                               value={priceLMeat}
                               onChange={(e) => { setPriceLMeat(e.target.value) }}
                               placeholder="Cena dla rozmiaru L - opcja Mieszana (domyślna)" />
                    </label>

                    <label className={sizeS && optionWege ? "addProduct__label" : "addProduct__input--invisible"}>
                        Cena dla rozmiaru S - opcja wege
                        <input className={sizeS && optionWege ? "addProduct__input" : "addProduct__input--invisible"}
                               name="priceS_wege"
                               type="number"
                               step={0.01}
                               value={priceSWege}
                               onChange={(e) => { setPriceSWege(e.target.value) }}
                               placeholder="Cena dla rozmiaru S - opcja wege" />
                    </label>
                    <label className={sizeM && optionWege ? "addProduct__label" : "addProduct__input--invisible"}>
                        Cena dla rozmiaru M - opcja wege
                        <input className={sizeM && optionWege ? "addProduct__input" : "addProduct__input--invisible"}
                               name="priceM_vege"
                               type="number"
                               step={0.01}
                               value={priceMWege}
                               onChange={(e) => { setPriceMWege(e.target.value) }}
                               placeholder="Cena dla rozmiaru M - opcja wege" />
                    </label>
                    <label className={sizeL && optionWege ? "addProduct__label" : "addProduct__input--invisible"}>
                        Cena dla rozmiaru L - opcja wege
                        <input className={sizeL && optionWege ? "addProduct__input" : "addProduct__input--invisible"}
                               name="priceL_vege"
                               type="number"
                               step={0.01}
                               value={priceLWege}
                               onChange={(e) => { setPriceLWege(e.target.value) }}
                               placeholder="Cena dla rozmiaru L - opcja wege" />
                    </label>
                </> : <>
                    <label className={sizeM && optionMeat ? "addProduct__label" : "addProduct__input--invisible"}>
                        <input className={sizeM && optionMeat ? "addProduct__input" : "addProduct__input--invisible"}
                               name="priceM_meat"
                               type="number"
                               step={0.01}
                               value={priceMMeat}
                               onChange={(e) => { setPriceMMeat(e.target.value) }}
                               placeholder="Cena dla 25 sztuk" />
                    </label>
                    <label className={sizeL && optionMeat ? "addProduct__label" : "addProduct__input--invisible"}>
                        <input className={sizeL && optionMeat ? "addProduct__input" : "addProduct__input--invisible"}
                               name="priceL_meat"
                               type="number"
                               step={0.01}
                               value={priceLMeat}
                               onChange={(e) => { setPriceLMeat(e.target.value) }}
                               placeholder="Cena dla 50 sztuk" />
                    </label>
                </>}

                <select className="addProduct__categorySelect"
                        name="categoryId"
                        value={categoryId}
                        onChange={(e) => {
                            setCategoryId(parseInt(e.target.value));
                        }}>
                    {categories.map((item, index) => {
                        return <option key={index} value={index+1}>{item.name}</option>
                    })}
                </select>


                <label className="jodit--label">
                    <span>Krótki opis</span>
                    <JoditEditor
                        name="shortDescription"
                        ref={editorR}
                        value={shortDescription}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                        onChange={newContent => { setShortDescription(newContent) }}
                    />
                </label>

                {categoryId !== 3 ? <label className="jodit--label">
                    <span>Długi opis</span>
                    <JoditEditor
                        name="longDescription"
                        ref={editorR}
                        value={longDescription}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                        onChange={newContent => { setLongDescription(newContent) }}
                    />
                </label> : ""}

                <label className="fileInputLabel">
                    <span>Zdjęcie produktu {categoryId === 1 ? "(opcja Mieszana M)" : ""}</span>
                    <input type="file"
                           className="product__fileInput"
                           name="mainImage" />
                    {gallery.length && gallery[0] && !deleteImg0 ? <section className="miniature">
                        <button className="miniature__deleteBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteImg0(true); }}>
                            x
                        </button>
                        <img className="miniature__img" src={`${settings.API_URL}/image?url=/media/${gallery[0]}`} alt="zdjecie-produktu" />
                    </section> : ""}
                </label>
                <label className="fileInputLabel">
                    <span>Zdjęcie produktu {categoryId === 1 ? "(opcja Mieszana L)" : ""}</span>
                    <input type="file"
                           className="product__fileInput"
                           name="gallery1" />
                    {gallery.length && gallery[1] && !deleteImg1 ? <section className="miniature">
                        <button className="miniature__deleteBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteImg1(true); }}>
                            x
                        </button>
                        <img className="miniature__img" src={`${settings.API_URL}/image?url=/media/${gallery[1]}`} alt="zdjecie-produktu" />
                    </section> : ""}
                </label>
                <label className="fileInputLabel">
                    <span>Zdjęcie produktu {categoryId === 1 ? "(opcja Mieszana S)" : ""}</span>
                    <input type="file"
                           className="product__fileInput"
                           name="gallery4" />
                    {gallery.length && gallery[0] && !deleteImg0 ? <section className="miniature">
                        <button className="miniature__deleteBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteImg4(true); }}>
                            x
                        </button>
                        <img className="miniature__img" src={`${settings.API_URL}/image?url=/media/${gallery[4]}`} alt="zdjecie-produktu" />
                    </section> : ""}
                </label>

                <label className="fileInputLabel">
                    <span>Zdjęcie produktu {categoryId === 1 ? "(opcja wege M)" : ""}</span>
                    <input type="file"
                           className="product__fileInput"
                           name="gallery2" />
                    {gallery.length && gallery[2] && !deleteImg2 ? <section className="miniature">
                        <button className="miniature__deleteBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteImg2(true); }}>
                            x
                        </button>
                        <img className="miniature__img" src={`${settings.API_URL}/image?url=/media/${gallery[2]}`} alt="zdjecie-produktu" />
                    </section> : ""}
                </label>

                <label className="fileInputLabel">
                    <span>Zdjęcie produktu {categoryId === 1 ? "(opcja wege L)" : ""}</span>
                    <input type="file"
                           className="product__fileInput"
                           name="gallery3" />
                    {gallery.length && gallery[3] && !deleteImg3 ? <section className="miniature">
                        <button className="miniature__deleteBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteImg3(true); }}>
                            x
                        </button>
                        <img className="miniature__img" src={`${settings.API_URL}/image?url=/media/${gallery[3]}`} alt="zdjecie-produktu" />
                    </section> : ""}
                </label>
                <label className="fileInputLabel">
                    <span>Zdjęcie produktu {categoryId === 1 ? "(opcja wege S)" : ""}</span>
                    <input type="file"
                           className="product__fileInput"
                           name="gallery5" />
                    {gallery.length && gallery[5] && !deleteImg5 ? <section className="miniature">
                        <button className="miniature__deleteBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteImg5(true); }}>
                            x
                        </button>
                        <img className="miniature__img" src={`${settings.API_URL}/image?url=/media/${gallery[5]}`} alt="zdjecie-produktu" />
                    </section> : ""}
                </label>

                <input className="invisibleInput"
                       name="deleteImg0"
                       value={deleteImg0 ? "true" : ""} />
                <input className="invisibleInput"
                       name="deleteImg1"
                       value={deleteImg1 ? "true" : ""} />
                <input className="invisibleInput"
                       name="deleteImg2"
                       value={deleteImg2 ? "true" : ""} />
                <input className="invisibleInput"
                       name="deleteImg3"
                       value={deleteImg3 ? "true" : ""} />
                <input className="invisibleInput"
                       name="deleteImg4"
                       value={deleteImg4 ? "true" : ""} />
                <input className="invisibleInput"
                       name="deleteImg5"
                       value={deleteImg5 ? "true" : ""} />
            </section>

            <section className="addProduct__form__section">

                {categoryId === 1 || categoryId === 2 ?  <section className="addProduct__form__subsection addProduct__form__subsection--marginLeft">
                    <h4 className="addProduct__form__subsection__header">
                        Dostępne opcje
                    </h4>
                    <label className="panelContent__filters__btnWrapper">
                        <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => { e.preventDefault(); setOptionMeat(!optionMeat); }}>
                            <span className={optionMeat ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        Mieszana (domyślna)
                    </label>
                    <label>
                        <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => { e.preventDefault(); setOptionWege(!optionWege) }}>
                            <span className={optionWege ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        Wegetariańska
                    </label>
                </section> : ""}

                <section className="addProduct__form__subsection addProduct__form__subsection--marginLeft marginTop30">
                    <h4 className="addProduct__form__subsection__header">
                        Dostępne rozmiary
                    </h4>
                    <label className="panelContent__filters__btnWrapper panelContent__filters__btn--options">
                        <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => {
                            e.preventDefault();
                            setSizeM(!sizeM);
                        }}>
                            <span className={sizeM ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        {categoryId === 3 ? "25 szt." : "M"}
                    </label>
                    <label className="panelContent__filters__btnWrapper panelContent__filters__btn--options">
                        <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => { e.preventDefault(); setSizeL(!sizeL); }}>
                            <span className={sizeL ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        {categoryId === 3 ? "50 szt." : "L"}
                    </label>
                    {categoryId !== 3 ? <label className="panelContent__filters__btnWrapper panelContent__filters__btn--options">
                        <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => { e.preventDefault(); setSizeS(!sizeS); }}>
                            <span className={sizeS ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        S
                    </label> : ""}
                </section>


                {/* Hidden inputs */}
                <input className="input--hidden"
                       name="meat"
                       value={optionMeat} />
                <input className="input--hidden"
                       name="vegan"
                       value={optionWege} />
                <input className="input--hidden"
                       name="m"
                       value={sizeM} />
                <input className="input--hidden"
                       name="l"
                       value={sizeL} />
                <input className="input--hidden"
                       name="s"
                       value={sizeS} />

                <label>
                    <p className="text-center">Zaznacz alergeny</p>
                    <section className="addProduct__allergies">
                        {allergensImg.map((item, index) => (
                            <button className={allergies[index] ? "addProduct__allergies__item allergiesChecked" : "addProduct__allergies__item"}
                                    key={index}
                                    onClick={(e) => { toggleAllergies(e, index) }}
                                    data-tip
                                    data-for={`id${index}`}
                            >
                                <ReactTooltip
                                    id={`id${index}`} type="dark" effect="float" >
                                    { allergensNames[index] }
                                </ReactTooltip>
                                <img className="allergensImg" src={item} alt="alergen" />
                            </button>
                        ))}
                    </section>
                </label>

                {categoryId !== 3 ? <>
                    <label className="jodit--label">
                        <span>Składniki produktu w wersji mieszanej L (domyślne)</span>
                        <JoditEditor
                            name="meatDescription"
                            value={meatDescription}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setMeatDescription(newContent) }}
                        />
                    </label>
                    <label className="jodit--label">
                        <span>Składniki produktu w wersji mieszanej M</span>
                        <JoditEditor
                            name="meatDescriptionM"
                            value={meatDescriptionM}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setMeatDescriptionM(newContent) }}
                        />
                    </label>
                    <label className="jodit--label">
                        <span>Składniki produktu w wersji mieszanej S</span>
                        <JoditEditor
                            name="meatDescriptionS"
                            value={meatDescriptionS}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setMeatDescriptionS(newContent) }}
                        />
                    </label>

                    <label className="jodit--label">
                        <span>Składniki produktu w wersji vege L</span>
                        <JoditEditor
                            name="vegeDescription"
                            value={vegeDescription}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setVegeDescription(newContent) }}
                        />
                    </label>
                    <label className="jodit--label">
                        <span>Składniki produktu w wersji vege M</span>
                        <JoditEditor
                            name="vegeDescriptionM"
                            value={vegeDescriptionM}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setVegeDescriptionM(newContent) }}
                        />
                    </label>
                    <label className="jodit--label">
                        <span>Składniki produktu w wersji vege S</span>
                        <JoditEditor
                            name="vegeDescriptionS"
                            value={vegeDescriptionS}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setVegeDescriptionS(newContent) }}
                        />
                    </label>
                </> : ""}

                <label className="panelContent__filters__label__label panelContent__filters__label__label--category">
                    <button className="panelContent__filters__btn" onClick={(e) => { e.preventDefault(); setHidden(!hidden); }}>
                        <span className={hidden ? "panelContent__filters__btn--active" : "d-none"} />
                    </button>
                    Ukryj produkt
                </label>

                <label className="label--priority">
                    Priorytet wyświetlania
                    <input className="input input--priority"
                           name="priority"
                           type="number"
                           value={priority}
                           onChange={(e) => { setPriority(e.target.value); }}
                           placeholder="Priorytet wyświetlania" />
                </label>

                <input className="invisibleInput"
                       value={hidden ? "hidden" : ""}
                       name="hidden" />
            </section>

            <section className="addProduct__btnWrapper">
                <button className="addProduct__btn" type="submit">
                    {update ? "Zaktualizuj produkt" : "Dodaj produkt"}
                </button>
            </section>
        </form> : <h2 className="addMsg">
            {addMsg}
        </h2> }
    </main>
}

export default AddProductContent;
