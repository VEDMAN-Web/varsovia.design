import type { Locale } from "./routing";
import en from "../../messages/en.json";
import pl from "../../messages/pl.json";
import th from "../../messages/th.json";
import enExtra from "../../messages/locale/en.extra.json";
import plExtra from "../../messages/locale/pl.extra.json";
import thExtra from "../../messages/locale/th.extra.json";
import legalEn from "../../messages/locale/legal.en.json";
import legalPl from "../../messages/locale/legal.pl.json";
import legalTh from "../../messages/locale/legal.th.json";
import { mergeLocaleMessages } from "./mergeMessages";

const base = { en, pl, th } as const;
const extra = { en: enExtra, pl: plExtra, th: thExtra } as const;
const legal = { en: legalEn, pl: legalPl, th: legalTh } as const;

export type AppMessages = typeof en & typeof enExtra & typeof legalEn;

export function getAppMessages(locale?: string): AppMessages {
  const key = locale === "pl" || locale === "th" ? locale : "en";
  return mergeLocaleMessages(
    mergeLocaleMessages(base[key], extra[key]),
    legal[key],
  ) as AppMessages;
}

export function getLocaleOrDefault(locale?: string): Locale {
  return locale === "pl" || locale === "th" ? locale : "en";
}
