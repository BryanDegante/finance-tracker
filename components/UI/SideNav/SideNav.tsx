'use client';

import Image from 'next/image';
import NavLink from './NavLink';

import {
  MdAccountBalance,
  MdHome,
  MdCalendarMonth,
  MdCalculate,
  MdAttachMoney,
  MdOutlineSettings,
  MdOutlineLogout,
  MdOutlineLogin,
	MdOutlineSavings,
	MdAccountCircle,
} from 'react-icons/md';
import { TbMoneybag } from 'react-icons/tb';
export default function SideNav() {
	return (
		<aside className="flex flex-col min-h-screen justify-between py-10 px-2 border-r border-border w-40 sm:w-45">
			{/* Branding Wrapper */}
			<div className='flex items-center gap-2'>
				<figure className=" w-6 h-6 relative">
					<Image src={'/budgetier2.png'} fill alt="Budgetier Logo" className='object-contain' />
				</figure>
				<h1 className="font-nunito-titles text-lg sm:text-xl text-text-primary font-bold">
					Budgetier
				</h1>
			</div>
			{/* Main Navigation wrapper*/}
			<div className="flex flex-col gap-3">
				<NavLink href="/dashboard" text="Dashboard" icon={MdHome} />
				<NavLink
					href="/transactions"
					text="Transactions"
					icon={MdAttachMoney}
				/>
				<NavLink
					href="/accounts"
					text="Accounts"
					icon={MdAccountBalance}
				/>
				<NavLink href="/budgets" text="Budgets" icon={MdCalculate} />
				<NavLink href="/calendar" text="Calendar" icon={MdCalendarMonth} />
				<NavLink href="/debt" text="Debt" icon={TbMoneybag} />
				<NavLink
					href="/savings"
					text="Savings"
					icon={MdOutlineSavings}
				/>
			</div>
			{/*Account navigation wrapper */}
			<div className="flex flex-col gap-3">
				<NavLink
					href="/profile"
					text="Profile"
					icon={MdAccountCircle}
				/>
				<NavLink href="/" text="Logout" icon={MdOutlineLogout} />
				<NavLink href="/settings" text="settings" icon={MdOutlineSettings} />
			</div>
		</aside>
	);
}
