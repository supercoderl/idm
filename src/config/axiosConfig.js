import axios from 'axios';

const getToken = () => localStorage.getItem('token');

const axiosInstance = axios.create({
    // baseURL: 'http://localhost:5290/api/',
    baseURL: 'https://localhost:8811/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const c = config;
        const token = getToken();
        if (token) {
            c.headers.Authorization = `Bearer ${token}`;
        }
        return c;
    },
    (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
    (response) => {
        // Xử lý response trước khi trả về
        const r = response;
        return r;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const body = {
                        refreshToken: localStorage.getItem('refreshToken'),
                    };

                    const response = await axiosInstance.post('Auth/refresh-token', body);

                    localStorage.setItem('token', response.data.data.token.accessToken);
                    localStorage.setItem('refreshToken', response.data.data.refreshToken.refreshToken);

                    originalRequest.headers.Authorization = `Bearer ${response.data.data.token.accessToken}`;
                    return axios(originalRequest);
                } catch (refreshError) {
                    console.error('Lỗi khi làm mới token: ', refreshError);
                }
            } else if (error.response.status === 403) window.location.replace('/error-403');
        }
        // window.location.replace('/');
        return Promise.reject(error);
    },
);

export default axiosInstance;
