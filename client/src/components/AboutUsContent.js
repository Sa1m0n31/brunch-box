import React, { useState, useEffect } from 'react'
import AboutUsSection from "./AboutUsSection";

import {getAllSections} from "../admin/helpers/aboutUsFunctions";

import settings from "../helpers/settings";
import HomePageSection from "./HomePageSection";

const AboutUsContent = () => {
    const [sections, setSections] = useState([]);

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
        <h2 className="aboutUs__header">
            O nas
        </h2>
        <HomePageSection />
    </main>
}

export default AboutUsContent;
