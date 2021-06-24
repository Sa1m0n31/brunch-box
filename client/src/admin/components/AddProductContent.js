import React, { useEffect, useState, useRef } from 'react'

import {addAllergens, getNewId, getProductDetails} from "../helpers/productFunctions";
import { useLocation } from "react-router";
import {getAllCategories} from "../helpers/categoriesFunctions";

import JoditEditor from 'jodit-react';

const AddProductContent = () => {
    const editorR = useRef(null);

    const [name, setName] = useState("");
    const [bracket, setBracket] = useState("");
    const [priceM, setPriceM] = useState("");
    const [priceS, setPriceS] = useState("");
    const [priceL, setPriceL] = useState("");
    const [content, setContent] = useState("");
    const [contentHidden, setContentHidden] = useState("");
    const [mainImg, setMainImg] = useState(null);
    const [id, setId] = useState(0);
    const [product, setProduct] = useState([]);
    const [allergens, setAllergens] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allergies, setAllergies] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    const [optionMeat, setOptionMeat] = useState(false);
    const [optionWege, setOptionWege] = useState(false);
    const [sizeS, setSizeS] = useState(false);
    const [sizeM, setSizeM] = useState(true);
    const [sizeL, setSizeL] = useState(false);

    const [addMsg, setAddMsg] = useState("");

    const allergensList = ["ryby", "orzechy", "al3", "al4", "al5", "al6", "al7", "al8", "al9", "al10"];

    const location = useLocation();

    useEffect(() => {
        /* Check if need to add added message */
        const added = parseInt(new URLSearchParams(location.search).get("add"));
        if(added) {
            if(added === 1) {
                setAddMsg("Produkt został dodany");
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

        /* Check if it's product to edit */
        const param = parseInt(new URLSearchParams(location.search).get("id"));
        if(param) {
            setId(param);

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
                   setId(res.data.result);
                });
        }
    }, []);

    const setInitialAllergens = (allergensData) => {
        console.log(allergensData);
        let newAllergies = allergies;
        allergensList.forEach((nameItem, nameIndex) => {
            allergensData.forEach((dataItem) => {
                console.log(nameItem + " " + dataItem.allergen);
                if(nameItem === dataItem.allergen) {
                    newAllergies = newAllergies.map((item, index) => {
                        if(index === nameIndex) return 1;
                        else return item;
                    });
                    console.log(newAllergies);
                    setAllergies(newAllergies);
                }
            });
        })

        console.log(allergensData);
    }

    const setInitialValues = (productData) => {
        setName(productData.name);
        setBracket(productData.bracket_name);
        setContent(productData.description);
        setContentHidden(productData.hidden_description);
        setOptionMeat(productData.meat);
        setOptionWege(productData.vegan);
        setSizeL(productData.l);
        setSizeM(productData.m);
        setSizeS(productData.s);
        setPriceL(productData.price_l);
        setPriceM(productData.price_m);
        setPriceS(productData.price_s);

    }

    const editorFocus = () => {
        document.querySelector(".editor").style.borderWidth = "2px";
    }

    const editorBlur = () => {
        document.querySelector(".editor").style.borderWidth = "1px";
    }

    const handleSubmit = (e) => {
        /* Sending normal form */

        /* Add description */


        /* Add allergens */
        const allergensToAdd = allergensList.filter((item, index) => {
            return allergies[index];
        })
        setTimeout(() => {
            addAllergens(id+1, allergensToAdd)
                .then(res => {
                    console.log(res.data.result);
                });
        }, 3000);
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

    const contentStateChange = (contentState) => {
        console.log(contentState);
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
                               action="http://localhost:5000/product/add-product"
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
                <label className={sizeM ? "addProduct__label" : "addProduct__input--invisible"}>
                    <input className={sizeM ? "addProduct__input" : "addProduct__input--invisible"}
                           name="priceM"
                           type="number"
                           step={0.01}
                           value={priceM}
                           onChange={(e) => { setPriceM(e.target.value) }}
                           placeholder="Cena dla rozmiaru M" />
                </label>
                <label className={sizeS ? "addProduct__label" : "addProduct__input--invisible"}>
                    <input className={sizeS ? "addProduct__input" : "addProduct__input--invisible"}
                           name="priceS"
                           type="number"
                           step={0.01}
                           value={priceS}
                           onChange={(e) => { setPriceS(e.target.value) }}
                           placeholder="Cena dla rozmiaru S" />
                </label>
                <label className={sizeL ? "addProduct__label" : "addProduct__input--invisible"}>
                    <input className={sizeL ? "addProduct__input" : "addProduct__input--invisible"}
                           name="priceL"
                           type="number"
                           step={0.01}
                           value={priceL}
                           onChange={(e) => { setPriceL(e.target.value) }}
                           placeholder="Cena dla rozmiaru L" />
                </label>

                <select className="addProduct__categorySelect" name="categoryId">
                    <option>
                        Wybierz kategorię
                    </option>
                    {categories.map((item, index) => {
                        return <option key={index} value={item.id}>{item.name}</option>
                    })}
                </select>


                <label className="jodit--label">
                    <span>Opis widoczny (po lewej stronie produktu)</span>
                    <JoditEditor
                        name="editor"
                        ref={editorR}
                        value={content}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                        onChange={newContent => { setContent(newContent) }}
                    />
                </label>

                <label className="jodit--label">
                    <span>Opis ukryty (po prawej stronie produktu)</span>
                    <JoditEditor
                        name="hiddenDescription"
                        value={contentHidden}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                        onChange={newContent => { setContentHidden(newContent) }}
                    />
                </label>

            </section>

            <section className="addProduct__form__section">

                <input type="file"
                       className="product__fileInput"
                       name="mainImage" />

                <section className="addProduct__form__subsection addProduct__form__subsection--marginLeft">
                    <h4 className="addProduct__form__subsection__header">
                        Dostępne opcje
                    </h4>
                    <label className="panelContent__filters__btnWrapper">
                        <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => { e.preventDefault(); setOptionMeat(!optionMeat) }}>
                            <span className={optionMeat ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        Mięsna
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
                        <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => { e.preventDefault(); setSizeS(!sizeS); }}>
                            <span className={sizeS ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        S
                    </label>
                    <label className="panelContent__filters__btnWrapper panelContent__filters__btn--options">
                        <button className="panelContent__filters__btn panelContent__filters__btn--options" onClick={(e) => { e.preventDefault(); setSizeM(!sizeM); }}>
                            <span className={sizeM ? "panelContent__filters__btn--active" : "d-none"} />
                        </button>
                        M
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
                       name="s"
                       value={sizeS} />
                <input className="input--hidden"
                       name="m"
                       value={sizeM} />
                <input className="input--hidden"
                       name="l"
                       value={sizeL} />

                <label>
                    <p className="text-center">Zaznacz alergeny</p>
                    <section className="addProduct__allergies">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
                            <button className={allergies[index] ? "addProduct__allergies__item allergiesChecked" : "addProduct__allergies__item"} key={index} onClick={(e) => { toggleAllergies(e, index) }}>
                                {item}
                            </button>
                        ))}
                    </section>
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
