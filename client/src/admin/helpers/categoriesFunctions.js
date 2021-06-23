import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const getAllCategories = () => {
    return axios.get(`${API_URL}/category/get-all`);
}

const addCategory = ( {name, parentId, imagePath, categoryImage} ) => {
    return axios.post(`${API_URL}/category/add`, {
        name,
        parentId,
        imagePath,
        categoryImage
    }, {
        headers: {
            Accept: 'multipart/form-data'
        }
    });
}

const deleteCategory = (id) => {
    return axios.post(`${API_URL}/category/delete`, {
        id
    });
}

const updateCategory = ({id, name, parentId, imagePath, categoryImage}) => {

}

export { getAllCategories, addCategory, deleteCategory, updateCategory };
