import type { Locale } from "./routing";
import en from "../../messages/en.json";
import pl from "../../messages/pl.json";
import th from "../../messages/th.json";
import enExtra from "../../messages/locale/en.extra.json";
import plExtra from "../../messages/locale/pl.extra.json";
import thExtra from "../../messages/locale/th.extra.json";

const base = { en, pl, th } as const;
const extra = { en: enExtra, pl: plExtra, th: thExtra } as const;

export type AppMessages = typeof en & typeof enExtra;

function mergeMessages(
  baseMessages: (typeof en | typeof pl | typeof th),
  extraMessages: typeof enExtra,
): AppMessages {
  return {
    ...baseMessages,
    ...extraMessages,
    nav: { ...baseMessages.nav, ...extraMessages.nav },
    teamPage: {
      ...baseMessages.teamPage,
      ...("teamPage" in extraMessages && extraMessages.teamPage
        ? extraMessages.teamPage
        : {}),
    },
  } as AppMessages;
}

export function getAppMessages(locale?: string): AppMessages {
  const key = locale === "pl" || locale === "th" ? locale : "en";
  return mergeMessages(base[key], extra[key]);
}

export function getLocaleOrDefault(locale?: string): Locale {
  return locale === "pl" || locale === "th" ? locale : "en";
}
