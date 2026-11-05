
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiMenu, HiX } from 'react-icons/hi';
import NavLink from './NavLink';
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

export default function NavModal() {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        return;
      }

      if (event.key === 'Tab') {
        const focusableElements =
          sidebarRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );

        if (!focusableElements?.length) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const focusIsOutside =
          !sidebarRef.current?.contains(document.activeElement);

        if (
          event.shiftKey &&
          (document.activeElement === firstElement || focusIsOutside)
        ) {
          event.preventDefault();
          lastElement.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === lastElement || focusIsOutside)
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);

      menuButtonRef.current?.focus();
    };
  }, [isOpen]);

  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="flex md:hidden items-center justify-between h-16 px-4 border-b border-border bg-background sticky top-0 z-40 w-full shrink-0">
        <div className="flex items-center gap-3">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-dialog"
            className="p-2 rounded-cozy-sm text-text-primary hover:bg-primary-light transition-colors"
          >
            <HiMenu aria-hidden="true" className="text-2xl" />
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <figure className="w-7 h-7 relative shrink-0">
              <Image
                src="/budgetier2.png"
                fill
                alt=""
                sizes="28px"
                className="object-contain"
              />
            </figure>

            <span className="font-quicksand-decorative text-lg text-text-primary font-bold">
              Budgetier
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close navigation menu"
            className="fixed inset-0 bg-card-muted/50 transition-opacity duration-300 animate-in fade-in"
          />

          <div
            ref={sidebarRef}
            id="mobile-navigation-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-navigation-title"
            className="relative z-10 flex flex-col w-4/5 max-w-xs h-full bg-background border-r border-border p-6 shadow-xl overflow-y-auto animate-in slide-in-from-left duration-300 ease-out"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 shrink-0">
              <div className="flex items-center gap-2">
                <figure className="w-7 h-7 relative shrink-0">
                  <Image
                    src="/budgetier2.png"
                    fill
                    alt=""
                    sizes="28px"
                    className="object-contain"
                  />
                </figure>

                <span
                  id="mobile-navigation-title"
                  className="font-quicksand-decorative text-lg text-text-primary font-bold"
                >
                  Budgetier
                </span>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDrawer}
                aria-label="Close navigation menu"
                className="p-2 rounded-cozy-sm text-text-primary hover:bg-primary-light transition-colors"
              >
                <HiX aria-hidden="true" className="text-2xl" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav
              aria-label="Mobile navigation links"
              className="flex flex-col gap-1.5 flex-1 min-h-0"
              onClick={closeDrawer}
            >
              <NavLink
                href="/dashboard"
                text="Dashboard"
                icon={MdHome}
                isExpanded={true}
              />

              <NavLink
                href="/transactions"
                text="Transactions"
                icon={MdAttachMoney}
                isExpanded={true}
              />

              <NavLink
                href="/accounts"
                text="Accounts"
                icon={MdAccountBalance}
                isExpanded={true}
              />

              <NavLink
                href="/budgets"
                text="Budgets"
                icon={MdCalculate}
                isExpanded={true}
              />

              <NavLink
                href="/calendar"
                text="Calendar"
                icon={MdCalendarMonth}
                isExpanded={true}
              />

              <NavLink
                href="/debt"
                text="Debt"
                icon={TbMoneybag}
                isExpanded={true}
              />

              <NavLink
                href="/savings"
                text="Savings"
                icon={MdOutlineSavings}
                isExpanded={true}
              />

              {/* Account Navigation */}
              <div className="flex flex-col gap-1.5 mt-6 pt-4 border-t border-border/50">
                <NavLink
                  href="/profile"
                  text="Profile"
                  icon={MdAccountCircle}
                  isExpanded={true}
                />

                <NavLink
                  href="/settings"
                  text="Settings"
                  icon={MdOutlineSettings}
                  isExpanded={true}
                />
              </div>
            </nav>

            {/* Logout Action */}
            <div className="mt-auto pt-4 border-t border-border/50">
              <form action={logoutAction} className="w-full">
                <button
                  type="submit"
                  className="w-full text-text-primary flex items-center justify-start text-base sm:text-lg font-medium rounded-cozy-sm font-nunito-titles transition-colors py-2.5 px-3 hover:bg-primary-light"
                >
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <MdOutlineLogout
                      aria-hidden="true"
                      className="text-xl"
                    />
                  </div>

                  <div className="overflow-hidden opacity-100 w-auto ml-3">
                    <span className="whitespace-nowrap">Logout</span>
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
