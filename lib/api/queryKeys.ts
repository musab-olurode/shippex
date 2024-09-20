const authNamespace = 'auth';
export const authKeys = {
	create: `${authNamespace}/create`,
	read: `${authNamespace}/read`,
	readOne: `${authNamespace}/readOne`,
	patch: `${authNamespace}/patch`,
	delete: `${authNamespace}/delete`,
	state: `${authNamespace}/state`,
};

const shipmentNamespace = 'shipment';
export const shipmentKeys = {
	create: `${shipmentNamespace}/create`,
	read: `${shipmentNamespace}/read`,
	readOne: `${shipmentNamespace}/readOne`,
	readStatusList: `${shipmentNamespace}/readStatusList`,
	patch: `${shipmentNamespace}/patch`,
	delete: `${shipmentNamespace}/delete`,
	state: `${shipmentNamespace}/state`,
	appliedStatusState: `${shipmentNamespace}/appliedStatusState`,
	searchQueryState: `${shipmentNamespace}/searchQueryState`,
};
