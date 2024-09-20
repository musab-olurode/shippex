export type LoginRequest = {
	usr: string;
	pwd: string;
};

export type AuthData = {
	message: string;
	home_page: string;
	full_name: string;
};

export type ShipmentStatus = {
	name: string;
	creation: string;
	modified: string;
	modified_by: string;
	owner: string;
	docstatus: number;
	idx: number;
	status: string;
	color: string;
	_user_tags: unknown;
	_comments: unknown;
	_assign: unknown;
	_liked_by: unknown;
};

export type Shipment = ShipmentStatus & {
	barcode: string;
	origin_city: string;
	destination_city: string;
	status: string;
	origin_address_line_1: string;
	destination_address_line_1: string;
	consignee_phone: string;
};

export type CheckedShipment = Shipment & {
	checked: boolean;
};

export type ErrorResponse = {
	message: string;
};

type FilterOperation = 'like' | 'in' | 'is';

type ShipmentListFilter = {
	[key in keyof Shipment]?: [FilterOperation, string | string[]];
};

export type ShipmentListRequest = {
	doctype: 'AWB';
	fields: keyof Shipment | ['*'];
	filters: ShipmentListFilter;
};
