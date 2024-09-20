import React from 'react';
import LottieView from 'lottie-react-native';
import { StatusBar } from 'expo-status-bar';
import { Href, useRouter } from 'expo-router';
import { AUTH_USER } from '~/lib/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AnimatedSplashScreen() {
	const [isAuthenticated, setIsAuthenticated] = React.useState(false);
	const animation = React.useRef<LottieView>(null);
	const router = useRouter();

	const handleOnAnimationFinish = () => {
		if (isAuthenticated) {
			router.replace('/shipments' as Href<string | object>);
		} else {
			router.replace('/login');
		}
	};

	React.useEffect(() => {
		const checkAuth = async () => {
			const authUser = await AsyncStorage.getItem(AUTH_USER);
			setIsAuthenticated(!!authUser);
		};
		animation.current?.play(0, 190);
		checkAuth();
	}, []);

	return (
		<>
			<StatusBar style='light' translucent />
			<LottieView
				ref={animation}
				loop={false}
				style={{
					width: '100%',
					height: '100%',
					backgroundColor: '#fff',
				}}
				source={require('~/assets/animations/splash.json')}
				resizeMode='cover'
				onAnimationFinish={handleOnAnimationFinish}
			/>
		</>
	);
}
