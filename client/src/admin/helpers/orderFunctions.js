import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const getAllOrders = () => {
    return axios.get(`${API_URL}/order/get-orders`);
}

const getOrderDetails = (id) => {
    return axios.post(`${API_URL}/order/get-order`, { id });
}

const calculateCartSum = (cart) => {
    let sum = 0;
    cart.forEach(item => {
        const quantity = item.quantity;
        const price = item.price;
        sum += quantity * price;
    });
    return sum;
}

const deleteOrderById = (id) => {
    return axios.post(`${API_URL}/order/delete`, { id });
}

const getRibbons = (id) => {
    return axios.post(`${API_URL}/order/get-ribbons`, { id });
}

export { getAllOrders, getOrderDetails, calculateCartSum, deleteOrderById, getRibbons };
