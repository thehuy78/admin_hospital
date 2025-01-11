import axios from 'axios';
import { withCookies } from 'react-cookie';


const urlApi = "http://103.12.77.74:8080/chatservice/";
// const urlApi = "http://localhost:8080/chatservice/";
export const apiRequestForm = async (method, uri, data = null) => {
    try {
        const config = {
            method: method,
            url: urlApi + uri,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            data: data
        };

        const response = await axios(config);
        return response;
    } catch (error) {
        console.error("API request error:", error);
        // throw error;
    }
};

export const apiRequest = async (method, uri, data = null) => {
    try {
        const config = {
            method: method,
            url: urlApi + uri,
            headers: {
                "Content-Type": "application/json",
            },
            data: data
            , withCredentials: true,
        };

        const response = await axios(config);
        return response;
    } catch (error) {
        console.error("API request error:", error);
        // throw error;
    }
};


export default apiRequestForm;
