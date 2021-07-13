import React, { useEffect, useState } from 'react'
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import {getPagesContent} from "../helpers/pagesFunctions";

const PrivacyPolicy = () => {
    const [content, setContent] = useState("");

    useEffect(() => {
        getPagesContent()
            .then(res => {
                if(res.data.result) {
                    setContent(res.data.result[0].privacy_policy);
                }
            });
    }, []);

    return <>
        <TopMenu />
        <main className="offerContent">
            <h1 className="offerContent__header">
                Polityka prywatności
            </h1>
            <article className="pageContent"
                dangerouslySetInnerHTML={{__html: content}}
            >

            </article>
        </main>
        <Footer />
    </>
}

export default PrivacyPolicy;
