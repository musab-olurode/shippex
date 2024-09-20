import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { shipmentKeys } from '~/lib/api/queryKeys';
import {
	getShipmentList,
	getShipmentStatusList,
} from '~/lib/api/requests/shipment';
import {
	useGetAppliedStatusState,
	useGetSearchQueryState,
} from '~/lib/api/state/shipment';
import { Shipment, ShipmentStatus } from '~/lib/api/types';

export const useGetShipmentStatusList = (
	options?: Partial<
		UseQueryOptions<
			unknown,
			AxiosError,
			{ message: ShipmentStatus[] },
			string[]
		>
	>
) => {
	return useQuery({
		queryKey: [shipmentKeys.readStatusList],
		queryFn: getShipmentStatusList,
		...options,
	});
};

export const useGetShipmentList = (
	options?: Partial<
		UseQueryOptions<unknown, AxiosError, { message: Shipment[] }, string[]>
	>
) => {
	const { data: appliedStatuses } = useGetAppliedStatusState();
	const { data: searchQuery } = useGetSearchQueryState();

	let queryKeys = [shipmentKeys.read];

	if (appliedStatuses && appliedStatuses.length > 0) {
		queryKeys = [
			...queryKeys,
			...appliedStatuses.map((status) => `filter-${status}`),
		];
	}
	if (searchQuery) {
		queryKeys = [...queryKeys, `search-${searchQuery}`];
	}

	return useQuery({
		queryKey: queryKeys,
		queryFn: getShipmentList,
		...options,
	});
};
