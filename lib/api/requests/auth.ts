import axiosInstance from '..';
import { LoginRequest } from '../types';

export const login = async (payload: LoginRequest) => {
	const { data } = await axiosInstance.post('/login', payload);
	return data;
};

export const logout = async () => {
	const { data } = await axiosInstance.post('/logout');
	return data;
};
