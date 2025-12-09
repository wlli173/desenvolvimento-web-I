// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

// Interceptor para configurar headers dinamicamente
api.interceptors.request.use(
    (config) => {
        // Se os dados forem FormData, NÃO defina Content-Type
        // Se não for FormData, defina como application/json
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        } else {
            // Para FormData, deixe o navegador definir o Content-Type
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const publicRoutes = ['/login', '/register'];
            const currentPath = window.location.pathname;
            if (!publicRoutes.includes(currentPath)) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;