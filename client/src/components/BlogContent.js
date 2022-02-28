import React, { useEffect, useState } from 'react'
import { getAllPosts } from "../helpers/blogFunctions";
import settings from "../admin/helpers/settings";

import exampleImg from '../static/img/brunchbox-3.png'
import convertToURL from "../helpers/convertToURL";

const BlogContent = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getAllPosts()
            .then(res => {
                setPosts(res.data.result);
            });
    }, []);

    const excerpt = (content) => {
        return content.split("---")[0].replaceAll(/&nbsp;/g, " ").replaceAll("---", "").replaceAll(/\<(.|..)\>/gi, '');
    }

    return <main className="offerContent">
        <h1 className="offerContent__header">
            Blog
        </h1>
        <main className="blogContent">
            {posts?.map((item, index) => (
                <a key={index} className="blogContent__item" href={`/wpis/${convertToURL(item.title)}`}>
                    <figure className="blogContent__item__imgWrapper">
                        <img className="blogContent__item__img" src={settings.API_URL + "/image?url=/media/" + item.img_path} alt={item.title} />
                    </figure>

                    <h2 className="blogContent__item__title">
                        {item.title}
                    </h2>

                    <p className="blogContent__item__excerpt">
                        {excerpt(item.content)}
                    </p>
                </a>
            ))}
        </main>
    </main>
}

export default BlogContent;
