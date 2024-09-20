import React, { useMemo } from 'react';
import { FlatList, Image, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Text } from '~/components/ui/text';
import AvatarImg from '~/assets/images/avatar.png';
import LogoWithText from '~/assets/images/logo-with-text-primary.png';
import { Button } from '~/components/ui/button';
import BellIcon from '~/assets/icons/bell.svg';
import { SearchInput } from '~/components/ui/search-input';
import FilterIcon from '~/assets/icons/filter.svg';
import ScanIcon from '~/assets/icons/scan.svg';
import { IconButton } from '~/components/ui/icon-button';
import { Checkbox } from '~/components/ui/checkbox';
import ShipmentCard from '~/components/shipment-card';
import { Accordion } from '~/components/ui/accordion';
import { useShipmentFilterBottomSheet } from '~/context/shipment-filter-context';
import useUser from '~/hooks/use-user';
import {
	useGetShipmentList,
	useGetShipmentStatusList,
} from '~/lib/api/queries/shipment';
import { Skeleton } from '~/components/ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';
import { shipmentKeys } from '~/lib/api/queryKeys';
import { CheckedShipment, Shipment } from '~/lib/api/types';

const ListLoadingComponent = () => (
	<View className='flex flex-col gap-2 px-4'>
		{new Array(5).fill(null).map((_, index) => (
			<Skeleton
				key={`shipment-skeleton-${index}`}
				className='h-[4.7875rem] w-full rounded-lg'
			/>
		))}
	</View>
);

const ListEmptyComponent = () => (
	<View className='flex flex-col justify-center items-center gap-2 px-4 h-[4.7875rem] bg-[#F4F2F880]/80 mx-4 rounded-lg'>
		<Text className='text-primary'>No Shipments Available</Text>
	</View>
);

export default function Screen() {
	const [searchQuery, setSearchQuery] = React.useState('');
	const [shipmentListWithChecked, setShipmentListWithChecked] = React.useState<
		CheckedShipment[]
	>([]);
	const [isAllChecked, setIsAllChecked] = React.useState(false);
	const { openBottomSheet } = useShipmentFilterBottomSheet();
	const { user } = useUser();
	const { data: shipmentStatusList } = useGetShipmentStatusList();
	const {
		data: shipmentList,
		isPending: isPendingShipmentList,
		refetch: refetchShipmentList,
	} = useGetShipmentList();
	const queryClient = useQueryClient();

	const shipmentStatus = useMemo(() => {
		let parsedStatus:
			| { [key: string]: { color: string; status: string } }
			| undefined;
		if (shipmentStatusList && shipmentStatusList.message.length > 0) {
			parsedStatus = {} satisfies {
				[key: string]: { color: string; status: string };
			};
			shipmentStatusList.message.forEach((status) => {
				if (parsedStatus && !Object.hasOwn(parsedStatus, status.status)) {
					parsedStatus[status.status] = {
						color: status.color,
						status: status.status,
					};
				}
			});
		}
		return parsedStatus;
	}, [shipmentStatusList]);

	React.useEffect(() => {
		if (shipmentList && shipmentList.message.length > 0) {
			const checkedList = shipmentList.message.map((shipment) => ({
				...shipment,
				checked: false,
			}));
			setShipmentListWithChecked(checkedList);
		}
	}, [shipmentList]);

	const handleOnShowFilters = () => {
		openBottomSheet();
	};

	const handleOnSearch = () => {
		queryClient.setQueriesData(
			{ queryKey: [shipmentKeys.searchQueryState] },
			searchQuery
		);
	};

	const handleOnClearSearch = () => {
		setSearchQuery('');
		queryClient.setQueriesData(
			{ queryKey: [shipmentKeys.searchQueryState] },
			''
		);
	};

	const handleOnCheckShipment = (index: number) => {
		const updatedList = [...shipmentListWithChecked];
		updatedList[index].checked = !updatedList[index].checked;
		setShipmentListWithChecked(updatedList);
		if (updatedList.every((shipment) => shipment.checked)) {
			setIsAllChecked(true);
		} else {
			setIsAllChecked(false);
		}
	};

	const handleOnCheckAll = () => {
		const updatedList = [...shipmentListWithChecked];
		const isAllChecked = updatedList.every((shipment) => shipment.checked);
		updatedList.forEach((shipment) => {
			shipment.checked = !isAllChecked;
		});
		setShipmentListWithChecked(updatedList);
		setIsAllChecked(!isAllChecked);
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View className='px-4 pb-4'>
				<View className='flex flex-row justify-between items-center py-3'>
					<Avatar alt={user?.full_name || ''} className='size-10'>
						<AvatarImage source={AvatarImg} />
						<AvatarFallback>
							<Text>{user?.full_name.slice(0, 2)}</Text>
						</AvatarFallback>
					</Avatar>
					<Image
						source={LogoWithText}
						className='w-[5.7675rem]'
						resizeMode='contain'
					/>
					<Button size='icon' variant='ghost' className='rounded-full'>
						<BellIcon width={20} height={20} />
					</Button>
				</View>
				<View className='flex flex-col gap-y-1'>
					<Text className='font-normal text-sm leading-[1.05875rem] text-black/60 dark:text-muted-foreground'>
						Hello,
					</Text>
					{user ? (
						<Text className='font-[590] text-[1.75rem] leading-[2.08875rem]'>
							{user.full_name}
						</Text>
					) : (
						<Skeleton className='h-[2.08875rem] w-[7.5rem] rounded-lg' />
					)}
				</View>
				<View className='py-3'>
					<SearchInput
						placeholder='Search'
						value={searchQuery}
						onChangeText={setSearchQuery}
						onSubmitEditing={() => handleOnSearch()}
						onPressClear={handleOnClearSearch}
					/>
				</View>
				<View className='flex flex-row gap-[0.875rem] pt-3 pb-6'>
					<IconButton
						variant='gray'
						icon={FilterIcon}
						title='Filters'
						className='grow'
						onPress={handleOnShowFilters}
					/>
					<IconButton icon={ScanIcon} title='Add Scan' className='grow' />
				</View>
				<View className='flex flex-row justify-between items-center pt-3'>
					<Text className='font-[590] text-[1.375rem] leading-[1.6575rem]'>
						Shipments
					</Text>
					<Button
						variant='link'
						className='flex flex-row gap-2 native:px-0 py-0 h-fit'
						onPress={handleOnCheckAll}
					>
						<Checkbox
							checked={isAllChecked}
							onCheckedChange={handleOnCheckAll}
						/>
						<Text className='text-lg font-normal'>Mark All</Text>
					</Button>
				</View>
			</View>
			<FlatList
				refreshControl={
					<RefreshControl
						progressViewOffset={-300}
						progressBackgroundColor='#F4F2F8'
						colors={['#2F50C1']}
						refreshing={isPendingShipmentList}
						onRefresh={refetchShipmentList}
					/>
				}
				style={{ flex: 1 }}
				data={shipmentListWithChecked}
				keyExtractor={(_, index) => `item-${index}`}
				contentContainerClassName='pb-5'
				renderItem={({ item, index }) => (
					<ShipmentCard
						shipment={item}
						onCheck={() => handleOnCheckShipment(index)}
						status={shipmentStatus}
					/>
				)}
				ItemSeparatorComponent={() => <View className='h-2' />}
				CellRendererComponent={({ children }) => (
					<Accordion type='multiple' collapsible className='w-full px-4'>
						{children}
					</Accordion>
				)}
				ListEmptyComponent={
					isPendingShipmentList ? ListLoadingComponent : ListEmptyComponent
				}
			/>
		</SafeAreaView>
	);
}
