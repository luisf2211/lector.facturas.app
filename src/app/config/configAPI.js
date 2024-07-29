import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
});

const GET = (url, config = {}) => apiClient.get(url, config);
const POST = (url, data, config = {}) => apiClient.post(url, data, config); 
const PUT = (url, data, config = {}) => apiClient.put(url, data, config);
const DELETE = (url, config = {}) => apiClient.delete(url, config);

const validateResponseStatus = (request) => {
    if(request.status >= 200 && request.status <= 300){
        return {
            ok: true,
            created: true
        };
    }

    if(request.status >= 400 && request.status <= 500){
        return {
            badRequest: true,
            notFound: true
        };
    }

    if(request.status > 500 && request.status <= 600){
        return {
            serverError: true,
            timeout: true
        };
    }
    return;
}

export { GET, POST, PUT, DELETE, validateResponseStatus };