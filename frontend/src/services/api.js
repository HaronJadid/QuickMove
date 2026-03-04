import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

const api = axios.create({
    baseURL: `${API_URL}api`,
    timeout: 5000,
});

export const createEvaluation = async (data) => {
    const response = await api.post('/evaluations', data);
    return response.data;
};

export const getDriverEvaluations = async (livreurId) => {
    const response = await api.get(`/evaluations/drivers/${livreurId}`);
    return response.data;
};

export default api;
