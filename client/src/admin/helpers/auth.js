import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const auth = (sessionKey) => {
    return axios.post(`${API_URL}/auth/auth`, {
        sessionKey
    });
}

export default auth;
