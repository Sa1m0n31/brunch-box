import React, {useContext, useEffect} from 'react'
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import {LangContext} from "../App";
import {Helmet} from "react-helmet";

const TYPage = () => {
    const { content, langIndex } = useContext(LangContext);

    return <>
        <Helmet>
            <title>Brunchbox | Dziękujemy</title>
        </Helmet>
        <TopMenu />
        <main className="tyPage">
            <h1 className="ty__header">
                {content?.ty1}
            </h1>
            <h2 className="ty__subheader">
                {content?.ty2}
            </h2>

            <button className="button button--landing button--ty marginTop30">
                <a className="button--landing__link" href="/">
                    {content?.ty3}
                </a>
            </button>
        </main>
        <Footer />
    </>
}

export default TYPage;
