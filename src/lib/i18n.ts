
export const i18n = {
  defaultLocale: 'es',
  locales: ['en', 'es'],
} as const;

export const locales = i18n.locales;

export type Locale = (typeof i18n)['locales'][number];

export const dictionaries = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  es: () => import('@/locales/es.json').then((module) => module.default),
};

// Helper type to get the dictionary type
export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
