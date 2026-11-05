'use client';

import Image from 'next/image';
import NavLink from './NavLink';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { logoutAction } from '@/app/actions/auth';

import {
  MdAccountBalance,
  MdHome,
  MdCalendarMonth,
  MdCalculate,
  MdAttachMoney,
  MdOutlineSettings,
  MdOutlineLogout,
  MdOutlineSavings,
  MdAccountCircle,
} from 'react-icons/md';

import { TbMoneybag } from 'react-icons/tb';

export default function SideNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

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
      force3D: true,
    });

    return () => {
      tween.kill();
    };
  }, [isExpanded]);

  return (
    <aside
      aria-label='Main navigation'
      ref={sidebarRef}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onFocus={() => setIsExpanded(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsExpanded(false);
        }
      }}
      className='
       hidden md:flex flex-col h-screen sticky top-0
    py-8 px-3 border-r border-border
    bg-background w-20 shrink-0
      [--sidebar-expanded-width:13rem]
			lg:[--sidebar-expanded-width:14rem]
      '>
      {/* Branding */}
      <div className='flex items-center px-3 mb-8 shrink-0'>
        <figure className='w-7 h-7 relative shrink-0'>
          <Image
            src='/budgetier2.png'
            fill
            alt='Budgetier Logo'
            className='object-contain'
            sizes='28px'
          />
        </figure>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'opacity-100 w-auto ml-3' : 'opacity-0 w-0 ml-0'
          }`}>
          <h1 className='font-quicksand-decorative text-lg sm:text-xl text-text-primary font-bold whitespace-nowrap'>
            Budgetier
          </h1>
        </div>
      </div>

      {/* Main Navigation  */}
      <div className='flex flex-col gap-1.5 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none'>
        <NavLink
          href='/dashboard'
          text='Dashboard'
          icon={MdHome}
          isExpanded={isExpanded}
        />
        <NavLink
          href='/transactions'
          text='Transactions'
          icon={MdAttachMoney}
          isExpanded={isExpanded}
        />
        <NavLink
          href='/accounts'
          text='Accounts'
          icon={MdAccountBalance}
          isExpanded={isExpanded}
        />
        <NavLink
          href='/budgets'
          text='Budgets'
          icon={MdCalculate}
          isExpanded={isExpanded}
        />
        <NavLink
          href='/calendar'
          text='Calendar'
          icon={MdCalendarMonth}
          isExpanded={isExpanded}
        />
        <NavLink
          href='/debt'
          text='Debt'
          icon={TbMoneybag}
          isExpanded={isExpanded}
        />
        <NavLink
          href='/savings'
          text='Savings'
          icon={MdOutlineSavings}
          isExpanded={isExpanded}
        />
      </div>

      {/* Account Navigation */}
      <div className='flex flex-col gap-1.5 mt-auto pt-4 border-t border-border/50'>
        <NavLink
          href='/profile'
          text='Profile'
          icon={MdAccountCircle}
          isExpanded={isExpanded}
        />
        <NavLink
          href='/settings'
          text='Settings'
          icon={MdOutlineSettings}
          isExpanded={isExpanded}
        />
        <form action={logoutAction}>
          <button
            type='submit'
            className='flex items-center w-full px-3 py-2 rounded-cozy-sm text-text-primary hover:bg-primary-light transition-colors cursor-pointer font-nunito-titles'>
            <MdOutlineLogout className='shrink-0 text-xl' />

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'opacity-100 w-auto ml-3' : 'opacity-0 w-0 ml-0'
              }`}>
              <span className='whitespace-nowrap'>Logout</span>
            </div>
          </button>
        </form>
      </div>
    </aside>
  );
}
