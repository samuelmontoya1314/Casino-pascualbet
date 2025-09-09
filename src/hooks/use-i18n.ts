'use client';

import { dictionaries, Locale } from "@/lib/i18n";
import { usePathname } from "next/navigation";

// A simple client-side hook to get the translator function
// This is a placeholder for a more robust i18n solution.
// It determines locale based on the root path, which we set in layout.tsx.
// This is not ideal as it doesn't have access to the session directly.
// A better solution would use a context provider.
export const useI18n = () => {
    const pathname = usePathname();
    // This is a simplification. A real app would use a more reliable way to get the current locale.
    const locale: Locale = pathname.startsWith('/en') ? 'en' : 'es';
    const dictionary = dictionaries[locale];

    return (key: string, params?: { [key: string]: string | number }) => {
        let translation = key.split('.').reduce((o, i) => o?.[i], dictionary as any);

        if (typeof translation !== 'string') {
            return key; // Return key if translation not found
        }
        
        if (params && typeof translation === 'string') {
            Object.keys(params).forEach(key => {
                translation = translation.replace(`{${key}}`, String(params[key]));
            });
        }
        return translation;
    }
}
