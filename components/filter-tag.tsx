import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '~/components/ui/text';

const FilterTag = ({
	filter,
	active,
	onPress,
}: {
	filter: string;
	active?: boolean;
	onPress: () => void;
}) => {
	return (
		<Text
			style={[styles.tag, active && styles.activeTag]}
			onPress={onPress}
			role='button'
		>
			{filter}
		</Text>
	);
};

const styles = StyleSheet.create({
	tag: {
		borderRadius: 10,
		color: '#58536E',
		backgroundColor: '#F4F2F8',
		paddingHorizontal: 14,
		paddingVertical: 6,
		borderWidth: 2,
		borderColor: 'transparent',
		fontWeight: '400',
		fontSize: 18,
		lineHeight: 22.4,
	},
	activeTag: {
		color: '#6E91EC',
		backgroundColor: '#F4F2F8',
		borderColor: '#6E91EC',
	},
});

export default FilterTag;
