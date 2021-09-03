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

    /* Prices */
    const [priceMMeat, setPriceMMeat] = useState("");
    const [priceLMeat, setPriceLMeat] = useState("");
    const [priceMWege, setPriceMWege] = useState(null);
    const [priceLWege, setPriceLWege] = useState(null);

    /* Descriptions */
    const [shortDescription, setShortDescription] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [meatDescription, setMeatDescription] = useState("");
    const [vegeDescription, setVegeDescription] = useState("");

    /* Options */
    const [optionMeat, setOptionMeat] = useState(true);
    const [optionWege, setOptionWege] = useState(false);
    const [sizeM, setSizeM] = useState(true);
    const [sizeL, setSizeL] = useState(false);

    const [addMsg, setAddMsg] = useState("");

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

        /* Get all categories */
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

        setPriceMMeat(productData.price_m_meat);
        setPriceLMeat(productData.price_l_meat);
        setPriceMWege(productData.price_m_vege);
        setPriceLWege(productData.price_l_vege);

        setCategoryId(productData.category_id);
        setHidden(productData.hidden);

        setShortDescription(productData.short_description);
        setLongDescription(productData.long_description);
        setMeatDescription(productData.meat_description);
        setVegeDescription(productData.vege_description);
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
                    <label className={sizeM && optionMeat ? "addProduct__label" : "addProduct__input--invisible"}>
                        <input className={sizeM && optionMeat ? "addProduct__input" : "addProduct__input--invisible"}
                               name="priceM_meat"
                               type="number"
                               step={0.01}
                               value={priceMMeat}
                               onChange={(e) => { setPriceMMeat(e.target.value) }}
                               placeholder="Cena dla rozmiaru M - opcja mięsna (domyślna)" />
                    </label>
                    <label className={sizeL && optionMeat ? "addProduct__label" : "addProduct__input--invisible"}>
                        <input className={sizeL && optionMeat ? "addProduct__input" : "addProduct__input--invisible"}
                               name="priceL_meat"
                               type="number"
                               step={0.01}
                               value={priceLMeat}
                               onChange={(e) => { setPriceLMeat(e.target.value) }}
                               placeholder="Cena dla rozmiaru L - opcja mięsna (domyślna)" />
                    </label>

                    <label className={sizeM && optionWege ? "addProduct__label" : "addProduct__input--invisible"}>
                        <input className={sizeM && optionWege ? "addProduct__input" : "addProduct__input--invisible"}
                               name="priceM_vege"
                               type="number"
                               step={0.01}
                               value={priceMWege}
                               onChange={(e) => { setPriceMWege(e.target.value) }}
                               placeholder="Cena dla rozmiaru M - opcja wege" />
                    </label>
                    <label className={sizeL && optionWege ? "addProduct__label" : "addProduct__input--invisible"}>
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
                    <span>Zdjęcie produktu {categoryId === 1 ? "(opcja mięsna M)" : ""}</span>
                    <input type="file"
                           className="product__fileInput"
                           name="mainImage" />
                </label>
                <label className="fileInputLabel">
                    <span>Galeria - 1 {categoryId === 1 ? "(opcja mięsna L)" : ""}</span>
                    <input type="file"
                           className="product__fileInput"
                           name="gallery1" />
                </label>

                <label className="fileInputLabel">
                    <span>Galeria - 2 {categoryId === 1 ? "(opcja wege M)" : ""}</span>
                    <input type="file"
                           className="product__fileInput"
                           name="gallery2" />
                </label>

                <label className="fileInputLabel">
                    <span>Galeria - 3 {categoryId === 1 ? "(opcja wege L)" : ""}</span>
                    <input type="file"
                           className="product__fileInput"
                           name="gallery3" />
                </label>
            </section>

            <section className="addProduct__form__section">

                {categoryId === 1 || categoryId === 2 ?  <section className="addProduct__form__subsection addProduct__form__subsection--marginLeft">
                    <h4 className="addProduct__form__subsection__header">
                        Dostępne opcje
                    </h4>
                    <label className="panelContent__filters__btnWrapper">
                        <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => { e.preventDefault(); }}>
                            <span className={optionMeat ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        Mięsna (domyślna)
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
                            if(categoryId === 3) setSizeM(!sizeM);
                        }}>
                            <span className={sizeM ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        {categoryId === 3 ? "25 szt." : "M (domyślna)"}
                    </label>
                    <label className="panelContent__filters__btnWrapper panelContent__filters__btn--options">
                        <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => { e.preventDefault(); setSizeL(!sizeL); }}>
                            <span className={sizeL ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        {categoryId === 3 ? "50 szt." : "L"}
                    </label>
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
                        <span>Składniki produktu w wersji mięsnej (domyślne)</span>
                        <JoditEditor
                            name="meatDescription"
                            value={meatDescription}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setMeatDescription(newContent) }}
                        />
                    </label>

                    <label className="jodit--label">
                        <span>Składniki produktu w wersji vege</span>
                        <JoditEditor
                            name="vegeDescription"
                            value={vegeDescription}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => { setVegeDescription(newContent) }}
                        />
                    </label>
                </> : ""}

                <label className="panelContent__filters__label__label panelContent__filters__label__label--category">
                    <button className="panelContent__filters__btn" onClick={(e) => { e.preventDefault(); setHidden(!hidden); }}>
                        <span className={hidden ? "panelContent__filters__btn--active" : "d-none"} />
                    </button>
                    Ukryj produkt
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
