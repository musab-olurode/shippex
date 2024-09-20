import React from 'react';
import { View } from 'react-native';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Href, useRouter } from 'expo-router';
import { Text } from '~/components/ui/text';
import { useLogin } from '~/lib/api/mutations/auth';
import { toast } from 'sonner-native';
import { AxiosError } from 'axios';
import { AuthData, ErrorResponse } from '~/lib/api/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_USER } from '~/lib/constants';
import { useQueryClient } from '@tanstack/react-query';
import { shipmentKeys } from '~/lib/api/queryKeys';
import { getShipmentStatusList } from '~/lib/api/requests/shipment';

const loginFormSchema = z.object({
	url: z
		.string({
			invalid_type_error: 'URL must be a string',
			required_error: 'A URL is required',
		})
		.refine(
			(value) => {
				if (!value) return true;
				return !value.startsWith('https://') && !value.startsWith('http://');
			},
			{
				message: 'URL must not start with https:// or http://',
			}
		)
		.refine(
			(value) => {
				if (!value) return true;
				// Regular expression for validating URLs without scheme
				const urlRegex =
					/^(?:(?:(?:[a-zA-Z\d](?:[-a-zA-Z\d]*[a-zA-Z\d])?\.)+[a-zA-Z]{2,})|(?:\d{1,3}(?:\.\d{1,3}){3}))(?::\d+)?(?:\/[-a-zA-Z\d%_.~+]*)*(?:\?[;&a-zA-Z\d%_.~+=-]*)?(?:#[-a-zA-Z\d_]*)?$/;
				return urlRegex.test(value);
			},
			{
				message: 'Invalid URL format',
			}
		)
		.optional(),
	username: z.union([
		z
			.string({
				invalid_type_error: 'Username / Email must be a string',
				required_error: 'A username or email is required',
			})
			.min(3, 'Username / Email must be at least 3 characters'),
		z.string().email('Invalid email'),
	]),
	password: z.string({
		invalid_type_error: 'Password must be a string',
		required_error: 'A password is required',
	}),
});
type FormData = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
	const router = useRouter();
	const [formData, setFormData] = React.useState<FormData>({
		url: '',
		username: '',
		password: '',
	});
	const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
	const { mutate, isPending } = useLogin({
		onError: handleOnError,
		onSuccess: handleOnSuccess,
	});
	const queryClient = useQueryClient();

	function handleOnError(error: AxiosError<ErrorResponse>) {
		let errorMessage =
			error.response?.data.message ||
			error.message ||
			'Uh oh! Something went wrong.';
		toast.error(errorMessage, { richColors: true });
	}

	async function handleOnSuccess(data: AuthData) {
		queryClient.prefetchQuery({
			queryKey: [shipmentKeys.readStatusList],
			queryFn: getShipmentStatusList,
		});
		await AsyncStorage.setItem(AUTH_USER, JSON.stringify(data));
		router.push('/shipments' as Href<string | object>);
	}

	const handleChange = (name: keyof FormData) => (value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	const validate = (): boolean => {
		try {
			loginFormSchema.parse(formData);
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: { [key: string]: string } = {};
				error.errors.forEach((err) => {
					if (err.path) {
						newErrors[err.path[0]] = err.message;
					}
				});
				setErrors(newErrors);
			}
			return false;
		}
	};

	const handleSubmit = () => {
		if (validate()) {
			mutate({ usr: formData.username, pwd: formData.password });
		}
	};

	return (
		<View className='flex flex-col justify-between grow gap-y-[1.9375rem] pb-[4.125rem]'>
			<View className='flex flex-col gap-y-[1.9375rem]'>
				<Input
					placeholder='URL'
					keyboardType='url'
					autoCapitalize='none'
					prefix={
						<Text className='text-[#58536E] font-normal text-base'>
							https://
						</Text>
					}
					onChangeText={handleChange('url')}
					onBlur={validate}
					value={formData.url}
					errorMessage={errors?.url}
				/>
				<Input
					keyboardType='email-address'
					autoCapitalize='none'
					placeholder='Username / Email'
					onChangeText={handleChange('username')}
					onBlur={validate}
					value={formData.username}
					errorMessage={errors?.username}
				/>
				<Input
					placeholder='Password'
					autoCapitalize='none'
					secureTextEntry
					onChangeText={handleChange('password')}
					onBlur={validate}
					value={formData.password}
					errorMessage={errors?.password}
				/>
			</View>
			<Button
				className='w-full'
				disabled={
					!formData.username ||
					!formData.password ||
					!!errors.username ||
					!!errors.password
				}
				loading={isPending}
				onPress={handleSubmit}
			>
				<Text>Login</Text>
			</Button>
		</View>
	);
}
