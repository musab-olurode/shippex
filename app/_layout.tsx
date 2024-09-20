import '~/global.css';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/use-color-scheme';
import { PortalHost } from '@rn-primitives/portal';
import { ThemeToggle } from '~/components/theme-toggle';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ShipmentFilterBottomSheetProvider } from '~/context/shipment-filter-context';
import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast, Toaster } from 'sonner-native';

const LIGHT_THEME: Theme = {
	dark: false,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	dark: true,
	colors: NAV_THEME.dark,
};

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

	const queryClient = new QueryClient({
		defaultOptions: {
			mutations: {
				onError: handleOnRequestError,
				onSuccess: handleOnRequestSuccess,
			},
		},
		queryCache: new QueryCache({
			onError: (error) => handleOnRequestError(error),
		}),
	});

	function handleOnRequestError(error: AxiosError<any, any> | Error) {
		let errorMessage =
			(error as AxiosError<any>).response?.data.message ||
			error.message ||
			'Uh oh! Something went wrong.';
		toast.error(errorMessage, { richColors: true });
	}

	function handleOnRequestSuccess(data: unknown) {
		toast((data as any).message || 'Success');
	}

	React.useEffect(() => {
		(async () => {
			const theme = await AsyncStorage.getItem('theme');
			if (Platform.OS === 'web') {
				// Adds the background color to the html element to prevent white background on overscroll.
				document.documentElement.classList.add('bg-background');
			}
			if (!theme) {
				AsyncStorage.setItem('theme', colorScheme);
				setIsColorSchemeLoaded(true);
				return;
			}
			const colorTheme = theme === 'dark' ? 'dark' : 'light';
			if (colorTheme !== colorScheme) {
				setColorScheme(colorTheme);
				setAndroidNavigationBar(colorTheme);
				setIsColorSchemeLoaded(true);
				return;
			}
			setAndroidNavigationBar(colorTheme);
			setIsColorSchemeLoaded(true);
		})().finally(() => {
			SplashScreen.hideAsync();
		});
	}, []);

	if (!isColorSchemeLoaded) {
		return null;
	}

	const Routes = () => (
		<Stack initialRouteName='index'>
			<Stack.Screen
				name='index'
				options={{
					headerShown: false,
					navigationBarColor: '#2F50C1',
					navigationBarHidden: true,
				}}
			/>
			<Stack.Screen
				name='login'
				options={{
					headerShown: false,
					navigationBarColor: '#2F50C1',
				}}
			/>
			<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
		</Stack>
	);

	return (
		<QueryClientProvider client={queryClient}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<ShipmentFilterBottomSheetProvider>
					<ThemeProvider value={isDarkColorScheme ? LIGHT_THEME : DARK_THEME}>
						<StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
						<Routes />
						<Toaster />
						<PortalHost />
					</ThemeProvider>
				</ShipmentFilterBottomSheetProvider>
			</GestureHandlerRootView>
		</QueryClientProvider>
	);
}
