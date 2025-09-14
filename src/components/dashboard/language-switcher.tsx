
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import Image from 'next/image';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  
  const currentLocale = pathname.split('/')[1];

  const changeLocale = (locale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(locale === 'es' ? pathname.replace('/en', '') : `/en${pathname}`);
    router.refresh();
  };

  const getFlagSrc = (locale: string) => {
    if (locale === 'en') {
      return '/flags/gb.svg';
    }
    return '/flags/es.svg';
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Image 
            src={getFlagSrc(currentLocale === 'en' ? 'en' : 'es')}
            alt={currentLocale === 'en' ? 'UK Flag' : 'Spain Flag'}
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => changeLocale('es')}>
           <Image 
            src="/flags/es.svg"
            alt="Spain Flag"
            width={20}
            height={20}
            className="w-5 h-5 mr-2"
          />
          Español
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => changeLocale('en')}>
           <Image 
            src="/flags/gb.svg"
            alt="UK Flag"
            width={20}
            height={20}
            className="w-5 h-5 mr-2"
          />
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
