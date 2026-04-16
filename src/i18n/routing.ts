import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ur', 'ar', 'ko', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const rtlLocales: Locale[] = ['ur', 'ar'];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});
