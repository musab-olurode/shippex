import { ShipmentListRequest } from '~/lib/api/types';
import axiosInstance from '..';

export const getShipmentStatusList = async () => {
	const payload = {
		doctype: 'AWB Status',
		fields: ['*'],
	};
	const { data } = await axiosInstance.post('/frappe.client.get_list', payload);
	return data;
};

export const getShipmentList = async ({ queryKey }: { queryKey: string[] }) => {
	let payload: ShipmentListRequest = {
		doctype: 'AWB',
		fields: ['*'],
		filters: {},
	};
	queryKey.forEach((key) => {
		if (key.includes('filter-')) {
			const status = key.replace('filter-', '');
			const { filters } = payload;
			if (filters.status && Array.isArray(filters.status[1])) {
				filters.status[1].push(status);
			} else {
				payload.filters = {
					...payload.filters,
					status: ['in', [status]],
				};
			}
		} else if (key.includes('search-')) {
			const search = key.replace('search-', '');
			payload.filters = {
				...payload.filters,
				name: ['like', `%${search}%`],
			};
		}
	});
	const { data } = await axiosInstance.post('/frappe.client.get_list', payload);
	return data;
};
