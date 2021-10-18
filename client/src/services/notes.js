import axios from "axios";
const baseUrl = "/api/notes"; // relative url
/**
 * The relative url will work when running the express server in development mode,
 * and having it serve the built app...
 *
 * However it will break when testing the frontend by itself (with "npm run start")
 */

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
