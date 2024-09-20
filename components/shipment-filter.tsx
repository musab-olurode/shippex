import React from 'react';
import { View } from 'react-native';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Text } from '~/components/ui/text';
import FilterTag from '~/components/filter-tag';
import { Skeleton } from '~/components/ui/skeleton';
import { useGetShipmentStatusList } from '~/lib/api/queries/shipment';
import { useGetAppliedStatusState } from '~/lib/api/state/shipment';
import { useQueryClient } from '@tanstack/react-query';
import { shipmentKeys } from '~/lib/api/queryKeys';

type ShipmentFilterProps = {
	closeBottomSheet: () => void;
};

const ShipmentFilter = React.forwardRef<
	BottomSheetMethods,
	ShipmentFilterProps
>(({ closeBottomSheet }, bottomSheetRef) => {
	const { data, isPending } = useGetShipmentStatusList();
	const { data: appliedStatuses } = useGetAppliedStatusState();
	const [selectedStatuses, setSelectedStatus] = React.useState<string[]>(
		appliedStatuses || []
	);
	const queryClient = useQueryClient();

	const handleOnSelectStatus = (status: string) => {
		let newStatuses = [...selectedStatuses];
		if (selectedStatuses.includes(status)) {
			newStatuses = selectedStatuses.filter(
				(selectedStatus) => selectedStatus !== status
			);
		} else {
			newStatuses = [...selectedStatuses, status];
		}
		setSelectedStatus(newStatuses);
	};

	const handleOnPressDone = () => {
		let newStatuses = [...selectedStatuses];
		queryClient.setQueryData([shipmentKeys.appliedStatusState], newStatuses);
		closeBottomSheet();
	};

	return (
		<>
			<View
				className='flex flex-row justify-between items-center border-b border-[#EAE7F2]'
				style={{ paddingHorizontal: 24, paddingBottom: 12 }}
			>
				<Text
					className='text-primary font-medium text-base leading-[1.625rem]'
					onPress={closeBottomSheet}
				>
					Cancel
				</Text>
				<Text className='font-[590] text-lg leading-[1.625rem]'>Filters</Text>
				<Text
					className='text-primary font-medium text-base leading-[1.625rem]'
					onPress={handleOnPressDone}
				>
					Done
				</Text>
			</View>
			<View
				style={{ paddingHorizontal: 24, paddingBottom: 29, paddingTop: 12 }}
			>
				<Text
					className='text-[#58536E] font-medium text-[0.8125rem] leading-[1.625rem]'
					style={{ paddingBottom: 12 }}
				>
					SHIPMENT STATUS
				</Text>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						flexWrap: 'wrap',
						gap: 10,
					}}
				>
					{isPending &&
						new Array(7)
							.fill(null)
							.map((_, index) => (
								<Skeleton
									key={`shipment-skeleton-${index}`}
									className='h-[2.4875rem] w-28 rounded-lg'
								/>
							))}
					{data?.message && data?.message.length > 0 ? (
						data.message.map((status) => (
							<FilterTag
								key={status.status}
								filter={status.status}
								active={selectedStatuses.includes(status.status)}
								onPress={() => handleOnSelectStatus(status.status)}
							/>
						))
					) : (
						<Text className='text-red-500 w-full text-center'>
							No Filters available
						</Text>
					)}
				</View>
			</View>
		</>
	);
});

export default ShipmentFilter;
