import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'EthioBites - Your Gateway to Ethiopian Excellence',
  description: 'Connect, discover, and grow with EthioBites - the premier platform for Ethiopian businesses and communities.',
  keywords: 'Ethiopia, business, community, marketplace, networking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans bg-surface-warm text-text-primary">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}