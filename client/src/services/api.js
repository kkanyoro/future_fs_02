import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// runs before every request leaves the app
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        // If token exists add it to  header
        if (token) {
            config.headers['x-auth-token'] = token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// if token expires automatically log user out
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirect to login
        }
        return Promise.reject(error);
    }
);

export default api;