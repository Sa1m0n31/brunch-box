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

const AddProductContent = () => {
    const editorR = useRef(null);

    const allergensImg = [gluten, grzyby, jajka, kukurydza, lubin, mieczaki, mleko, musztarda, orzechy, orzechyZiemne, ryba, seler,
        sezam, siarka, skorupiaki, soja];

    const [update, setUpdate] = useState(false);
    const [name, setName] = useState("");
    const [bracket, setBracket] = useState("");
    const [id, setId] = useState(0);
    const [categoryId, setCategoryId] = useState(0);
    const [product, setProduct] = useState([]);
    const [allergens, setAllergens] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allergies, setAllergies] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    /* Prices */
    const [priceMMeat, setPriceMMeat] = useState("");
    const [priceLMeat, setPriceLMeat] = useState("");
    const [priceMWege, setPriceMWege] = useState("");
    const [priceLWege, setPriceLWege] = useState("");

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

    const allergensList = ["gluten", "grzyby", "jajka", "kukurydza", "łubin", "mięczaki", "mleko", "musztarda", "orzechy", "orzechy ziemne", "ryba", "seler", "sezam", "siarka", "skorupiaki", "soja"];

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
                        console.log(res.data.result);
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
                    console.log(res.data.result);
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

        setShortDescription(productData.short_description);
        setLongDescription(productData.long_description);
        setMeatDescription(productData.meat_description);
        setVegeDescription(productData.vege_description);
    }

    const handleSubmit = (e) => {
        console.log(update);
        /* Sending normal form */

        /* Add description */


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

    return <main className="panelContent addProduct">
        <header className="addProduct__header">
            <h1 className="addProduct__header__h">
                Edycja produktu
            </h1>
        </header>
        {addMsg === "" ? <form className="addProduct__form addProduct__form--addProduct"
                               encType="multipart/form-data"
                               onSubmit={(e) => { handleSubmit(e) }}
                               action={update ? "http://localhost:5000/product/update-product" : "http://localhost:5000/product/add-product"}
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

                <select className="addProduct__categorySelect" name="categoryId" value={categoryId} onChange={(e) => { setCategoryId(e.target.value) }}>
                    <option value={0}>
                        Wybierz kategorię
                    </option>
                    {categories.map((item, index) => {
                        return <option key={index} value={item.id}>{item.name}</option>
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

                <label className="jodit--label">
                    <span>Długi opis</span>
                    <JoditEditor
                        name="longDescription"
                        ref={editorR}
                        value={longDescription}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                        onChange={newContent => { setLongDescription(newContent) }}
                    />
                </label>


                <label className="fileInputLabel">
                    <span>Galeria - 1</span>
                    <input type="file"
                           className="product__fileInput"
                           name="gallery1" />
                </label>

                <label className="fileInputLabel">
                    <span>Galeria - 2</span>
                    <input type="file"
                           className="product__fileInput"
                           name="gallery2" />
                </label>

                <label className="fileInputLabel">
                    <span>Galeria - 3</span>
                    <input type="file"
                           className="product__fileInput"
                           name="gallery3" />
                </label>

            </section>

            <section className="addProduct__form__section">

               <label className="fileInputLabel">
                   <span>Zdjęcie produktu</span>
                   <input type="file"
                          className="product__fileInput"
                          name="mainImage" />
               </label>

                <section className="addProduct__form__subsection addProduct__form__subsection--marginLeft">
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
                </section>

                <section className="addProduct__form__subsection addProduct__form__subsection--marginLeft marginTop30">
                    <h4 className="addProduct__form__subsection__header">
                        Dostępne rozmiary
                    </h4>
                    <label className="panelContent__filters__btnWrapper panelContent__filters__btn--options">
                        <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => { e.preventDefault(); }}>
                            <span className={sizeM ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        M (domyślna)
                    </label>
                    <label className="panelContent__filters__btnWrapper panelContent__filters__btn--options">
                        <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => { e.preventDefault(); setSizeL(!sizeL); }}>
                            <span className={sizeL ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        L
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
                            <button className={allergies[index] ? "addProduct__allergies__item allergiesChecked" : "addProduct__allergies__item"} key={index} onClick={(e) => { toggleAllergies(e, index) }}>
                                <img className="allergensImg" src={item} alt="alergen" />
                            </button>
                        ))}
                    </section>
                </label>

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
            </section>

            <section className="addProduct__btnWrapper">
                <button className="addProduct__btn" type="submit">
                    Dodaj produkt
                </button>
            </section>
        </form> : <h2 className="addMsg">
            {addMsg}
        </h2> }
    </main>
}

export default AddProductContent;
