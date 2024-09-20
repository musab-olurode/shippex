import { cva } from 'class-variance-authority';
import React from 'react';
import { Text } from '~/components/ui/text';
import Color from 'color';

const tagVariants = cva(
	'rounded-[0.25rem] px-[0.375rem] py-1 font-medium text-[0.6875rem] leading-[0.9625rem] border border-white',
	{
		variants: {
			status: {
				RECEIVED: 'text-[#2F50C1] bg-[#D9E6FD]',
				ERROR: 'text-[#D12030] bg-[#FEE3D4]',
				DELIVERED: 'text-[#208D28] bg-[#E3FAD6]',
				CANCELLED: 'text-[#58536E] bg-[#F4F2F8]',
				'ON HOLD': 'text-[#DB7E21] bg-[#FFF3D5]',
			},
		},
		defaultVariants: {
			status: 'RECEIVED',
		},
	}
);

const Tag = ({
	status,
	statusDetails,
}: {
	// status: 'RECEIVED' | 'ERROR' | 'DELIVERED' | 'CANCELLED' | 'ON HOLD';
	status: string;
	statusDetails?: {
		[key: string]: { color: string; status: string };
	};
}) => {
	return (
		<Text
			className='rounded-[0.25rem] px-[0.375rem] py-1 font-medium text-[0.6875rem] leading-[0.9625rem] border border-white'
			style={{
				color:
					statusDetails && statusDetails[status]
						? statusDetails[status].color
						: '#2F50C1',
				backgroundColor:
					statusDetails && statusDetails[status]
						? Color(statusDetails[status].color).alpha(0.2).rgb().string()
						: '#D9E6FD',
			}}
		>
			{status || 'RECEIVED'}
		</Text>
	);
};

export default Tag;
