import React, {useContext, useEffect, useState} from 'react'
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import {getPagesContent} from "../helpers/pagesFunctions";
import {LangContext} from "../App";

const PrivacyPolicy = () => {
    const { content, langIndex } = useContext(LangContext);

    const [data, setData] = useState("");
    const [dataEn, setDataEn] = useState("");

    useEffect(() => {
        getPagesContent()
            .then(res => {
                if(res.data.result) {
                    setData(res.data.result[0].privacy_policy);
                    setDataEn(res.data.result[0].privacy_policy_en);
                }
            });
    }, []);

    return <>
        <TopMenu />
        <main className="offerContent">
            <h1 className="offerContent__header">
                {content.footerMenu[0]}
            </h1>
            <article className="pageContent"
                dangerouslySetInnerHTML={{__html: langIndex === 0 ? data : dataEn}}
            >

            </article>
        </main>
        <Footer />
    </>
}

export default PrivacyPolicy;
