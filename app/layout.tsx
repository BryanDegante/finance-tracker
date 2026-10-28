import type { Metadata } from 'next';
import { Nunito_Sans, Nunito, Quicksand } from 'next/font/google';
import './globals.css';
import LoginModal from '@/components/UI/Form/Modal/LoginModal';

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
});

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
});

const quicksand = Quicksand({
  variable: '--font-quicksand',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Budgetier',
  description: 'A cozy space to manage budgets and shared expenses.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='en'
      className={`${nunitoSans.variable} ${nunito.variable} ${quicksand.variable} h-full antialiased`}>
      <body className='min-h-full flex flex-col'>
        <LoginModal />
        {children}
      </body>
    </html>
  );
}
