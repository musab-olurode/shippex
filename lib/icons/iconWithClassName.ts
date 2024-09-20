import type { LucideIcon } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { SvgProps } from 'react-native-svg';

export function iconWithClassName(icon: LucideIcon | React.FC<SvgProps>) {
	cssInterop(icon, {
		className: {
			target: 'style',
			nativeStyleToProp: {
				color: true,
				opacity: true,
			},
		},
	});
}
