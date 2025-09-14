
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { locales } from '@/lib/i18n';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  
  const currentLocale = locales.find(loc => pathname.startsWith(`/${loc}`)) || 'es';

  const changeLocale = (newLocale: string) => {
    // A more robust way to handle path replacement
    const segments = pathname.split('/');
    
    // Check if the first segment is a locale
    if (locales.includes(segments[1] as any)) {
        segments[1] = newLocale; // replace it
    } else {
        segments.splice(1, 0, newLocale); // insert it
    }

    const newPath = segments.join('/');
    router.push(newPath);
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
            src={getFlagSrc(currentLocale)}
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
