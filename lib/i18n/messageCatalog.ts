import type { Locale } from "./routing";
import en from "../../messages/en.json";
import pl from "../../messages/pl.json";
import th from "../../messages/th.json";
import enExtra from "../../messages/locale/en.extra.json";
import plExtra from "../../messages/locale/pl.extra.json";
import thExtra from "../../messages/locale/th.extra.json";
import { mergeLocaleMessages } from "./mergeMessages";

const base = { en, pl, th } as const;
const extra = { en: enExtra, pl: plExtra, th: thExtra } as const;

export type AppMessages = typeof en & typeof enExtra;

export function getAppMessages(locale?: string): AppMessages {
  const key = locale === "pl" || locale === "th" ? locale : "en";
  return mergeLocaleMessages(base[key], extra[key]) as AppMessages;
}

export function getLocaleOrDefault(locale?: string): Locale {
  return locale === "pl" || locale === "th" ? locale : "en";
}
