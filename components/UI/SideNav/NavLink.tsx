'use client';

import Link from "next/link";
import type { IconType } from "react-icons";
import { usePathname } from 'next/navigation';

type NavLinkProps = {
  href: string;
  text:string;
  icon: IconType;
}

export default function NavLink({href,text,icon}:NavLinkProps){
  const Icon = icon;
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className={`text-text-primary flex gap-3  items-center  text-base sm:text-lg  pl-1  font-medium rounded-cozy-sm font-quicksand-decorative ${isActive? 'bg-primary text-text-on-primary': 'hover:bg-primary-light '}`}>
      <Icon />
      {text}
    </Link>
  )
}