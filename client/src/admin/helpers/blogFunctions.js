import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const getAllPosts = () => {
    return axios.get(`${API_URL}/blog/get-all`);
}

const deletePost = (id) => {
    return axios.post(`${API_URL}/blog/delete`, { id });
}

const getSinglePost = (id) => {
    return axios.post(`${API_URL}/blog/get-post-by-id`, { id });
}

export { getAllPosts, deletePost, getSinglePost }
