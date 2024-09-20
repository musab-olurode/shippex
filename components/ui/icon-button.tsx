import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Pressable } from 'react-native';
import { Text, TextClassContext } from '~/components/ui/text';
import { cn } from '~/lib/utils';
import { SvgProps } from 'react-native-svg';

const iconButtonVariants = cva(
	'group flex items-center justify-center rounded-lg web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 h-14 px-4 py-2 native:px-5',
	{
		variants: {
			variant: {
				default: 'bg-primary web:hover:opacity-90 active:bg-[#4169E1]',
				gray: 'web:hover:bg-accent web:hover:text-accent-foreground active:bg-[##EAE7F2] bg-[#F4F2F8]',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

const iconButtonTextVariants = cva(
	'web:whitespace-nowrap text-base font-normal leading-[1.4rem] text-foreground web:transition-colors',
	{
		variants: {
			variant: {
				default: 'text-primary-foreground',
				gray: 'group-active:text-accent-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

const disabledIconButtonVariants = cva('web:pointer-events-none', {
	variants: {
		variant: {
			default: 'bg-[#EAE7F2]',
			gray: 'bg-[#F4F2F8]',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

const disabledTextVariants = cva('web:pointer-events-none', {
	variants: {
		variant: {
			default: 'text-[#CDCAD9]',
			gray: 'text-[#CDCAD9]',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

const iconVariantsColor = ({
	variant = 'default',
	disabled,
}: {
	variant?: 'default' | 'gray' | null;
	disabled?: boolean;
}) => {
	if (variant === null) {
		variant = 'default';
	}

	let color = {
		default: '#fff',
		gray: '#58536E',
	};

	if (disabled) {
		color = {
			default: '#CDCAD9',
			gray: '#CDCAD9',
		};
	}

	return color[variant];
};

type AdditionalIconButtonProps = {
	title: string;
	icon: React.FC<SvgProps>;
};

type IconButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
	VariantProps<typeof iconButtonVariants> &
	AdditionalIconButtonProps;

const IconButton = React.forwardRef<
	React.ElementRef<typeof Pressable>,
	IconButtonProps
>(({ className, variant, icon: Icon, title, ...props }, ref) => {
	const disabled = props.disabled;
	return (
		<TextClassContext.Provider
			value={cn(
				iconButtonTextVariants({ variant }),
				disabled && disabledTextVariants({ variant })
			)}
		>
			<Pressable
				className={cn(
					iconButtonVariants({ variant, className }),
					disabled && disabledIconButtonVariants({ variant }),
					'flex flex-row items-center justify-center gap-2'
				)}
				ref={ref}
				role='button'
				{...props}
			>
				<Icon color={iconVariantsColor({ variant })} />
				<Text>{title}</Text>
			</Pressable>
		</TextClassContext.Provider>
	);
});
IconButton.displayName = 'IconButton';

export { IconButton, iconButtonTextVariants, iconButtonVariants };
export type { IconButtonProps };
