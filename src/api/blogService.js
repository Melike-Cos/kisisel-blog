import api from './axiosConfig';

// Tüm yazıları getir (Parametrik Yapı)
export const getPosts = async (params = {}) => {
    const { pageNumber = 1, pageSize = 10, searchTerm } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('pageNumber', pageNumber);
    queryParams.append('pageSize', pageSize);

    if (searchTerm) {
        queryParams.append('searchTerm', searchTerm);
    }

    const response = await api.get(`/products?${queryParams.toString()}`);
    
    // API'den gelen veriyi dönelim
    return response.data?.data?.items || response.data || [];
};

// Tek yazı getir
export const getPostById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data?.data || response.data;
};

// Yeni yazı ekle
export const createPost = async (postData) => {
    const response = await api.post('/products', postData);
    return response.data;
};

// Silme ve Güncelleme
export const deletePost = async (id) => {
    await api.delete(`/products/${id}`);
    return true;
};

export const updatePost = async (id, postData) => {
    const response = await api.put(`/products/${id}`, postData);
    return response.data;
};