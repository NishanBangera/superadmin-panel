"use client";

import {
  IntlErrorCode,
  NextIntlClientProvider,
  useMessages,
} from "next-intl";

function getRawMessageKey({
  namespace,
  key,
}: {
  namespace?: string;
  key: string;
}) {
  return [namespace, key].filter(Boolean).join(".");
}

export function IntlErrorHandlingProvider({
  children,
  locale,
}: Readonly<{
  children: React.ReactNode;
  locale: string;
}>) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={(error) => {
        if (error.code !== IntlErrorCode.MISSING_MESSAGE) {
          console.error(error);
        }
      }}
      getMessageFallback={getRawMessageKey}
    >
      {children}
    </NextIntlClientProvider>
  );
}
