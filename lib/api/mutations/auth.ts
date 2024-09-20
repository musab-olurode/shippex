import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authKeys } from '~/lib/api/queryKeys';
import { login, logout } from '~/lib/api/requests/auth';
import { AuthData, ErrorResponse, LoginRequest } from '~/lib/api/types';

export const useLogin = (
	options?: Partial<
		UseMutationOptions<
			AuthData,
			AxiosError<ErrorResponse>,
			LoginRequest,
			unknown
		>
	>
) => {
	return useMutation({
		mutationKey: [authKeys.patch],
		mutationFn: login,
		...options,
	});
};

export const useLogout = (
	options?: Partial<
		UseMutationOptions<unknown, AxiosError<ErrorResponse>, void, unknown>
	>
) => {
	return useMutation({
		mutationKey: [authKeys.delete],
		mutationFn: logout,
		...options,
	});
};
