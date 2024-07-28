import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
});

const GET = (url, config = {}) => apiClient.get(url, config);
const POST = (url, data, config = {}) => apiClient.post(url, data, config); 
const PUT = (url, data, config = {}) => apiClient.put(url, data, config);
const DELETE = (url, config = {}) => apiClient.delete(url, config);

const validateResponseStatus = (request) => {
    if(request.response.status >= 200 && request.response.status <= 300){
        return {
            ok: true,
            created: true
        };
    }

    if(request.response.status >= 400 && request.response.status <= 500){
        return {
            badRequest: true,
            notFound: true
        };
    }

    if(request.response.status > 500 && request.response.status <= 600){
        return {
            serverError: true,
            timeout: true
        };
    }
    return;
}

export { GET, POST, PUT, DELETE, validateResponseStatus };