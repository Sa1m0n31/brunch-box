import React, { useEffect, useState } from 'react'
import {getAllPosts, getPostByTitle} from "../helpers/blogFunctions";
import {convertToString} from "../helpers/convertToURL";

const SinglePostContent = () => {
    const [post, setPost] = useState({});
    const [headers, setHeaders] = useState([]);

    useEffect(() => {
        const title = convertToString(decodeURIComponent(window.location.href.split("/")[window.location.href.split("/").length-1].split("#header")[0]));
        getPostByTitle(title)
            .then(res => {
                if(res.data) {
                    setPost(res.data.result);
                    findHeaders(res.data.result?.content);
                }
            });
    }, []);

    const findHeaders = (content) => {
        const headersRegEx = content?.match(/<strong><span style="font-size: ..px;">.{0,300}<\/span><\/strong>/g);
        setHeaders(headersRegEx?.map((item) => {
            return item.split(">")[2].replace("</span", "");
        }));
        addAnchors();
    }

    const addAnchors = () => {
        const allHeaders = document.querySelectorAll("p>strong>span");
        allHeaders.forEach((item, index) => {
            item.id = "header" + index;
        });
    }

    const hideTop = () => {
        const topBar = document.querySelector(".topBar");
        const topMenu = document.querySelector(".topMenu");

        topBar.style.opacity = "0";
        topBar.style.transform = "scaleY(0)";
        topMenu.style.opacity = "0";
        topMenu.style.transform = "scaleY(0)";
    }

    return <main className="singleProduct singleProduct--post">
        <h1 className="singlePost__title">
            {post?.title}
        </h1>
        <main className="singlePost__content">
            <article className="singlePost__article" dangerouslySetInnerHTML={{__html: post?.content?.replace(/&nbsp;/g, " ")}} >

            </article>
            <aside className="singlePost__aside">
                {headers?.length ? <h4 className="singlePost__aside__header">
                    Spis treści
                </h4> : ""}
                <ul className="singlePost__aside__list">
                    {headers?.map((item, index) => (
                        <li className="singlePost__aside__list__item" key={index}>
                            <a href={`#header${index}`}>
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>
            </aside>
        </main>
    </main>
}

export default SinglePostContent;
