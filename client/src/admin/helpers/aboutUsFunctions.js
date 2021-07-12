import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const getAllSections = () => {
    return axios.get(`${API_URL}/about-us/get-all`);
}

const deleteSection = (id) => {
    return axios.post(`${API_URL}/about-us/delete`, { id });
}

const getSection = (id) => {
    return axios.post(`${API_URL}/about-us/get-section`, { id });
}

export { getAllSections, deleteSection, getSection }
