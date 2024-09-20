import * as React from 'react';
import { LayoutChangeEvent, Text, TextInput, View } from 'react-native';
import Animated, {
	Easing,
	interpolateColor,
	useAnimatedStyle,
	useDerivedValue,
	withTiming,
} from 'react-native-reanimated';
import { cn } from '~/lib/utils';

const ANIMATION_DURATION = 150;

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedView = Animated.createAnimatedComponent(View);

type AdditionalInputProps = {
	prefix?: JSX.Element;
	errorMessage?: string;
};

const Input = React.forwardRef<
	React.ElementRef<typeof TextInput>,
	React.ComponentPropsWithoutRef<typeof TextInput> & AdditionalInputProps
>(
	(
		{
			className,
			placeholderClassName,
			placeholder,
			prefix,
			value: propValue,
			errorMessage,
			...props
		},
		ref
	) => {
		const [value, setValue] = React.useState(propValue || '');
		const [isFocused, setIsFocused] = React.useState(false);
		const [shouldFloatLabel, setShouldFloatLabel] = React.useState(false);
		const [prefixWidth, setPrefixWidth] = React.useState(0);
		const inputRef = React.useRef<TextInput>(null);

		const setFocus = () => {
			inputRef.current?.focus();
			handleOnFocus();
		};

		const handleOnFocus = () => {
			setIsFocused(true);
			setShouldFloatLabel(true);
		};

		const handleOnBlur = () => {
			setIsFocused(false);
			if (!value) {
				setShouldFloatLabel(false);
			}
		};

		const onPrefixViewLayout = (event: LayoutChangeEvent) => {
			const { width } = event.nativeEvent.layout;
			setPrefixWidth(width);
		};

		const handleOnChangeText = (text: string) => {
			setValue(text);
			props.onChangeText?.(text);
		};

		const progress = useDerivedValue(() => {
			return withTiming(1, {
				duration: ANIMATION_DURATION,
				easing: Easing.in(Easing.ease),
			});
		});

		const colorAnimation = useAnimatedStyle(() => {
			const color = interpolateColor(
				progress.value,
				[0, 1],
				['#A7A3B3', '#58536E']
			);

			return {
				color,
			};
		});

		const hasPrefix = !!prefix;
		const opacityAnimation = useAnimatedStyle(() => {
			return {
				opacity: withTiming(shouldFloatLabel && hasPrefix ? 1 : 0, {
					duration: ANIMATION_DURATION,
					easing: Easing.in(Easing.ease),
				}),
			};
		});

		const positionAnimations = useAnimatedStyle(() => {
			return {
				transform: [
					{
						translateY: withTiming(shouldFloatLabel ? 8.5 : 16, {
							duration: ANIMATION_DURATION,
							easing: Easing.in(Easing.ease),
						}),
					},
				],
				fontSize: withTiming(shouldFloatLabel ? 11 : 16, {
					duration: ANIMATION_DURATION,
					easing: Easing.in(Easing.ease),
				}),
			};
		});

		return (
			<View className='relative'>
				<AnimatedView
					onLayout={onPrefixViewLayout}
					style={[
						opacityAnimation,
						{
							bottom: 8.5,
							left: 12,
							alignSelf: 'center',
							position: 'absolute',
							flex: 1,
							flexDirection: 'row',
							alignItems: 'center',
							zIndex: 999,
						},
					]}
				>
					{prefix}
					<AnimatedText className='text-primary/20'>{' | '}</AnimatedText>
				</AnimatedView>
				<AnimatedText
					onPress={setFocus}
					style={[
						colorAnimation,
						positionAnimations,
						{
							left: 12,
							alignSelf: 'center',
							position: 'absolute',
							flex: 1,
							zIndex: 999,
						},
					]}
				>
					{placeholder}
				</AnimatedText>
				<TextInput
					ref={ref}
					className={cn(
						'web:flex h-14 web:w-full rounded-lg bg-[rgba(244,242,248,0.5)] px-[0.875rem] pt-[1.40625rem] pb-[0.53125rem] font-normal text-base leading-[1.4rem] text-primary',
						'placeholder:text-muted-text web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none',
						'web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 caret-[#0F172A]',
						isFocused && 'border border-primary',
						props.editable === false && 'opacity-50 web:cursor-not-allowed',
						className
					)}
					style={{
						paddingLeft: prefix ? prefixWidth + 12 : 14,
					}}
					placeholderClassName={cn(
						'font-normal text-base leading-[1.4rem] text-muted-text',
						placeholderClassName
					)}
					{...props}
					value={propValue}
					onFocus={(e) => {
						handleOnFocus();
						props.onFocus?.(e);
					}}
					onBlur={(e) => {
						handleOnBlur();
						props.onBlur?.(e);
					}}
					onChangeText={handleOnChangeText}
				/>
				{errorMessage && (
					<Text className='text-red-500 text-sm absolute -bottom-5 left-1'>
						{errorMessage}
					</Text>
				)}
			</View>
		);
	}
);

Input.displayName = 'Input';

export { Input };
