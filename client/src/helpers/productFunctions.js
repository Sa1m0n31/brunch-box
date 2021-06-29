import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const getAllProducts = () => {
    return axios.get(`${API_URL}/product/get-all-products`);
}

const getSingleProduct = (id) => {
    return axios.post(`${API_URL}/product/single-product`, { id });
}

const getProductById = (id) => {
    return axios.post(`${API_URL}/product/get-product-by-id`, { id });
}

const getProductByName = (name) => {
    return axios.post(`${API_URL}/product/get-product-by-name`, { name });
}

const getProductAllergens = (id) => {
    return axios.post(`${API_URL}/product/single-allergens`, { id });
}

const getImageById = (id) => {
    return axios.post(`${API_URL}/product/get-image`, { id });
}

export { getAllProducts, getSingleProduct, getProductByName, getProductAllergens, getImageById, getProductById };
