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
  icon,
  isExpanded,
}: NavLinkProps) {
  const Icon = icon;
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-label={text}
      className={`text-text-primary flex items-center justify-start text-base sm:text-lg font-medium rounded-cozy-sm font-nunito-titles transition-colors py-2.5 px-3 ${
        isActive ? 'bg-primary text-text-on-primary' : 'hover:bg-primary-light'
      }`}>
      <div className='w-6 h-6 flex items-center justify-center shrink-0'>
        <Icon aria-hidden='true' className='text-xl' />
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'opacity-100 w-auto ml-3' : 'opacity-0 w-0 ml-0'
        }`}>
        <span className='whitespace-nowrap'>{text}</span>
      </div>
    </Link>
  );
}
