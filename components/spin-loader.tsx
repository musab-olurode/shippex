import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
	Easing,
} from 'react-native-reanimated';
import LoadingPrimary from '~/assets/icons/loading-primary.svg';
import LoadingSecondary from '~/assets/icons/loading-secondary.svg';

type SpinLoaderProps = {
	variant?: 'primary' | 'secondary';
};

const SpinLoader = ({ variant = 'primary' }: SpinLoaderProps) => {
	const rotation = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${rotation.value}deg` }],
		};
	});

	useEffect(() => {
		rotation.value = withRepeat(
			withTiming(360, {
				duration: 2000,
				easing: Easing.linear,
			}),
			-1,
			false
		);
	}, []);

	return (
		<View>
			<Animated.View style={animatedStyle}>
				{variant === 'primary' ? <LoadingPrimary /> : <LoadingSecondary />}
			</Animated.View>
		</View>
	);
};

export default SpinLoader;
