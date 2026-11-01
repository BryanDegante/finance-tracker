import SideNav from '@/components/UI/SideNav/SideNav';
import type { ReactNode } from 'react';

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen">
      <SideNav />
      {children}
    </div>
  );
}