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
    <Link href={href}>
      <Icon />
      {text}
    </Link>
  )
}