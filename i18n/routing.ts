import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

export function getTextDirection(locale: AppLocale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export function isAppLocale(value: string | undefined): value is AppLocale {
  return routing.locales.includes(value as AppLocale);
}
