import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import ShipmentsIcon from '~/assets/icons/shipments.svg';
import ShipmentsActiveIcon from '~/assets/icons/shipments-active.svg';
import ScanIcon from '~/assets/icons/barcode-scan.svg';
import ScanActiveIcon from '~/assets/icons/barcode-scan-active.svg';
import WalletIcon from '~/assets/icons/wallet.svg';
import WalletActiveIcon from '~/assets/icons/wallet-active.svg';
import ProfileIcon from '~/assets/icons/profile.svg';
import ProfileActiveIcon from '~/assets/icons/profile-active.svg';
import { StatusBar } from 'expo-status-bar';
import { ThemeToggle } from '~/components/theme-toggle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_USER, NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/use-color-scheme';

export default function TabLayout() {
	const { isDarkColorScheme } = useColorScheme();
	const router = useRouter();

	React.useEffect(() => {
		const checkAuth = async () => {
			const authUser = await AsyncStorage.getItem(AUTH_USER);
			if (!authUser) {
				router.replace('/login');
			}
		};
		checkAuth();
	}, []);

	return (
		<>
			<StatusBar
				style={isDarkColorScheme ? 'light' : 'dark'}
				// backgroundColor={
				// 	isDarkColorScheme
				// 		? NAV_THEME.dark.background
				// 		: NAV_THEME.light.background
				// }
			/>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: '#2F50C1',
					tabBarInactiveTintColor: '#A7A3B3',
					headerShown: false,
				}}
			>
				<Tabs.Screen
					name='shipments'
					options={{
						title: 'Shipments',
						tabBarIcon: ({ focused }) =>
							focused ? <ShipmentsActiveIcon /> : <ShipmentsIcon />,
					}}
				/>
				<Tabs.Screen
					name='scan'
					options={{
						title: 'Scan',
						tabBarIcon: ({ focused }) =>
							focused ? <ScanActiveIcon /> : <ScanIcon />,
					}}
				/>
				<Tabs.Screen
					name='wallet'
					options={{
						title: 'Wallet',
						tabBarIcon: ({ focused }) =>
							focused ? <WalletActiveIcon /> : <WalletIcon />,
					}}
				/>
				<Tabs.Screen
					name='profile'
					options={{
						title: 'Profile',
						tabBarIcon: ({ focused }) =>
							focused ? <ProfileActiveIcon /> : <ProfileIcon />,
						headerShown: true,
						// headerRight: () => <ThemeToggle />,
					}}
				/>
			</Tabs>
		</>
	);
}
