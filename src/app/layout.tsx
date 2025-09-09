import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
      <body className={`antialiased h-full font-sans ${inter.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
