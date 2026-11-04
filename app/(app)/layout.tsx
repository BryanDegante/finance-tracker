import NavModal from '@/components/UI/SideNav/NavModal';
import SideNav from '@/components/UI/SideNav/SideNav';
import type { ReactNode } from 'react';

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <NavModal />

      <SideNav />

      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}