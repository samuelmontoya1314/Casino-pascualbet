
export const dictionaries = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  es: () => import('@/locales/es.json').then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;
export const locales: Locale[] = ['en', 'es'];
export const defaultLocale: Locale = 'es';


export const getTranslator = async (locale: Locale = 'es') => {
  const dictionaryLoader = dictionaries[locale] || dictionaries.es;
  const dictionary = await dictionaryLoader();
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
};

export const getLocaleFromPhone = (phone: string): Locale => {
    if (phone.startsWith('+1')) return 'en'; // USA, Canada
    if (phone.startsWith('+44')) return 'en'; // UK
    if (phone.startsWith('+61')) return 'en'; // Australia
    // Default to Spanish for Colombian numbers or others
    return 'es';
}


// Helper type to get the resolved type of a promise
export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
