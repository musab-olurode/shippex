import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Pressable } from 'react-native';
import { TextClassContext } from '~/components/ui/text';
import { cn } from '~/lib/utils';
import SpinLoader from '~/components/spin-loader';

const buttonVariants = cva(
	'group flex items-center justify-center rounded-lg web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
	{
		variants: {
			variant: {
				default: 'bg-primary web:hover:opacity-90 active:bg-[#4169E1]',
				secondary: 'bg-white web:hover:opacity-90 active:bg-[#D9E6FD]',
				destructive: 'bg-destructive web:hover:opacity-90 active:opacity-90',
				outline:
					'border border-input bg-background web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
				ghost:
					'web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent bg-[#F4F2F8]',
				link: 'web:underline-offset-4 web:hover:underline web:focus:underline ',
			},
			size: {
				default: 'h-14 px-4 py-2 native:px-5',
				sm: 'h-9 px-3',
				lg: 'h-11 px-8 native:h-14',
				icon: 'h-10 w-10 p-2',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

const buttonTextVariants = cva(
	'web:whitespace-nowrap text-[1.0625rem] font-bold leading-[1.375rem] text-foreground web:transition-colors',
	{
		variants: {
			variant: {
				default: 'text-primary-foreground',
				secondary: 'text-primary',
				destructive: 'text-destructive-foreground',
				outline: 'group-active:text-accent-foreground',
				ghost: 'group-active:text-accent-foreground',
				link: 'text-primary',
			},
			size: {
				default: '',
				sm: '',
				lg: 'native:text-lg',
				icon: '',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

const disabledButtonVariants = cva('web:pointer-events-none', {
	variants: {
		variant: {
			default: 'bg-[#EAE7F2]',
			secondary: 'bg-[#F4F2F8]',
			destructive: 'bg-[#EAE7F2]',
			outline: 'border-[#EAE7F2]',
			ghost: 'bg-transparent',
			link: 'bg-transparent',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

const loadingButtonVariants = cva('web:pointer-events-none', {
	variants: {
		variant: {
			default: 'bg-[#4169E1]',
			secondary: '',
			destructive: '',
			outline: '',
			ghost: '',
			link: '',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

const disabledTextVariants = cva('web:pointer-events-none', {
	variants: {
		variant: {
			default: 'text-[#A7A3B3]',
			secondary: 'text-[#CDCAD9]',
			destructive: 'text-[#A7A3B3]',
			outline: 'text-[#A7A3B3]',
			ghost: 'text-[#A7A3B3]',
			link: 'text-[#A7A3B3]',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

type AdditionalButtonProps = {
	loading?: boolean;
};

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
	VariantProps<typeof buttonVariants> &
	AdditionalButtonProps;

const Button = React.forwardRef<
	React.ElementRef<typeof Pressable>,
	ButtonProps
>(({ className, variant, size, loading, ...props }, ref) => {
	const disabled = props.disabled;
	return (
		<TextClassContext.Provider
			value={cn(
				buttonTextVariants({ variant, size }),
				disabled && disabledTextVariants({ variant })
			)}
		>
			<Pressable
				className={cn(
					buttonVariants({ variant, size, className }),
					disabled && disabledButtonVariants({ variant }),
					loading && loadingButtonVariants({ variant })
				)}
				ref={ref}
				role='button'
				{...props}
				disabled={props.disabled || loading}
				onPress={loading ? undefined : props.onPress}
			>
				{!loading ? (
					props.children
				) : variant === 'secondary' ? (
					<SpinLoader variant='secondary' />
				) : (
					<SpinLoader variant='primary' />
				)}
			</Pressable>
		</TextClassContext.Provider>
	);
});
Button.displayName = 'Button';

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
