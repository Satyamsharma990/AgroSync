import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const geminiKey = localStorage.getItem('gemini_api_key');
        if (geminiKey) {
            config.headers['X-Gemini-Key'] = geminiKey;
        }

        const agroLanguage = localStorage.getItem('agro_language') || 'en-IN';
        config.headers['X-Language'] = agroLanguage;

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear token and maybe redirect or simply let the app state handle it
            localStorage.removeItem('token');
            // For a simple single-page state app without router:
            window.dispatchEvent(new Event('auth-error'));
        }
        return Promise.reject(error);
    }
);
