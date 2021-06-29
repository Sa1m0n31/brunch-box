import React, { useEffect, useState, useRef } from 'react'
import JoditEditor from "jodit-react";
import { useLocation } from 'react-router'
import {getSinglePost} from "../helpers/blogFunctions";

const AddPostContent = () => {
    const editorR = useRef(null);
    const editorREn = useRef(null);

    const location = useLocation();

    const [id, setId] = useState(0);
    const [addMsg, setAddMsg] = useState("");
    const [update, setUpdate] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [titleEn, setTitleEn] = useState("");
    const [contentEn, setContentEn] = useState("");

    useEffect(() => {
        /* Check if post added */
        const added = parseInt(new URLSearchParams(location.search).get("add"));
        if(added) {
            if(added === 1) {
                setAddMsg("Wpis został dodany");
            }
            else if(added === 2) {
                setAddMsg("Wpis został zaktualizowany");
            }
            else {
                setAddMsg("Coś poszło nie tak... Prosimy spróbować później");
            }
        }

        /* Check if in update mode */
        const paramId = parseInt(new URLSearchParams(location.search).get("id"));
        if(paramId) {
            setUpdate(true);
            setId(paramId);
            getSinglePost(paramId)
                .then(res => {
                    const result = res.data.result;
                    if(result) {
                        setTitle(result.title);
                        setContent(result.content);
                        setTitleEn(result.title_en);
                        setContentEn(result.content_en);
                    }
                });
        }
    }, []);

    const handleSubmit = (e) => {

    }

    return <main className="panelContent addProduct">
        <header className="addProduct__header">
            <h1 className="addProduct__header__h">
                Edycja wpisu
            </h1>
        </header>
        <main className="panelContent__addPost">
            {addMsg === "" ? <form className="addProduct__form addProduct__form--addPost"
                                   encType="multipart/form-data"
                                   onSubmit={(e) => { handleSubmit(e) }}
                                   action={update ? "http://brunchbox.skylo-test3.pl/blog/update" : "http://brunchbox.skylo-test3.pl/blog/add"}
                                   method="POST"
            >
                <input className="invisibleInput"
                       value={id}
                       name="id" />

                <label className="addProduct__label--addPost">
                    <input className="addProduct__input"
                           name="title"
                           value={title}
                           onChange={(e) => { setTitle(e.target.value) }}
                           placeholder="Tytuł" />
                </label>

                <label className="fileInputLabel">
                    <span>Zdjęcie wyróżniające</span>
                    <input type="file"
                           className="product__fileInput"
                           name="featuredImage" />
                </label>

                <label className="jodit--label">
                    <span>Wpis</span>
                    <JoditEditor
                        name="content"
                        ref={editorR}
                        value={content}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                        onChange={newContent => { setContent(newContent) }}
                    />
                </label>

                <span className="en-division"></span>

                <label className="addProduct__label--addPost">
                    <input className="addProduct__input"
                           name="titleEn"
                           value={titleEn}
                           onChange={(e) => { setTitleEn(e.target.value) }}
                           placeholder="Tytuł angielski" />
                </label>

                <label className="jodit--label">
                    <span>Wpis po angielsku</span>
                    <JoditEditor
                        name="contentEn"
                        ref={editorREn}
                        value={contentEn}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
                        onChange={newContent => { setContentEn(newContent) }}
                    />
                </label>

                <section className="addProduct__btnWrapper">
                    <button className="addProduct__btn" type="submit">
                        Opublikuj
                    </button>
                </section>
            </form> : <h1 className="addedMsgWrapper">
                {addMsg}
            </h1> }
        </main>
    </main>
}

export default AddPostContent;
