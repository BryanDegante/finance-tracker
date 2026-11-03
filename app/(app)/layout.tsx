import SideNav from '@/components/UI/SideNav/SideNav';
import type { ReactNode } from 'react';

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
return (
  <div className="flex min-h-screen">
    <SideNav />

    <main className="flex-1 min-w-0">
      {children}
    </main>
  </div>
);
}