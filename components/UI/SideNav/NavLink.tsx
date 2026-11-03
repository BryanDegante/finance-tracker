import Link from "next/link";
import type { IconType } from "react-icons";

type NavLinkProps = {
  href: string;
  text:string;
  icon: IconType;
}

export default function NavLink({href,text,icon}:NavLinkProps){
  const Icon = icon;
  return (
    <Link href={href} className="text-text-primary flex gap-2 sm:gap-4 items-center text-base sm:text-lg px-2 sm:px-3 hover:bg-primary hover:text-text-on-primary font-semibold rounded-cozy-sm">
      <Icon className="text-xl"/>
      {text}
    </Link>
  )
}