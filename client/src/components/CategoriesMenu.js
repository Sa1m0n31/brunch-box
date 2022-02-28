import React, {useEffect, useState} from 'react';
import {getAllCategories} from "../helpers/categoryFunctions";
import settings from "../helpers/settings";
import convertToURL from "../helpers/convertToURL";

const CategoriesMenu = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getAllCategories()
            .then((res) => {
                console.log(res.data.result);
                setCategories(res?.data?.result);
            });
    }, []);

    return <div className="categories">
        {categories.map((item, index) => {
            if(!item.hidden) {
                return <a className="categories__item" key={index} href={`/${convertToURL(item.name)}`}>
                    <img className="categories__item__img" src={settings.API_URL + "/image?url=/media/" + item.img_path} alt="zdjecie" />
                    <h2 className="categories__item__header">
                        {item.name}
                    </h2>
                </a>
            }
        })}
    </div>
};

export default CategoriesMenu;
