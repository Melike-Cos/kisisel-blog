import api from './axiosConfig';

export const login = async (email, password) => {
    // API'nin beklediği format
    const response = await api.post('/auth/login', { email, password });
    
    //  Context bu veriyi işler
    return response.data; 
};
