import React from 'react';
import { Text } from '~/components/ui/text';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useLogout } from '~/lib/api/mutations/auth';

export default function Screen() {
	const { mutateAsync: logout, isPending: isLogoutPending } = useLogout({
		onSuccess: () => AsyncStorage.clear(),
	});
	const router = useRouter();

	const handleOnLogout = async () => {
		await logout();
		router.replace('/login');
	};

	return (
		<View className='px-4 pb-4'>
			<Button
				variant='destructive'
				className='w-full'
				loading={isLogoutPending}
				onPress={handleOnLogout}
			>
				<Text>Logout</Text>
			</Button>
		</View>
	);
}
