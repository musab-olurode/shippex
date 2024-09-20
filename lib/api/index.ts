import axios from 'axios';
import { router } from 'expo-router';

const baseURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/method`;

const axiosInstance = axios.create({
	baseURL,
	withCredentials: true,
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401 || error.response?.status === 403) {
			router.replace('/login');
		}
		return Promise.reject(error);
	}
);

axiosInstance.interceptors.request.use(
	async (request) => {
		return request;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default axiosInstance;
