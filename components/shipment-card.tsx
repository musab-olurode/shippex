import * as AccordionPrimitive from '@rn-primitives/accordion';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';
import Animated, {
	Extrapolation,
	FadeIn,
	FadeOutUp,
	LinearTransition,
	interpolate,
	interpolateColor,
	useAnimatedStyle,
	useDerivedValue,
	withTiming,
} from 'react-native-reanimated';
import { cn } from '~/lib/utils';
import { Text } from '~/components/ui/text';
import ExpandIcon from '~/assets/icons/expand.svg';
import { Checkbox } from '~/components/ui/checkbox';
import BoxIcon from '~/assets/icons/box.svg';
import ArrowRightIcon from '~/assets/icons/arrow-right.svg';
import { Button } from '~/components/ui/button';
import PhoneIcon from '~/assets/icons/phone.svg';
import WhatsAppIcon from '~/assets/icons/whatsapp.svg';
import Tag from '~/components/tag';
import { CheckedShipment, Shipment } from '~/lib/api/types';
import * as Linking from 'expo-linking';
import { toast } from 'sonner-native';

const Trigger = Platform.OS === 'web' ? View : Pressable;

const AccordionItem = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, value, ...props }, ref) => {
	return (
		<Animated.View
			className={'overflow-hidden'}
			layout={LinearTransition.duration(200)}
		>
			<AccordionPrimitive.Item
				ref={ref}
				className={cn(className)}
				value={value}
				{...props}
			/>
		</Animated.View>
	);
});
AccordionItem.displayName = AccordionPrimitive.Item.displayName;

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof Pressable>,
	React.ComponentPropsWithoutRef<typeof Pressable>
>(({ className, children, ...props }, ref) => {
	const { isExpanded } = AccordionPrimitive.useItemContext();

	const progress = useDerivedValue(() =>
		isExpanded
			? withTiming(1, { duration: 250 })
			: withTiming(0, { duration: 200 })
	);
	const triggerStyle = useAnimatedStyle(() => ({
		opacity: interpolate(progress.value, [0, 1], [1, 0.8], Extrapolation.CLAMP),
		backgroundColor: interpolateColor(
			progress.value,
			[0, 1],
			['#fff', '#6E91EC']
		),
		borderColor: interpolateColor(
			progress.value,
			[0, 1],
			['transparent', 'rgba(69, 97, 219, 0.25)']
		),
	}));

	return (
		<AccordionPrimitive.Header className='flex'>
			<AccordionPrimitive.Trigger ref={ref} {...props} asChild>
				<Trigger
					className={cn(
						className,
						'web:transition-all group web:focus-visible:outline-none web:focus-visible:ring-1 web:focus-visible:ring-muted-foreground rounded-full'
					)}
				>
					<Animated.View
						style={[
							triggerStyle,
							{
								padding: 4,
								borderRadius: 99,
								borderWidth: 4,
							},
						]}
					>
						<ExpandIcon
							width={18}
							height={18}
							color={isExpanded ? '#fff' : '#4561DB'}
						/>
					</Animated.View>
				</Trigger>
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	);
});
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
	const { isExpanded } = AccordionPrimitive.useItemContext();
	return (
		<AccordionPrimitive.Content
			className={cn(
				'overflow-hidden web:transition-all',
				isExpanded ? 'web:animate-accordion-down' : 'web:animate-accordion-up'
			)}
			ref={ref}
			{...props}
		>
			<InnerContent className={cn(className)}>{children}</InnerContent>
		</AccordionPrimitive.Content>
	);
});

