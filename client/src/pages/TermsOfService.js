import React, {useContext, useEffect, useState} from 'react'
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import {getPagesContent} from "../helpers/pagesFunctions";
import {LangContext} from "../App";

const TermsOfService = () => {
    const [data, setData] = useState("");
    const [dataEn, setDataEn] = useState("");

    const { content, langIndex } = useContext(LangContext);

    useEffect(() => {
        getPagesContent()
            .then(res => {
                if(res.data.result) {
                    setData(res.data.result[0].terms_of_service);
                    setDataEn(res.data.result[0].terms_of_service_en);
                }
            });
    }, []);

    return <>
        <TopMenu />
        <main className="offerContent">
            <h1 className="offerContent__header">
                {content.footerMenu[1]}
            </h1>
            <article className="pageContent"
                dangerouslySetInnerHTML={{__html: langIndex === 0 ? data : dataEn}}
            >

            </article>
        </main>
        <Footer />
    </>
}

export default TermsOfService;
