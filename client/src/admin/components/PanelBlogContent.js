import React, { useState, useEffect } from 'react'
import Modal from "react-modal";
import closeImg from "../static/img/close.png";
import {deletePost, getAllPosts} from "../helpers/blogFunctions";
import settings from "../helpers/settings";
import exit from "../static/img/exit.svg";
import trash from "../static/img/trash.svg";
import {getDate, getTime} from "../helpers/formatFunctions";
import searchImg from "../static/img/search.svg";
import {postSearch, sortByDate} from "../helpers/search";

const PanelBlogContent = () => {
    const [modal, setModal] = useState(false);
    const [deleteMsg, setDeleteMsg] = useState("");
    const [candidate, setCandidate] = useState(0);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getAllPosts()
            .then(res => {
                if(res.data.result) {
                    console.log(res.data.result);
                    setPosts(res.data.result);
                    sessionStorage.setItem('sec-posts', JSON.stringify(res.data.result));
                }
            });
    }, [deleteMsg]);

    const deletePostById = () => {
        deletePost(candidate)
            .then(res => {
                if(res.data.result) setDeleteMsg("Wpis został usunięty");
                else setDeleteMsg("Coś poszło nie tak... Prosimy spróbować później");
            });
    }

    const openModal = (id) => {
        setCandidate(id);
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
        setDeleteMsg("");
    }

    const search = (e) => {
        setPosts(postSearch(e.target.value));
    }

    return <main className="panelContent">

        <Modal
            portalClassName="panelModal"
            isOpen={modal}>

            {deleteMsg === "" ? <>
                <h2 className="modalQuestion">
                    Czy na pewno chcesz usunąć ten wpis?
                </h2>

                <section className="modalQuestion__buttons">
                    <button className="modalQuestion__btn" onClick={() => { deletePostById() }}>
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
                Wpisy
            </h1>
        </header>
        <section className="panelContent__filters">
            <section className="panelContent__filters__item">
                    <span className="panelContent__filters__label">
                        Wyszukiwanie:
                    </span>
                <label className="panelContent__input__label">
                    <input className="panelContent__input"
                           placeholder="Szukaj..."
                           onChange={(e) => { search(e); }}
                           name="search" />

                    <span className="panelContent__input__span">
                            <img className="panelContent__input__icon" src={searchImg} alt="szukaj" />
                        </span>
                </label>
            </section>
        </section>
        <main className="panelContent__contentWrapper">
            {posts.map((item, index) => {
                return <section key={index} className="panelContent__item">
                    <section className="panelContent__column">
                        {item.img_path ? <img className="panelContent__productImg" src={settings.API_URL + "/image?url=/media/" + item.img_path} alt="zdjecie-kategorii" /> : ""}
                    </section>

                    <section className="panelContent__column">
                        <h4 className="panelContent__column__label">
                            Tytuł
                        </h4>
                        <h3 className="panelContent__column__value">
                            {item.title}
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
                        <div className="panelContent__column__value">
                            <div className="panelContent__column__value panelContent__column__value--buttons">
                                <button className="panelContent__column__btn">
                                    <a className="panelContent__column__link" href={`/panel/dodaj-wpis?id=${item.id}`}>
                                        <img className="panelContent__column__icon" src={exit} alt="przejdz" />
                                    </a>
                                </button>
                                <button className="panelContent__column__btn" onClick={() => { openModal(item.id) }}>
                                    <img className="panelContent__column__icon" src={trash} alt="usuń" />
                                </button>
                            </div>
                        </div>
                    </section>
                </section>
            })}
        </main>
    </main>
}

export default PanelBlogContent;
