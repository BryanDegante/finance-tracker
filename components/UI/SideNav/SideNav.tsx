'use client';

import Link from "next/link";

export default function SideNav() {
  return (
    <aside className="flex flex-col">
      {/* Branding Wrapper */}
      <div>

      <h1>Budgetier</h1>
      </div>
      {/* Main Navigation wrapper*/}
      <div className="flex flex-col">
        <Link href='/dashboard'>
          {/* Icon */}
          Dashboard
        </Link>
        <Link href='/transactions'>
          {/* Icon */}
          Transactions
        </Link>
        <Link href='/calendar'>
          {/* Icon */}
          Calendar
        </Link>
        <Link href='/debt'>
          {/* Icon */}
          Debt
        </Link>
        <Link href='/savings'>
          {/* Icon */}
          Savings
        </Link>
      </div>
      {/*Account navigation wrapper */}
      <div className="flex flex-col">
       <Link href='/Profile'>
          {/* Icon */}
          Profile
        </Link>
       <Link href='/'>
          {/* Icon */}
          
        </Link>
       <Link href='/settings'>
          {/* Icon */}
          Settings
        </Link>
      </div>
    </aside>
  );
}