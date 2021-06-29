import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const getAllCategories = () => {
    return axios.get(`${API_URL}/category/get-all`);
}

const getCategoryByName = (name) => {
    return axios.post(`${API_URL}/category/get-category-by-name`, { name });
}

export  { getAllCategories, getCategoryByName }
