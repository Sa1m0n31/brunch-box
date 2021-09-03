import axios from "axios";
import settings from "./settings";

//const { API_URL } = settings;
const API_URL = 'https://brunchbox.pl'; /* TODO */

const getAllDeliveryPrices = () => {
    return axios.get(`${API_URL}/maps/get-delivery-prices`);
}

const getSingleDeliveryPrice = (id) => {
    return axios.post(`${API_URL}/maps/get-single-delivery`, { id })
}

const addDeliveryPrice = (kmFrom, kmTo, price) => {
    return axios.post(`${API_URL}/maps/add-delivery-price`, { kmFrom, kmTo, price });
}

const updateDeliveryPrice = (id, kmFrom, kmTo, price) => {
    return axios.post(`${API_URL}/maps/update-delivery-price`, { id, kmFrom, kmTo, price });
}

const deleteDeliveryPrice = (id) => {
    return axios.post(`${API_URL}/maps/delete-delivery-price`, { id });
}

export { getAllDeliveryPrices, getSingleDeliveryPrice, addDeliveryPrice, updateDeliveryPrice, deleteDeliveryPrice };
