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
    <aside className="flex flex-col h-screen sticky top-0 py-8 px-3 border-r border-border w-44 sm:w-48 bg-background">
      {/* Branding Wrapper */}
      <div className="flex items-center gap-3 px-2 mb-8 shrink-0">
        <figure className="w-7 h-7 relative shrink-0">
          <Image src={'/budgetier2.png'} fill alt="Budgetier Logo" className="object-contain" />
        </figure>
        <h1 className="font-nunito-titles text-lg sm:text-xl text-text-primary font-bold">
          Budgetier
        </h1>
      </div>

      {/* Main Navigation Wrapper */}
     <div className="flex flex-col gap-1.5 min-h-0 overflow-y-auto">
        <NavLink href="/dashboard" text="Dashboard" icon={MdHome} />
        <NavLink href="/transactions" text="Transactions" icon={MdAttachMoney} />
        <NavLink href="/accounts" text="Accounts" icon={MdAccountBalance} />
        <NavLink href="/budgets" text="Budgets" icon={MdCalculate} />
        <NavLink href="/calendar" text="Calendar" icon={MdCalendarMonth} />
        <NavLink href="/debt" text="Debt" icon={TbMoneybag} />
        <NavLink href="/savings" text="Savings" icon={MdOutlineSavings} />
      </div>

      {/* Account Navigation Wrapper  */}
      <div className="flex flex-col gap-1.5 mt-auto pt-4 border-t border-border/50">
        <NavLink href="/profile" text="Profile" icon={MdAccountCircle} />
        <NavLink href="/settings" text="Settings" icon={MdOutlineSettings} />
        <NavLink href="/" text="Logout" icon={MdOutlineLogout} />
      </div>
    </aside>
  );
}