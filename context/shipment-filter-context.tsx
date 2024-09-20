import React, {
	createContext,
	useContext,
	useState,
	useRef,
	useCallback,
} from 'react';
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { Text } from '~/components/ui/text';
import ShipmentFilter from '~/components/shipment-filter';
import { StatusBar } from 'expo-status-bar';
import { usePathname } from 'expo-router';

type BottomSheetContextType = {
	bottomSheetRef: React.RefObject<BottomSheetMethods>;
	bottomSheetOpen: boolean;
	openBottomSheet: () => void;
	closeBottomSheet: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
	undefined
);

type BottomSheetProviderProps = {
	children: JSX.Element | JSX.Element[];
};

export const ShipmentFilterBottomSheetProvider: React.FC<
	BottomSheetProviderProps
> = ({ children }) => {
	const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
	const bottomSheetRef = useRef<BottomSheetMethods>(null);
	const pathname = usePathname();

	const openBottomSheet = () => {
		bottomSheetRef.current?.expand();
		setBottomSheetOpen(true);
	};

	const closeBottomSheet = () => {
		bottomSheetRef.current?.close();
		setBottomSheetOpen(false);
	};

	const handleOnBottomSheetChange = (index: number) => {
		if (index === -1) {
			closeBottomSheet();
		}
	};

	const renderBackdrop = useCallback(
		(props: BottomSheetDefaultBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[]
	);

	return (
		<BottomSheetContext.Provider
			value={{
				bottomSheetRef,
				bottomSheetOpen,
				openBottomSheet,
				closeBottomSheet,
			}}
		>
			{children}
			<BottomSheet
				ref={bottomSheetRef}
				index={-1}
				backdropComponent={renderBackdrop}
				enableDynamicSizing
				enablePanDownToClose
				onChange={handleOnBottomSheetChange}
				backgroundStyle={{
					backgroundColor: '#fff',
					borderTopRightRadius: 10,
					borderTopLeftRadius: 10,
				}}
				handleIndicatorStyle={{
					backgroundColor: '#A7A3B3',
				}}
				style={{ zIndex: 2 }}
			>
				<BottomSheetView style={{ backgroundColor: '#fff', minHeight: 40 }}>
					{pathname === '/shipments' && (
						<>
							<StatusBar translucent backgroundColor='transparent' />
							<ShipmentFilter closeBottomSheet={closeBottomSheet} />
						</>
					)}
				</BottomSheetView>
			</BottomSheet>
		</BottomSheetContext.Provider>
	);
};

export const useShipmentFilterBottomSheet = () => {
	const context = useContext(BottomSheetContext);
	if (!context) {
		throw new Error(
			'useShipmentFilterBottomSheet must be used within a BottomSheetProvider'
		);
	}
	return context;
};
