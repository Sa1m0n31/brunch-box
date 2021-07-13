import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const getAllPosts = () => {
    return axios.get(`${API_URL}/blog/get-all`);
}

const getPostByTitle = (title) => {
    return axios.post(`${API_URL}/blog/get-post-by-title`, { title });
}

export { getAllPosts, getPostByTitle }
