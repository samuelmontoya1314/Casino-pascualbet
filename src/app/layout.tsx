import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Press_Start_2P } from 'next/font/google';

const pressStart2P = Press_Start_2P({ subsets: ['latin'], weight: '400', variable: '--font-press-start' });

export const metadata: Metadata = {
  title: 'PascualBet',
  description: 'Tu casino online de confianza',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="es" className="h-full dark">
      <body className={`antialiased h-full font-sans ${pressStart2P.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
