
'use client';

import { dictionaries, Locale, Awaited } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Dictionary = Awaited<ReturnType<typeof dictionaries.es>>;

// A client-side hook to get the translator function that works with async dictionaries.
export const useI18n = () => {
    const pathname = usePathname();
    const locale: Locale = pathname.startsWith('/en') ? 'en' : 'es';
    const [dictionary, setDictionary] = useState<Dictionary | null>(null);

    useEffect(() => {
        const loadDictionary = async () => {
            const dict = await dictionaries[locale]();
            setDictionary(dict);
        };
        loadDictionary();
    }, [locale]);

    return (key: string, params?: { [key: string]: string | number }) => {
        if (!dictionary) {
            return key; // Return key while dictionary is loading
        }

        let translation = key.split('.').reduce((o, i) => o?.[i], dictionary as any);

        if (typeof translation !== 'string') {
            return key; // Return key if translation not found
        }
        
        if (params && typeof translation === 'string') {
            Object.keys(params).forEach(pKey => {
                translation = translation.replace(`{${pKey}}`, String(params[pKey]));
            });
        }
        return translation;
    }
}