function InnerContent({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	if (Platform.OS === 'web') {
		return <View className={cn('pb-[0.625rem]', className)}>{children}</View>;
	}
	return (
		<Animated.View
			entering={FadeIn}
			exiting={FadeOutUp.duration(250)}
			className={cn('pb-[0.625rem]', className)}
		>
			{children}
		</Animated.View>
	);
}

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

type ShipmentHeaderProps = {
	shipment: Shipment;
	checked: boolean;
	setChecked: (checked: boolean) => void;
	status?: {
		[key: string]: { color: string; status: string };
	};
};

const ShipmentCardHeader = ({
	checked,
	setChecked,
	shipment,
	status,
}: ShipmentHeaderProps) => {
	const { isExpanded } = AccordionPrimitive.useItemContext();

	return (
		<View
			className='flex flex-row justify-between items-center gap-[0.875rem] px-3 pb-[0.625rem]'
			style={{
				borderBottomColor: '#fff',
				borderBottomWidth: isExpanded ? 2 : 0,
				borderStyle: 'dashed',
			}}
		>
			<Checkbox checked={checked} onCheckedChange={setChecked} />
			<BoxIcon />
			<View className='grow'>
				<View className='flex flex-row items-end'>
					<View className='flex flex-col grow pr-[0.875rem]'>
						<Text className='font-normal text-[#3F395C] text-[0.8125rem] leading-[1.1375rem]'>
							AWB
						</Text>
						<Text className='font-semibold text-lg leading-[1.575rem]'>
							{shipment.name}
						</Text>
					</View>
					<Tag status={shipment.status} statusDetails={status} />
				</View>
				<View className='flex flex-row items-center gap-2'>
					<Text className='font-normal text-[#757281] text-[0.8125rem] leading-[1.1375rem] capitalize'>
						{shipment.origin_city}
					</Text>
					<ArrowRightIcon width={14} height={14} />
					<Text className='font-normal text-[#757281] text-[0.8125rem] leading-[1.1375rem] capitalize'>
						{shipment.destination_city}
					</Text>
				</View>
			</View>
			<AccordionTrigger />
		</View>
	);
};

export type ShipmentCardProps = {
	onCheck: (checked: boolean) => void;
	shipment: CheckedShipment;
	status?: {
		[key: string]: { color: string; status: string };
	};
};

const ShipmentCard = ({ shipment, onCheck, status }: ShipmentCardProps) => {
	return (
		<AccordionItem
			value={shipment.name}
			className={cn(
				'bg-[#F4F2F8] pt-3 rounded-lg border-2 border-transparent',
				shipment.checked && 'border-2 border-[#6E91EC]'
			)}
		>
			<ShipmentCardHeader
				checked={shipment.checked || false}
				setChecked={onCheck}
				shipment={shipment}
				status={status}
			/>
			<AccordionContent className='pt-[0.625rem] bg-[#F4F2F880]/80 px-3 pb-[0.625rem]'>
				<View className='flex flex-row'>
					<View className='w-[6.5rem]'>
						<Text className='text-primary font-normal text-[0.6875rem] leading-[0.9625rem]'>
							Origin
						</Text>
						<Text className='font-normal text-base leading-[1.4rem] capitalize'>
							{shipment.origin_city}
						</Text>
						<Text className='text-[#58536E] font-light text-[0.8125rem] leading-[1.1375rem]'>
							{shipment.origin_address_line_1 || '-'}
						</Text>
					</View>
					<View className='grow flex flex-row justify-center items-center'>
						<ArrowRightIcon width={24} height={24} />
					</View>
					<View className='w-[7.125rem]'>
						<Text className='text-primary font-normal text-[0.6875rem] leading-[0.9625rem]'>
							Destination
						</Text>
						<Text className='font-normal text-base leading-[1.4rem] capitalize'>
							{shipment.destination_city}
						</Text>
						<Text className='text-[#58536E] font-light text-[0.8125rem] leading-[1.1375rem]'>
							{shipment.destination_address_line_1 || '-'}
						</Text>
					</View>
				</View>
				<View className='flex flex-row justify-end gap-[0.875rem] pt-6'>
					<Button
						className='bg-[#6E91EC] active:bg-[#6E91EC]/60 flex flex-row gap-2 rounded-lg'
						disabled={!shipment.consignee_phone}
						onPress={() => {
							if (!shipment.consignee_phone) {
								return;
							}
							Linking.openURL(`tel:${shipment.consignee_phone}`);
						}}
					>
						<PhoneIcon />
						<Text className='text-white'>Call</Text>
					</Button>
					<Button
						className='bg-[#25D366] active:bg-[#25D366]/60 flex flex-row gap-2 rounded-lg'
						disabled={!shipment.consignee_phone}
						onPress={() => {
							if (!shipment.consignee_phone) {
								return;
							}
							Linking.openURL(
								`whatsapp://send?phone=${shipment.consignee_phone}`
							).catch((error) => {
								toast.info('Ensure that WhatsApp is installed on your device');
							});
						}}
					>
						<WhatsAppIcon />
						<Text className='text-white'>WhatsApp</Text>
					</Button>
				</View>
			</AccordionContent>
		</AccordionItem>
	);
};

export default ShipmentCard;
