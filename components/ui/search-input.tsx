import * as React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { cn } from '~/lib/utils';
import SearchIcon from '~/assets/icons/search.svg';
import XIcon from '~/assets/icons/x.svg';

type AdditionalSearchInputProps = {
	onPressClear?: () => void;
};

const SearchInput = React.forwardRef<
	React.ElementRef<typeof TextInput>,
	React.ComponentPropsWithoutRef<typeof TextInput> & AdditionalSearchInputProps
>(({ className, placeholderClassName, onPressClear, ...props }, ref) => {
	const [isFocused, setIsFocused] = React.useState(false);
	const inputRef = React.useRef<TextInput>(null);

	React.useImperativeHandle(
		ref,
		() =>
			({
				...inputRef.current,
				focus: () => {
					inputRef.current?.focus();
				},
				blur: () => {
					inputRef.current?.blur();
				},
				clear: () => {
					inputRef.current?.clear();
				},
			} as TextInput)
	);

	const handleOnFocus = () => {
		setIsFocused(true);
	};

	const handleOnBlur = () => {
		setIsFocused(false);
	};

	return (
		<View className='relative'>
			<SearchIcon
				style={{
					position: 'absolute',
					left: 14,
					top: '50%',
					transform: [{ translateY: -12 }],
					zIndex: 0,
				}}
				color={isFocused ? '#6E91EC' : '#A7A3B3'}
			/>
			<TextInput
				ref={inputRef}
				className={cn(
					'web:flex h-14 web:w-full rounded-lg bg-[rgba(244,242,248,0.5)] pl-12 pr-[0.875rem] py-[0.6875rem] font-normal text-base leading-[1.4rem] text-[#A7A3B3]',
					'placeholder:text-muted-text web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none',
					'web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 caret-[#0F172A]',
					isFocused && 'text-primary border border-primary pr-12',
					props.editable === false && 'opacity-50 web:cursor-not-allowed',
					className
				)}
				placeholderClassName={cn(
					'font-normal text-base leading-[1.4rem] text-[#A7A3B3]',
					placeholderClassName
				)}
				{...props}
				onFocus={(e) => {
					handleOnFocus();
					props.onFocus?.(e);
				}}
				onBlur={(e) => {
					handleOnBlur();
					props.onBlur?.(e);
				}}
				returnKeyType='search'
				accessibilityRole='search'
			/>
			{isFocused && (
				<Pressable
					onPress={() => {
						onPressClear?.();
						inputRef.current?.clear();
						inputRef.current?.blur();
					}}
					style={{
						position: 'absolute',
						right: 0,
						top: '50%',
						transform: [{ translateY: -24 }],
						zIndex: 10,
						padding: 12,
					}}
				>
					<XIcon />
				</Pressable>
			)}
		</View>
	);
});

SearchInput.displayName = 'SearchInput';

export { SearchInput };
