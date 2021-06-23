import axios from "axios";
import settings from "./settings";

const auth = (sessionKey) => {
    return axios.post(`${settings.API_URL}/auth/auth`, {
        sessionKey
    });
}

export default auth;
