import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { AUTH_USER } from '~/lib/constants';
import { AuthData } from '~/lib/api/types';

function useUser() {
	const [user, setUser] = useState<AuthData>();

	useEffect(() => {
		const fetchUser = async () => {
			const rawUser = await AsyncStorage.getItem(AUTH_USER);
			if (!rawUser) {
				return;
			}
			const user = JSON.parse(rawUser);
			setUser(user);
		};

		fetchUser();
	}, []);

	return { user };
}

export default useUser;
