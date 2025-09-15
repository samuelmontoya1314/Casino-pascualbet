import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Press_Start_2P } from 'next/font/google';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

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
    <html lang="es" className="h-full dark" suppressHydrationWarning>
      <body className={`antialiased h-full font-sans ${pressStart2P.variable}`}>
        {children}
        <Toaster />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/manual">
                <Button size="icon" variant="outline" className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg bg-primary/20 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground animate-pulse">
                    <HelpCircle className="h-6 w-6" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="left">
                <p>Manual de Usuario</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </body>
    </html>
  );
}
