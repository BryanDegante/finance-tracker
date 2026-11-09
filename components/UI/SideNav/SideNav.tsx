'use client';

import Image from 'next/image';
import NavLink from './NavLink';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { logoutAction } from '@/app/actions/auth';

import {
	MdHome,
	MdAttachMoney,
	MdAccountBalance,
	MdCalculate,
	MdCalendarMonth,
	MdOutlineSettings,
	MdOutlineLogout,
	MdOutlineSavings,
	MdAccountCircle,
} from 'react-icons/md';

import { TbMoneybag } from 'react-icons/tb';

export default function SideNav() {
	const [isPointerInside, setIsPointerInside] = useState(false);
	const [isFocusWithin, setIsFocusWithin] = useState(false);

	const sidebarRef = useRef<HTMLElement>(null);

	// Sidebar expands when either pointer or keyboard focus is inside.
	const isExpanded = isPointerInside || isFocusWithin;

	// Animate sidebar width.
	useEffect(() => {
		const sidebar = sidebarRef.current;
		if (!sidebar) return;

		const expandedWidth = getComputedStyle(sidebar)
			.getPropertyValue('--sidebar-expanded-width')
			.trim();

		const tween = gsap.to(sidebar, {
			width: isExpanded ? expandedWidth : '5rem',
			duration: 0.35,
			ease: 'power2.inOut',
			overwrite: 'auto',
		});

		return () => {
			tween.kill();
		};
	}, [isExpanded]);

	return (
		<aside
			ref={sidebarRef}
			onMouseEnter={() => setIsPointerInside(true)}
			onMouseLeave={() => setIsPointerInside(false)}
			onFocusCapture={() => setIsFocusWithin(true)}
			onBlurCapture={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
					setIsFocusWithin(false);
				}
			}}
			className="
				hidden md:flex flex-col
				sticky top-0 h-dvh
				w-20 shrink-0
				py-8 px-3
				border-r border-border
				bg-background
				[--sidebar-expanded-width:13rem]
				lg:[--sidebar-expanded-width:14rem]
			"
		>
			{/* Branding */}
			<div className="flex items-center px-3 mb-8 shrink-0">
				<figure className="relative w-7 h-7 shrink-0">
					<Image
						src="/budgetier2.png"
						fill
						alt="Budgetier"
						className="object-contain"
						sizes="28px"
						priority
					/>
				</figure>

				<div
					className={`
						overflow-hidden whitespace-nowrap
						transition-all duration-300 ease-in-out
						${isExpanded ? 'opacity-100 w-auto ml-3' : 'opacity-0 w-0 ml-0'}
					`}
				>
					<h1 className="font-quicksand-decorative text-lg sm:text-xl text-text-primary font-bold">
						Budgetier
					</h1>
				</div>
			</div>

			{/* Primary Navigation */}
			<nav
				aria-label="Primary navigation"
				className="
					flex flex-1 flex-col gap-1.5 	
					min-h-0 overflow-y-auto px-1 py-1
					[&::-webkit-scrollbar]:hidden
					[-ms-overflow-style:none]
					scrollbar-none
				"
			>
				<NavLink
					href="/dashboard"
					text="Dashboard"
					icon={MdHome}
					isExpanded={isExpanded}
				/>

				<NavLink
					href="/transactions"
					text="Transactions"
					icon={MdAttachMoney}
					isExpanded={isExpanded}
				/>

				<NavLink
					href="/accounts"
					text="Accounts"
					icon={MdAccountBalance}
					isExpanded={isExpanded}
				/>

				<NavLink
					href="/budgets"
					text="Budgets"
					icon={MdCalculate}
					isExpanded={isExpanded}
				/>

				<NavLink
					href="/calendar"
					text="Calendar"
					icon={MdCalendarMonth}
					isExpanded={isExpanded}
				/>

				<NavLink
					href="/debt"
					text="Debt"
					icon={TbMoneybag}
					isExpanded={isExpanded}
				/>

				<NavLink
					href="/savings"
					text="Savings"
					icon={MdOutlineSavings}
					isExpanded={isExpanded}
				/>
			</nav>

			{/* Account Navigation */}
			<nav
				aria-label="Account navigation"
				className="
					flex flex-col gap-1.5
					mt-auto pt-4 shrink-0
					border-t border-border/50
				"
			>
				<NavLink
					href="/profile"
					text="Profile"
					icon={MdAccountCircle}
					isExpanded={isExpanded}
				/>

				<NavLink
					href="/settings"
					text="Settings"
					icon={MdOutlineSettings}
					isExpanded={isExpanded}
				/>

				{/* Logout */}
				<form action={logoutAction}>
					<button
						type="submit"
						aria-label="Log out"
						title={!isExpanded ? 'Log out' : undefined}
						className="
							group flex items-center gap-3
							w-full px-3 py-2.5
							rounded-cozy-sm
							font-nunito-titles font-medium
							text-base sm:text-lg
							text-text-primary
							hover:bg-primary-light
							transition-colors duration-200
							cursor-pointer
							focus-visible:outline-none
							focus-visible:ring-2
							focus-visible:ring-primary
							focus-visible:ring-offset-2
							focus-visible:ring-offset-background
						"
					>
						<span className="w-6 h-6 shrink-0 flex items-center justify-center">
							<MdOutlineLogout
								aria-hidden="true"
								className="text-xl"
							/>
						</span>

						<span
							aria-hidden={!isExpanded}
							className={`
								overflow-hidden whitespace-nowrap
								transition-all duration-300 ease-in-out
								${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
							`}
						>
							Logout
						</span>
					</button>
				</form>
			</nav>
		</aside>
	);
}
