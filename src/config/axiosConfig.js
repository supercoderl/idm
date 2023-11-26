import axios from 'axios';

const getToken = () => localStorage.getItem('token');

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5290/api/',
    // baseURL: 'https://localhost:8811/api/',
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
        const refreshToken = localStorage.getItem('refreshToken');

        if (error.response) {
            switch (error.response.status) {
                case 401:
                    if (refreshToken) {
                        try {
                            const response = await axios.post('Auth/refresh-token', {
                                refreshToken,
                            });

                            localStorage.setItem('token', response.data.data.token.accessToken);
                            localStorage.setItem('refreshToken', response.data.data.refreshToken.refreshToken);
                            return axios(originalRequest);
                        } catch (refreshError) {
                            console.error('Lỗi khi làm mới token: ', refreshError);
                        }
                    }
                    break;
                case 403:
                    window.location.replace('/error-403');
                    break;
                default:
                    console.log(error);
                    break;
            }
        }
        // window.location.replace('/');
        return Promise.reject(error);
    },
);

export default axiosInstance;
