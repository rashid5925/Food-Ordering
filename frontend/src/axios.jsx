import axios from "axios";

const API = axios.create({
    baseURL: 'http://13.49.225.14:3000/api',

});

export default API;
