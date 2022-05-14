import React, {useEffect, useState} from 'react';
import Modal from "react-modal";
import closeImg from "../static/img/close.png";
import JoditEditor from "jodit-react";
import settings from "../helpers/settings";
import exit from "../static/img/exit.svg";
import trash from "../static/img/trash.svg";
import axios from "axios";

const PanelSliderContent = () => {
    const [addedMsg, setAddedMsg] = useState("");
    const [header1, setHeader1] = useState("");
    const [header2, setHeader2] = useState("");
    const [header3, setHeader3] = useState("");
    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");
    const [text3, setText3] = useState("");
    const [btn1, setBtn1] = useState("");
    const [btn2, setBtn2] = useState("");
    const [btn3, setBtn3] = useState("");
    const [link1, setLink1] = useState("");
    const [link2, setLink2] = useState("");
    const [link3, setLink3] = useState("");
    const [headerBottom1, setHeaderBottom1] = useState("");
    const [headerBottom2, setHeaderBottom2] = useState("");
    const [headerBottom3, setHeaderBottom3] = useState("");
    const [textBottom1, setTextBottom1] = useState("");
    const [textBottom2, setTextBottom2] = useState("");
    const [textBottom3, setTextBottom3] = useState("");
    const [linkBottom1, setLinkBottom1] = useState("");
    const [linkBottom2, setLinkBottom2] = useState("");
    const [linkBottom3, setLinkBottom3] = useState("");

    const [header1En, setHeader1En] = useState("");
    const [header2En, setHeader2En] = useState("");
    const [header3En, setHeader3En] = useState("");
    const [text1En, setText1En] = useState("");
    const [text2En, setText2En] = useState("");
    const [text3En, setText3En] = useState("");
    const [btn1En, setBtn1En] = useState("");
    const [btn2En, setBtn2En] = useState("");
    const [btn3En, setBtn3En] = useState("");
    const [link1En, setLink1En] = useState("");
    const [link2En, setLink2En] = useState("");
    const [link3En, setLink3En] = useState("");
    const [headerBottom1En, setHeaderBottom1En] = useState("");
    const [headerBottom2En, setHeaderBottom2En] = useState("");
    const [headerBottom3En, setHeaderBottom3En] = useState("");
    const [textBottom1En, setTextBottom1En] = useState("");
    const [textBottom2En, setTextBottom2En] = useState("");
    const [textBottom3En, setTextBottom3En] = useState("");
    const [linkBottom1En, setLinkBottom1En] = useState("");
    const [linkBottom2En, setLinkBottom2En] = useState("");
    const [linkBottom3En, setLinkBottom3En] = useState("");

    const [image1, setImage1] = useState("");
    const [image2, setImage2] = useState("");
    const [image3, setImage3] = useState("");
    const [image4, setImage4] = useState("");
    const [image5, setImage5] = useState("");
    const [image6, setImage6] = useState("");
    const [image7, setImage7] = useState("");
    const [image8, setImage8] = useState("");
    const [image9, setImage9] = useState("");

    const [deleteImg1, setDeleteImg1] = useState(false);
    const [deleteImg2, setDeleteImg2] = useState(false);
    const [deleteImg3, setDeleteImg3] = useState(false);
    const [deleteImg4, setDeleteImg4] = useState(false);
    const [deleteImg5, setDeleteImg5] = useState(false);
    const [deleteImg6, setDeleteImg6] = useState(false);
    const [deleteImg7, setDeleteImg7] = useState(false);
    const [deleteImg8, setDeleteImg8] = useState(false);
    const [deleteImg9, setDeleteImg9] = useState(false);

    useEffect(() => {
        axios.get(`${settings.API_URL}/slider/get`)
            .then((res) => {
                const r = res?.data?.result;
                console.log(r);
                if(r) {
                    setInitialValuesPl(r[r.findIndex((item) => (item.language === 'pl'))]);
                    setInitialValuesEn(r[r.findIndex((item) => (item.language === 'en'))]);
                }
            })
    }, []);

    const setInitialValuesPl = (r) => {
        setHeader1(r.slide1header);
        setHeader2(r.slide2header);
        setHeader3(r.slide3header);
        setText1(r.slide1text);
        setText2(r.slide2text);
        setText3(r.slide3text);
        setBtn1(r.slide1btn);
        setBtn2(r.slide2btn);
        setBtn3(r.slide3btn);
        setLink1(r.slide1link);
        setLink2(r.slide2link);
        setLink3(r.slide3link);
        setHeaderBottom1(r.slidebottom1header);
        setHeaderBottom2(r.slidebottom2header);
        setHeaderBottom3(r.slidebottom3header);
        setTextBottom1(r.slidebottom1text);
        setTextBottom2(r.slidebottom2text);
        setTextBottom3(r.slidebottom3text);
        setLinkBottom1(r.slidebottom1link);
        setLinkBottom2(r.slidebottom2link);
        setLinkBottom3(r.slidebottom3link);

        if(r.slide1image !== 'undefined') setImage1(r.slide1image);
        if(r.slide2image !== 'slider/undefined') setImage2(r.slide2image);
        if(r.slide3image !== 'slider/undefined') setImage3(r.slide3image);
        if(r.slidebottom1image !== 'slider/undefined') setImage4(r.slidebottom1image);
        if(r.slidebottom2image !== 'slider/undefined') setImage5(r.slidebottom2image);
        if(r.slidebottom3image !== 'slider/undefined') setImage6(r.slidebottom3image);
        if(r.mobile1 !== 'slider/undefined') setImage7(r.mobile1);
        if(r.mobile2 !== 'slider/undefined') setImage8(r.mobile2);
        if(r.mobile3 !== 'slider/undefined') setImage9(r.mobile3);
    }

    const setInitialValuesEn = (r) => {
        setHeader1En(r.slide1header);
        setHeader2En(r.slide2header);
        setHeader3En(r.slide3header);
        setText1En(r.slide1text);
        setText2En(r.slide2text);
        setText3En(r.slide3text);
        setBtn1En(r.slide1btn);
        setBtn2En(r.slide2btn);
        setBtn3En(r.slide3btn);
        setLink1En(r.slide1link);
        setLink2En(r.slide2link);
        setLink3En(r.slide3link);
        setHeaderBottom1En(r.slidebottom1header);
        setHeaderBottom1En(r.slidebottom2header);
        setHeaderBottom1En(r.slidebottom3header);
        setTextBottom1En(r.slidebottom1text);
        setTextBottom2En(r.slidebottom2text);
        setTextBottom3En(r.slidebottom3text);
        setLinkBottom1En(r.slidebottom1link);
        setLinkBottom2En(r.slidebottom2link);
        setLinkBottom3En(r.slidebottom3link);
    }

    return <main className="panelContent">
        <section className="panelContent__frame__section">
            <h1 className="panelContent__frame__header panelContent__frame__header--flex">
                <span>
                    Wersja polska
                </span>
                <span>
                    Wersja angielska
                </span>
            </h1>

            {addedMsg === "" ? <div className="flex">
                <form className="panelContent__frame__form categoriesForm"
                      method="POST"
                      action="http://localhost:5000/slider/update"
                      encType="multipart/form-data"
                >

                    <input className="input--hidden"
                           value="pl"
                           name="language" />

                    <label className="addProduct__label addProduct__label--frame">
                        Nagłówek slide 1
                        <input className="addProduct__input"
                               name="slide1Header"
                               value={header1}
                               onChange={(e) => { setHeader1(e.target.value) }}
                               type="text"
                               placeholder="Nagłówek slide 1" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Nagłówek slide 2
                        <input className="addProduct__input"
                               name="slide2Header"
                               value={header2}
                               onChange={(e) => { setHeader2(e.target.value) }}
                               type="text"
                               placeholder="Nagłówek slide 2" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Nagłówek slide 3
                        <input className="addProduct__input"
                               name="slide3Header"
                               value={header3}
                               onChange={(e) => { setHeader3(e.target.value) }}
                               type="text"
                               placeholder="Nagłówek slide 3" />
                    </label>

                    <label className="addProduct__label addProduct__label--frame">
                        Tekst slide 1
                        <textarea className="addProduct__input addProduct__input--textarea"
                                  name="slide1Text"
                                  value={text1}
                                  onChange={(e) => { setText1(e.target.value) }}
                                  placeholder="Tekst slide 1" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Tekst slide 2
                        <textarea className="addProduct__input addProduct__input--textarea"
                                  name="slide2Text"
                                  value={text2}
                                  onChange={(e) => { setText2(e.target.value) }}
                                  placeholder="Tekst slide 2" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Tekst slide 3
                        <textarea className="addProduct__input addProduct__input--textarea"
                                  name="slide3Text"
                                  value={text3}
                                  onChange={(e) => { setText3(e.target.value) }}
                                  placeholder="Tekst slide 3" />
                    </label>

                    <label className="addProduct__label addProduct__label--frame">
                        Napis na buttonie slide 1
                        <input className="addProduct__input"
                               name="slide1Btn"
                               value={btn1}
                               onChange={(e) => { setBtn1(e.target.value) }}
                               type="text"
                               placeholder="Napis na buttonie slide 1" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Napis na buttonie slide 2
                        <input className="addProduct__input"
                               name="slide2Btn"
                               value={btn2}
                               onChange={(e) => { setBtn2(e.target.value) }}
                               type="text"
                               placeholder="Napis na buttonie slide 2" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Napis na buttonie slide 3
                        <input className="addProduct__input"
                               name="slide3Btn"
                               value={btn3}
                               onChange={(e) => { setBtn3(e.target.value) }}
                               type="text"
                               placeholder="Napis na buttonie slide 3" />
                    </label>

                    <label className="addProduct__label addProduct__label--frame">
                        Link slide 1
                        <input className="addProduct__input"
                               name="slide1Link"
                               value={link1}
                               onChange={(e) => { setLink1(e.target.value) }}
                               type="text"
                               placeholder="Link slide 1" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Link slide 2
                        <input className="addProduct__input"
                               name="slide2Link"
                               value={link2}
                               onChange={(e) => { setLink2(e.target.value) }}
                               type="text"
                               placeholder="Link slide 2" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Link slide 3
                        <input className="addProduct__input"
                               name="slide3Link"
                               value={link3}
                               onChange={(e) => { setLink3(e.target.value) }}
                               type="text"
                               placeholder="Link slide 3" />
                    </label>

                    <label className="addProduct__label addProduct__label--frame">
                        Nagłówek slide dolny 1
                        <input className="addProduct__input"
                               name="slideBottom1Header"
                               value={headerBottom1}
                               onChange={(e) => { setHeaderBottom1(e.target.value) }}
                               type="text"
                               placeholder="Nagłówek slide 1" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Nagłówek slide dolny 2
                        <input className="addProduct__input"
                               name="slideBottom2Header"
                               value={headerBottom2}
                               onChange={(e) => { setHeaderBottom2(e.target.value) }}
                               type="text"
                               placeholder="Nagłówek slide 2" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Nagłówek slide dolny 3
                        <input className="addProduct__input"
                               name="slideBottom3Header"
                               value={headerBottom3}
                               onChange={(e) => { setHeaderBottom3(e.target.value) }}
                               type="text"
                               placeholder="Nagłówek slide 3" />
                    </label>

                    <label className="addProduct__label addProduct__label--frame">
                        Tekst slide dolny 1
                        <textarea className="addProduct__input addProduct__input--textarea"
                                  name="slideBottom1Text"
                                  value={textBottom1}
                                  onChange={(e) => { setTextBottom1(e.target.value) }}
                                  placeholder="Tekst slide dolny 1" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Tekst slide dolny 2
                        <textarea className="addProduct__input addProduct__input--textarea"
                                  name="slideBottom2Text"
                                  value={textBottom2}
                                  onChange={(e) => { setTextBottom2(e.target.value) }}
                                  placeholder="Tekst slide dolny 2" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Tekst slide dolny 3
                        <textarea className="addProduct__input addProduct__input--textarea"
                                  name="slideBottom3Text"
                                  value={textBottom3}
                                  onChange={(e) => { setTextBottom3(e.target.value) }}
                                  placeholder="Tekst slide dolny 3" />
                    </label>

                    <label className="addProduct__label addProduct__label--frame">
                        Link slide dolny 1
                        <input className="addProduct__input"
                               name="slideBottom1Link"
                               value={linkBottom1}
                               onChange={(e) => { setLinkBottom1(e.target.value) }}
                               type="text"
                               placeholder="Link slide dolny 1" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Link slide dolny 2
                        <input className="addProduct__input"
                               name="slideBottom2Link"
                               value={linkBottom2}
                               onChange={(e) => { setLinkBottom2(e.target.value) }}
                               type="text"
                               placeholder="Link slide dolny 2" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Link slide dolny 3
                        <input className="addProduct__input"
                               name="slideBottom3Link"
                               value={linkBottom3}
                               onChange={(e) => { setLinkBottom3(e.target.value) }}
                               type="text"
                               placeholder="Link slide dolny 3" />
                    </label>

                    <label className="fileInputLabel">
                        <span>Slide 1</span>
                        <input type="file"
                               className="product__fileInput"
                               name="slide1" />
                        {image1 && !deleteImg1 ? <section className="miniature">
                            <button className="miniature__deleteBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteImg1(true); }}>
                                x
                            </button>
                            <img className="miniature__img" src={`${settings.API_URL}/image?url=/media/${image1}`} alt="zdjecie-produktu" />
                        </section> : ""}
                    </label>
                    <label className="fileInputLabel">
                        <span>Slide 2</span>
                        <input type="file"
                               className="product__fileInput"
                               name="slide2" />
                        {image2 && !deleteImg2 ? <section className="miniature">
                            <button className="miniature__deleteBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteImg2(true); }}>
                                x
                            </button>
                            <img className="miniature__img" src={`${settings.API_URL}/image?url=/media/${image2}`} alt="zdjecie-produktu" />
                        </section> : ""}
                    </label>
                    <label className="fileInputLabel">
                        <span>Slide 3</span>
                        <input type="file"
                               className="product__fileInput"
                               name="slide3" />
                        {image3 && !deleteImg3 ? <section className="miniature">
                            <button className="miniature__deleteBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteImg3(true); }}>
                                x
                            </button>
                            <img className="miniature__img" src={`${settings.API_URL}/image?url=/media/${image3}`} alt="zdjecie-produktu" />
                        </section> : ""}
                    </label>
                    <label className="fileInputLabel">
                        <span>Slide dolny 1</span>
                        <input type="file"
                               className="product__fileInput"
                               name="slidebottom1" />
                        {image4 && !deleteImg4 ? <section className="miniature">
                            <button className="miniature__deleteBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteImg4(true); }}>
                                x
                            </button>
                            <img className="miniature__img" src={`${settings.API_URL}/image?url=/media/${image4}`} alt="zdjecie-produktu" />
                        </section> : ""}
                    </label>
                    <label className="fileInputLabel">
                        <span>Slide dolny 2</span>
                        <input type="file"
                               className="product__fileInput"
                               name="slidebottom2" />
                        {image5 && !deleteImg5 ? <section className="miniature">
                            <button className="miniature__deleteBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteImg5(true); }}>
                                x
                            </button>
                            <img className="miniature__img" src={`${settings.API_URL}/image?url=/media/${image5}`} alt="zdjecie-produktu" />
                        </section> : ""}
                    </label>
                    <label className="fileInputLabel">
                        <span>Slide dolny 3</span>
                        <input type="file"
                               className="product__fileInput"
                               name="slidebottom3" />
                        {image6 && !deleteImg6 ? <section className="miniature">
                            <button className="miniature__deleteBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteImg6(true); }}>
                                x
                            </button>
                            <img className="miniature__img" src={`${settings.API_URL}/image?url=/media/${image6}`} alt="zdjecie-produktu" />
                        </section> : ""}
                    </label>
                    <label className="fileInputLabel">
                        <span>Slide mobile 1</span>
                        <input type="file"
                               className="product__fileInput"
                               name="mobile1" />
                        {image7 && !deleteImg7 ? <section className="miniature">
                            <button className="miniature__deleteBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteImg7(true); }}>
                                x
                            </button>
                            <img className="miniature__img" src={`${settings.API_URL}/image?url=/media/${image7}`} alt="zdjecie-produktu" />
                        </section> : ""}
                    </label>
                    <label className="fileInputLabel">
                        <span>Slide mobile 2</span>
                        <input type="file"
                               className="product__fileInput"
                               name="mobile2" />
                        {image8 && !deleteImg8 ? <section className="miniature">
                            <button className="miniature__deleteBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteImg8(true); }}>
                                x
                            </button>
                            <img className="miniature__img" src={`${settings.API_URL}/image?url=/media/${image8}`} alt="zdjecie-produktu" />
                        </section> : ""}
                    </label>
                    <label className="fileInputLabel">
                        <span>Slide mobile 3</span>
                        <input type="file"
                               className="product__fileInput"
                               name="mobile3" />
                        {image9 && !deleteImg9 ? <section className="miniature">
                            <button className="miniature__deleteBtn" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDeleteImg9(true); }}>
                                x
                            </button>
                            <img className="miniature__img" src={`${settings.API_URL}/image?url=/media/${image9}`} alt="zdjecie-produktu" />
                        </section> : ""}
                    </label>

                    <button className="addProduct__btn" type="submit">
                        Edytuj slider
                    </button>
                </form>

                {/* ENGLISH */}
                <form className="panelContent__frame__form categoriesForm"
                      method="POST"
                      action="http://localhost:5000/slider/update"
                      encType="multipart/form-data"
                >

                    <input className="input--hidden"
                           value="en"
                           name="language" />

                    <label className="addProduct__label addProduct__label--frame">
                        Nagłówek slide 1
                        <input className="addProduct__input"
                               name="slide1Header"
                               value={header1En}
                               onChange={(e) => { setHeader1En(e.target.value) }}
                               type="text"
                               placeholder="Nagłówek slide 1" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Nagłówek slide 2
                        <input className="addProduct__input"
                               name="slide2Header"
                               value={header2En}
                               onChange={(e) => { setHeader2En(e.target.value) }}
                               type="text"
                               placeholder="Nagłówek slide 2" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Nagłówek slide 3
                        <input className="addProduct__input"
                               name="slide3Header"
                               value={header3En}
                               onChange={(e) => { setHeader3En(e.target.value) }}
                               type="text"
                               placeholder="Nagłówek slide 3" />
                    </label>

                    <label className="addProduct__label addProduct__label--frame">
                        Tekst slide 1
                        <textarea className="addProduct__input addProduct__input--textarea"
                                  name="slide1Text"
                                  value={text1En}
                                  onChange={(e) => { setText1En(e.target.value) }}
                                  placeholder="Tekst slide 1" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Tekst slide 2
                        <textarea className="addProduct__input addProduct__input--textarea"
                                  name="slide2Text"
                                  value={text2En}
                                  onChange={(e) => { setText2En(e.target.value) }}
                                  placeholder="Tekst slide 2" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Tekst slide 3
                        <textarea className="addProduct__input addProduct__input--textarea"
                                  name="slide3Text"
                                  value={text3En}
                                  onChange={(e) => { setText3En(e.target.value) }}
                                  placeholder="Tekst slide 3" />
                    </label>

                    <label className="addProduct__label addProduct__label--frame">
                        Napis na buttonie slide 1
                        <input className="addProduct__input"
                               name="slide1Btn"
                               value={btn1En}
                               onChange={(e) => { setBtn1En(e.target.value) }}
                               type="text"
                               placeholder="Napis na buttonie slide 1" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Napis na buttonie slide 2
                        <input className="addProduct__input"
                               name="slide2Btn"
                               value={btn2En}
                               onChange={(e) => { setBtn2En(e.target.value) }}
                               type="text"
                               placeholder="Napis na buttonie slide 2" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Napis na buttonie slide 3
                        <input className="addProduct__input"
                               name="slide3Btn"
                               value={btn3En}
                               onChange={(e) => { setBtn3En(e.target.value) }}
                               type="text"
                               placeholder="Napis na buttonie slide 3" />
                    </label>

                    <label className="addProduct__label addProduct__label--frame">
                        Link slide 1
                        <input className="addProduct__input"
                               name="slide1Link"
                               value={link1En}
                               onChange={(e) => { setLink1En(e.target.value) }}
                               type="text"
                               placeholder="Link slide 1" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Link slide 2
                        <input className="addProduct__input"
                               name="slide2Link"
                               value={link2En}
                               onChange={(e) => { setLink2En(e.target.value) }}
                               type="text"
                               placeholder="Link slide 2" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Link slide 3
                        <input className="addProduct__input"
                               name="slide3Link"
                               value={link3En}
                               onChange={(e) => { setLink3En(e.target.value) }}
                               type="text"
                               placeholder="Link slide 3" />
                    </label>

                    <label className="addProduct__label addProduct__label--frame">
                        Nagłówek slide dolny 1
                        <input className="addProduct__input"
                               name="slideBottom1Header"
                               value={headerBottom1En}
                               onChange={(e) => { setHeaderBottom1En(e.target.value) }}
                               type="text"
                               placeholder="Nagłówek slide 1" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Nagłówek slide dolny 2
                        <input className="addProduct__input"
                               name="slideBottom2Header"
                               value={headerBottom2En}
                               onChange={(e) => { setHeaderBottom2En(e.target.value) }}
                               type="text"
                               placeholder="Nagłówek slide 2" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Nagłówek slide dolny 3
                        <input className="addProduct__input"
                               name="slideBottom3Header"
                               value={headerBottom3En}
                               onChange={(e) => { setHeaderBottom3En(e.target.value) }}
                               type="text"
                               placeholder="Nagłówek slide 3" />
                    </label>

                    <label className="addProduct__label addProduct__label--frame">
                        Tekst slide dolny 1
                        <textarea className="addProduct__input addProduct__input--textarea"
                                  name="slideBottom1Text"
                                  value={textBottom1En}
                                  onChange={(e) => { setTextBottom1En(e.target.value) }}
                                  placeholder="Tekst slide dolny 1" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Tekst slide dolny 2
                        <textarea className="addProduct__input addProduct__input--textarea"
                                  name="slideBottom2Text"
                                  value={textBottom2En}
                                  onChange={(e) => { setTextBottom2En(e.target.value) }}
                                  placeholder="Tekst slide dolny 2" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Tekst slide dolny 3
                        <textarea className="addProduct__input addProduct__input--textarea"
                                  name="slideBottom3Text"
                                  value={textBottom3En}
                                  onChange={(e) => { setTextBottom3En(e.target.value) }}
                                  placeholder="Tekst slide dolny 3" />
                    </label>

                    <label className="addProduct__label addProduct__label--frame">
                        Link slide dolny 1
                        <input className="addProduct__input"
                               name="slideBottom1Link"
                               value={linkBottom1En}
                               onChange={(e) => { setLinkBottom1En(e.target.value) }}
                               type="text"
                               placeholder="Link slide dolny 1" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Link slide dolny 2
                        <input className="addProduct__input"
                               name="slideBottom2Link"
                               value={linkBottom2En}
                               onChange={(e) => { setLinkBottom2En(e.target.value) }}
                               type="text"
                               placeholder="Link slide dolny 2" />
                    </label>
                    <label className="addProduct__label addProduct__label--frame">
                        Link slide dolny 3
                        <input className="addProduct__input"
                               name="slideBottom3Link"
                               value={linkBottom3En}
                               onChange={(e) => { setLinkBottom3En(e.target.value) }}
                               type="text"
                               placeholder="Link slide dolny 3" />
                    </label>

                    <button className="addProduct__btn" type="submit">
                        Edytuj wersję angielską
                    </button>
                </form>
            </div> : <section className="addedMsgWrapper">
                <h2 className="addedMsg">
                    {addedMsg}
                </h2>
            </section>}
        </section>
    </main>
};

export default PanelSliderContent;
