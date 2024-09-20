import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { BackHandler, Image, Keyboard, Pressable, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import LogoWithText from '~/assets/images/logo-with-text.png';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import ChevronIcon from '~/assets/icons/chevron.svg';
import Animated, {
	Easing,
	useAnimatedStyle,
	withTiming,
} from 'react-native-reanimated';
import { useNavigation } from 'expo-router';
import LoginForm from '~/components/login-form';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function Screen() {
	const [bottomSheetOpen, setBottomSheetOpen] = React.useState(false);
	const bottomSheetRef = React.useRef<BottomSheetMethods>(null);
	const navigation = useNavigation();

	const handleOnCloseBottomSheet = () => {
		bottomSheetRef.current?.close();
	};

	const handleOnBottomSheetChange = (index: number) => {
		if (index === -1) {
			setBottomSheetOpen(false);
			Keyboard.dismiss();
			navigation.setOptions({
				navigationBarColor: '#2F50C1',
			});
		}
	};

	const handleOnPressLogin = () => {
		setBottomSheetOpen(true);
		bottomSheetRef.current?.expand();
		navigation.setOptions({
			navigationBarColor: '#fff',
		});
	};

	const viewAnimation = useAnimatedStyle(() => {
		return {
			paddingHorizontal: withTiming(bottomSheetOpen ? 10 : 0, {
				duration: 150,
				easing: Easing.in(Easing.ease),
			}),
			paddingTop: withTiming(bottomSheetOpen ? 50 : 0, {
				duration: 150,
				easing: Easing.in(Easing.ease),
			}),
		};
	});

	const backgroundViewAnimation = useAnimatedStyle(() => {
		return {
			borderRadius: withTiming(bottomSheetOpen ? 10 : 0, {
				duration: 150,
				easing: Easing.in(Easing.ease),
			}),
		};
	});

	React.useEffect(() => {
		const backAction = () => {
			if (bottomSheetOpen) {
				handleOnCloseBottomSheet();
				return true;
			}
			return false;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction
		);

		return () => backHandler.remove();
	}, [bottomSheetOpen]);

	return (
		<AnimatedView className='flex-1 bg-black' style={viewAnimation}>
			<StatusBar
				style='light'
				animated
				backgroundColor={bottomSheetOpen ? '#000' : '#2F50C1'}
			/>
			<AnimatedView
				className='flex-1 justify-center items-center gap-5 p-6 relative bg-primary'
				style={backgroundViewAnimation}
			>
				<Image
					source={LogoWithText}
					className='w-[12.976875rem]'
					resizeMode='contain'
				/>
				<Button
					variant='secondary'
					className='w-full absolute bottom-[4.125rem] left-6'
					onPress={handleOnPressLogin}
				>
					<Text>Login</Text>
				</Button>
			</AnimatedView>
			<BottomSheet
				ref={bottomSheetRef}
				index={-1}
				snapPoints={['93%']}
				enablePanDownToClose
				onChange={handleOnBottomSheetChange}
				backgroundStyle={{
					backgroundColor: '#fff',
					borderTopRightRadius: 10,
					borderTopLeftRadius: 10,
				}}
				handleIndicatorStyle={{
					backgroundColor: '#A7A3B3',
				}}
			>
				<BottomSheetView
					style={{ flex: 1, backgroundColor: '#fff', minHeight: 40 }}
				>
					<View className='pl-4'>
						<Pressable
							className='flex flex-row items-center gap-2'
							onPress={handleOnCloseBottomSheet}
						>
							<ChevronIcon />
							<Text className='text-primary font-normal text-[1.0625rem] leading-[1.375rem]'>
								Cancel
							</Text>
						</Pressable>
					</View>
					<View className='pt-[0.875rem] px-4 flex flex-col grow'>
						<Text className='font-[590] text-[2.125rem] leading-[2.5625rem] pb-4'>
							Login
						</Text>
						<Text className='font-normal text-[1.0625rem] leading-[1.375rem] text-muted-text pb-[2.375rem]'>
							Please enter your First, Last name and your phone number in order
							to register
						</Text>
						<LoginForm />
					</View>
				</BottomSheetView>
			</BottomSheet>
		</AnimatedView>
	);
}
