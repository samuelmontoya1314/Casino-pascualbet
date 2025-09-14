import { Press_Start_2P } from 'next/font/google';

const pressStart2P = Press_Start_2P({ subsets: ['latin'], weight: '400', variable: '--font-press-start' });

export default function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  return (
    <div className={`h-full font-sans ${pressStart2P.variable}`}>
        {children}
    </div>
  );
}
