import React, {useState, useEffect, useContext} from 'react'
import {getAllSections} from "../admin/helpers/aboutUsFunctions";
import HomePageSection from "./HomePageSection";
import {LangContext} from "../App";

const AboutUsContent = () => {
    const [sections, setSections] = useState([]);

    const { content } = useContext(LangContext);

    useEffect(() => {
        getAllSections()
            .then(res => {
                if(res?.data?.result) {
                    setSections(res.data.result.filter((item) => {
                        return item.content;
                    }));
                }
            });
    }, []);

    return <main className="offerContent">
        <h1 className="aboutUs__header">
            {content.aboutUs}
        </h1>
        <HomePageSection />
    </main>
}

export default AboutUsContent;
