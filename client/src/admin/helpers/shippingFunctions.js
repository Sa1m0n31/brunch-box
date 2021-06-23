import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const getAllShippingMethods = () => {
    return axios.get(`${API_URL}/shipping/get-all-shipping-methods`);
}

const deleteShippingMethod = (id) => {
    return axios.post(`${API_URL}/shipping/delete`, { id });
}

export { getAllShippingMethods, deleteShippingMethod }
