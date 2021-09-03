import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const getAllAdmins = () => {
    return axios.get(`${API_URL}/user/get-all-admins`);
}

const addAdmin = ({username, email, password1}, sessionKey) => {
    return axios.post(`${API_URL}/auth/register-admin`, {
       username,
       email,
       password: password1,
       sessionKey
    });
}

const deleteAdmin = (id, sessionKey) => {
    return axios.post(`${API_URL}/user/delete-admin`, {
        id, sessionKey
    });
}

const changePassword = ({username, oldPassword, newPassword}, sessionKey) => {
    return axios.post(`${API_URL}/user/change-admin-password`, {
        username,
        oldPassword,
        newPassword,
        sessionKey
    });
}

export { getAllAdmins, addAdmin, deleteAdmin, changePassword };
