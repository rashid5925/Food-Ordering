import axios from "axios";

const API = axios.create({
    baseURL: 'http://foodordering.eu-north-1.elasticbeanstalk.com/api',

});

export default API;
