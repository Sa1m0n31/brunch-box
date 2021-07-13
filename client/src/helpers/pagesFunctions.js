import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const getPagesContent = () => {
   return axios.get(`${API_URL}/pages/content`);
}

export  { getPagesContent }
