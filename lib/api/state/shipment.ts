import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { shipmentKeys } from '../queryKeys';
import { STATE_QUERY_OPTIONS } from '~/lib/constants';

export const useGetAppliedStatusState = (
	options?: Partial<UseQueryOptions<unknown, unknown, string[], string[]>>
) => {
	return useQuery({
		queryKey: [shipmentKeys.appliedStatusState],
		queryFn: () => [],
		...options,
		...STATE_QUERY_OPTIONS,
	});
};

export const useGetSearchQueryState = (
	options?: Partial<UseQueryOptions<unknown, unknown, string, string[]>>
) => {
	return useQuery({
		queryKey: [shipmentKeys.searchQueryState],
		queryFn: () => '',
		...options,
		...STATE_QUERY_OPTIONS,
	});
};
