import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const getAllPosts = () => {
    return axios.get(`${API_URL}/blog/get-all`);
}

export { getAllPosts }
