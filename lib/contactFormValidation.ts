import type { Locale } from "@/lib/i18n/routing";

export type PhoneLocaleConfig = {
  flag: string;
  dialCode: string;
  maxDigits: number;
  minDigits: number;
  placeholder: string;
};

/** Phone defaults — Varsovia contact forms default to Thailand (+66) on every locale. */
export const PHONE_CONFIG: Record<Locale, PhoneLocaleConfig> = {
  en: {
    flag: "/icon/flag-thailand.svg",
    dialCode: "+66",
    minDigits: 8,
    maxDigits: 9,
    placeholder: "812345678",
  },
  th: {
    flag: "/icon/flag-thailand.svg",
    dialCode: "+66",
    minDigits: 8,
    maxDigits: 9,
    placeholder: "812345678",
  },
  pl: {
    flag: "/icon/flag-thailand.svg",
    dialCode: "+66",
    minDigits: 8,
    maxDigits: 9,
    placeholder: "812345678",
  },
};

const NAME_RE = /^[\p{L}][\p{L}\s'.-]*$/u;
const PLACE_RE = /^[\p{L}][\p{L}\s'.-]*$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactField = "name" | "email" | "phone" | "whatsapp" | "city" | "country" | "message";

export type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  country: string;
  message: string;
};

export function sanitizeNameInput(value: string) {
  return value.replace(/[^\p{L}\s'.-]/gu, "");
}

export function sanitizePlaceInput(value: string) {
  return value.replace(/[^\p{L}\s'.-]/gu, "");
}

export function sanitizePhoneDigits(value: string, maxDigits: number) {
  return value.replace(/\D/g, "").slice(0, maxDigits);
}

export function validateContactForm(
  values: ContactFormValues,
  phoneConfig: PhoneLocaleConfig,
): Partial<Record<ContactField, string>> {
  const errors: Partial<Record<ContactField, string>> = {};

  const name = values.name.trim();
  if (!name) errors.name = "nameRequired";
  else if (name.length < 2) errors.name = "nameMin";
  else if (!NAME_RE.test(name)) errors.name = "nameInvalid";

  const email = values.email.trim();
  if (!email) errors.email = "emailRequired";
  else if (!EMAIL_RE.test(email)) errors.email = "emailInvalid";

  const phone = values.phone.replace(/\D/g, "");
  if (!phone) errors.phone = "phoneRequired";
  else if (phone.length < phoneConfig.minDigits || phone.length > phoneConfig.maxDigits) {
    errors.phone = "phoneInvalid";
  }

  const whatsapp = values.whatsapp.replace(/\D/g, "");
  if (values.whatsapp.trim() && (whatsapp.length < 6 || whatsapp.length > 15)) {
    errors.whatsapp = "whatsappInvalid";
  }

  const city = values.city.trim();
  if (city && (!PLACE_RE.test(city) || city.length < 2)) errors.city = "cityInvalid";

  const country = values.country.trim();
  if (country && (!PLACE_RE.test(country) || country.length < 2)) errors.country = "countryInvalid";

  const message = values.message.trim();
  if (message.length > 2000) errors.message = "messageMax";

  return errors;
}
