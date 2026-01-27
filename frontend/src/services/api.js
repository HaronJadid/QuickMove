import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Adjust if backend runs on different port
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
