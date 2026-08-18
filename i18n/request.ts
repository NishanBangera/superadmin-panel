import { hasLocale, IntlErrorCode } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing, type AppLocale } from "@/i18n/routing";

async function loadMessages(locale: AppLocale) {
  const [common, ads] = await Promise.all([
    import(`./${locale}/common.json`),
    import(`./${locale}/ads.json`).catch(() => ({ default: {} })),
  ]);

  return {
    ...common.default,
    ads: ads.default,
  };
}

function getRawMessageKey({
  namespace,
  key,
}: {
  namespace?: string;
  key: string;
}) {
  return [namespace, key].filter(Boolean).join(".");
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
    onError(error) {
      if (error.code !== IntlErrorCode.MISSING_MESSAGE) {
        console.error(error);
      }
    },
    getMessageFallback: getRawMessageKey,
  };
});
