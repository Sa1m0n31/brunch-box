import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const getAllOrders = (sessionKey) => {
    return axios.get(`${API_URL}/order/get-orders?key=${sessionKey}`);
}

const getOrderDetails = (id, sessionKey) => {
    return axios.post(`${API_URL}/order/get-order`, { id, sessionKey });
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

const deleteOrderById = (id, sessionKey) => {
    return axios.post(`${API_URL}/order/delete`, { id, sessionKey });
}

const getRibbons = (id, sessionKey) => {
    return axios.post(`${API_URL}/order/get-ribbons`, { id, sessionKey });
}

export { getAllOrders, getOrderDetails, calculateCartSum, deleteOrderById, getRibbons };
