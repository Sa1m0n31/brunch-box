import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const getPaymentData = () => {
    return axios.get(`${API_URL}/payment/get-data`);
}

const changePaymentData = ({marchantId, crc, apiKey}) => {
    return axios.post(`${API_URL}/payment/change-data`, {
       marchantId,
       crc,
       apiKey
    });
}

export { getPaymentData, changePaymentData };
