import React, { useEffect, useState, useRef } from 'react'

import {addAllergens, getNewId, getProductDetails} from "../helpers/productFunctions";
import { useLocation } from "react-router";
import {getAllCategories} from "../helpers/categoriesFunctions";

import JoditEditor from 'jodit-react';

const AddProductContent = () => {
    const editorR = useRef(null);

    const [name, setName] = useState("");
    const [bracket, setBracket] = useState("");
    const [price, setPrice] = useState("");
    const [content, setContent] = useState("");
    const [mainImg, setMainImg] = useState(null);
    const [id, setId] = useState(0);
    const [product, setProduct] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allergies, setAllergies] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    const [optionMeat, setOptionMeat] = useState(false);
    const [optionWege, setOptionWege] = useState(false);
    const [sizeM, setSizeM] = useState(false);
    const [sizeL, setSizeL] = useState(false);

    const allergensList = ["ryby", "orzechy", "al3", "al4", "al5", "al6", "al7", "al8", "al9", "al10"];

    const location = useLocation();

    useEffect(() => {
        /* Get all categories */
        getAllCategories()
            .then(res => {
                setCategories(res.data.result);
            });

        const param = parseInt(new URLSearchParams(location.search).get("id"));
        if(param) {
            setId(param);

            getProductDetails(param)
                .then(async res => {
                    console.log(res.data.result);
                    await setProduct(res.data.result);
                    await setInitialValues(res.data.result[0]);
                });
        }
        else {
            getNewId()
                .then(res => {
                   setId(res.data.result);
                });
        }
    }, []);

    const setInitialValues = (productData) => {
        console.log(productData);
        setName(productData.name);
        setContent(productData.description);

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
        addAllergens(id, allergensToAdd)
            .then(res => {
                console.log(res.data.result);
            });
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
        <form className="addProduct__form addProduct__form--addProduct"
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
                           name="second_name"
                           placeholder="Nazwa w nawiasie" />
                </label>
                <label className="addProduct__label">
                    <input className="addProduct__input"
                           name="price"
                           value={price}
                           onChange={(e) => { setPrice(e.target.value) }}
                           placeholder="Cena" />
                </label>

                <select className="addProduct__categorySelect" name="categoryId">
                    <option>
                        Wybierz kategorię
                    </option>
                    {categories.map((item, index) => {
                        return <option key={index} value={item.id}>{item.name}</option>
                        })}
                </select>


                <JoditEditor
                    name="editor"
                    ref={editorR}
                    value={content}
                    tabIndex={1} // tabIndex of textarea
                    onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                    onChange={newContent => { setContent(newContent) }}
                />

            </section>

            <section className="addProduct__form__section">

                <input type="file"
                       className="product__fileInput"
                       name="mainImage" />

                <section className="addProduct__form__subsection">
                    <h4 className="addProduct__form__subsection__header">
                        Dostępne opcje
                    </h4>
                    <button className="panelContent__filters__btn" onClick={() => { setOptionMeat(!optionMeat) }}>
                        <span className={optionMeat ? "panelContent__filters__btn--active" : "d-none"} />
                        Mięsna
                    </button>
                    <button className="panelContent__filters__btn" onClick={() => { setOptionWege(!optionWege) }}>
                        <span className={optionWege ? "panelContent__filters__btn--active" : "d-none"} />
                        Wegetariańska
                    </button>
                </section>

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
        </form>
    </main>
}

export default AddProductContent;
