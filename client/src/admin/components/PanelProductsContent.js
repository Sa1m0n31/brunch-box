import React, { useEffect, useState } from 'react'

import searchImg from "../static/img/search.svg";

import { productSearch } from "../helpers/search";
import {deleteProduct, getAllProducts} from "../helpers/productFunctions";
import exit from "../static/img/exit.svg";
import trash from "../static/img/trash.svg";
import {getDate, getTime} from "../helpers/formatFunctions";
import settings from "../helpers/settings";
import Modal from 'react-modal'
import closeImg from "../static/img/close.png";

const PanelProductsContent = () => {
    const [products, setProducts] = useState([]);
    const [candidate, setCandidate] = useState(-1);
    const [deleteMsg, setDeleteMsg] = useState("");
    const [modal, setModal] = useState(false);

    useEffect(() => {
        getAllProducts()
            .then(res => {
               const result = res.data.result;
               setProducts(result);
               sessionStorage.setItem('skylo-e-commerce-products', JSON.stringify(result));
            });
    }, [modal]);

    const search = e => {
        const filteredProducts = productSearch(e.target.value);
        setProducts(filteredProducts);
    }

    const deleteProductById = () => {
        deleteProduct(candidate)
            .then(res => {
                if(res.data.result === 1) setDeleteMsg("Produkt został usunięty");
                else setDeleteMsg("Coś poszło nie tak... Prosimy spróbować później");
            });
    }

    const openModal = (id) => {
        setModal(true);
        setCandidate(id);
    }

    const closeModal = () => {
        setModal(false);
        setDeleteMsg("");
    }

    return <main className="panelContent">

        <Modal
            portalClassName="panelModal"
            isOpen={modal}>

            {deleteMsg === "" ? <>
                <h2 className="modalQuestion">
                    Czy na pewno chcesz usunąć ten produkt?
                </h2>

                <section className="modalQuestion__buttons">
                    <button className="modalQuestion__btn" onClick={() => { deleteProductById() }}>
                        Tak
                    </button>
                    <button className="modalQuestion__btn" onClick={() => { closeModal() }}>
                        Nie
                    </button>
                </section>
            </> : <h2 className="modalQuestion">
                {deleteMsg}
            </h2>}

            <button className="modalClose" onClick={() => { closeModal() }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>
        </Modal>


        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Produkty
            </h1>
        </header>
        <main className="panelContent__contentWrapper">
            <header className="panelContent__filters">
                <section className="panelContent__filters__item">
                    <span className="panelContent__filters__label">
                        Wyszukiwanie:
                    </span>
                    <label className="panelContent__input__label">
                        <input className="panelContent__input"
                               placeholder="Szukaj..."
                               onChange={(e) => { search(e) }}
                               name="search" />

                        <span className="panelContent__input__span">
                            <img className="panelContent__input__icon" src={searchImg} alt="szukaj" />
                        </span>
                    </label>
                </section>
            </header>
            <main className="panelContent__content">
                {products?.map((item, index) => (
                    <section className="panelContent__item productItem">
                        <section className="panelContent__column">
                            {item.image ? <img className="panelContent__productImg" src={settings.API_URL + "/image?url=/media/" + item.image} alt="produkt" /> : ""}
                        </section>

                        <section className="panelContent__column">
                            <h4 className="panelContent__column__label">
                                Nazwa
                            </h4>
                            <h3 className="panelContent__column__value">
                                {item.product_name}
                            </h3>
                        </section>

                        <section className="panelContent__column">
                            <h4 className="panelContent__column__label">
                                Kategoria
                            </h4>
                            <h3 className="panelContent__column__value">
                                {item.category_name}
                            </h3>
                        </section>

                        <section className="panelContent__column">
                            <h4 className="panelContent__column__label">
                                Data dodania
                            </h4>
                            <h3 className="panelContent__column__value">
                                <span className="dateTime">
                                    { getDate(item.date) }
                                </span>
                                <span className="dateTime">
                                    { getTime(item.date) }
                                </span>
                            </h3>
                        </section>

                        <section className="panelContent__column">
                            <h4 className="panelContent__column__label">
                                Działania
                            </h4>
                            <div className="panelContent__column__value panelContent__column__value--buttons">
                                <button className="panelContent__column__btn">
                                    <a className="panelContent__column__link" href={"/panel/dodaj-produkt?id=" + item.id}>
                                        <img className="panelContent__column__icon" src={exit} alt="przejdz" />
                                    </a>
                                </button>
                                <button className="panelContent__column__btn" onClick={() => { openModal(item.id) }}>
                                        <img className="panelContent__column__icon" src={trash} alt="usuń" />
                                </button>
                            </div>
                        </section>
                    </section>
                ))}
            </main>
        </main>
    </main>
}

export default PanelProductsContent;
