'use client';

import Link from 'next/link';
import type { IconType } from 'react-icons';
import { usePathname } from 'next/navigation';

type NavLinkProps = {
	href: string;
	text: string;
	icon: IconType;
	isExpanded: boolean;
};

export default function NavLink({
	href,
	text,
	icon: Icon,
	isExpanded,
}: NavLinkProps) {
	const pathname = usePathname();

	const isActive =
		pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

	return (
		<Link
			href={href}
			aria-label={text}
			aria-current={isActive ? 'page' : undefined}
			title={!isExpanded ? text : undefined}
			className={`
				group flex w-full items-center gap-3
				rounded-cozy-sm px-3 py-2.5
				font-nunito-titles text-base sm:text-lg font-medium
				transition-colors duration-200
				focus-visible:outline-none
				focus-visible:ring-2
				focus-visible:ring-primary
				focus-visible:ring-offset-1
				focus-visible:ring-offset-background
				${
					isActive
						? 'bg-primary text-text-on-primary'
						: 'text-text-primary hover:bg-primary-light'
				}
			`}
		>
			{/* Navigation Icon */}
			<span className="flex h-6 w-6 shrink-0 items-center justify-center">
				<Icon aria-hidden="true" className="text-xl" />
			</span>

			{/* Navigation Label */}
			<span
				aria-hidden={!isExpanded}
				className={`
					overflow-hidden whitespace-nowrap
					transition-all duration-300 ease-in-out
					${isExpanded ? 'ml-0 w-auto opacity-100' : 'ml-0 w-0 opacity-0'}
				`}
			>
				{text}
			</span>
		</Link>
	);
}
