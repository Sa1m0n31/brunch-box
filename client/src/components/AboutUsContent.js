import React, { useState, useEffect } from 'react'
import AboutUsSection from "./AboutUsSection";

import {getAllSections} from "../admin/helpers/aboutUsFunctions";

import settings from "../helpers/settings";

const AboutUsContent = () => {
    const [sections, setSections] = useState([]);

    useEffect(() => {
        getAllSections()
            .then(res => {
                setSections(res.data.result);
            });
    }, []);

    return <main className="offerContent">
        {sections?.map((item, index) => (
            <AboutUsSection
                left={!(index%2)}
                image={settings.API_URL + "/image?url=/media/" + item.img_path}
                title={item.header}
                content={item.content} />
        ))}
    </main>
}

export default AboutUsContent;
