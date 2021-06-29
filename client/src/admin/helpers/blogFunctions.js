import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const addPosts = ({title, content, featuredImage}) => {
    return axios.post(`${API_URL}/blog/add`, {
        title, content, featuredImage
    });
}

export { addPosts }
