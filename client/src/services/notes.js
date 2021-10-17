import axios from "axios";
const baseUrl = "https://safe-inlet-54959.herokuapp.com";

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then((resp) => resp.data);
};
const create = (newObject) => {
    const request = axios.post(baseUrl, newObject);
    return request.then((resp) => resp.data);
};
const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject);
    return request.then((resp) => resp.data);
};

export default { getAll, create, update };
