import type { InquiryFormConfig, InquiryFormField } from "./inquiryFormTypes";
import type { PhoneLocaleConfig } from "./contactFormValidation";
import {
  sanitizeNameInput,
  sanitizePhoneDigits,
  sanitizePlaceInput,
} from "./contactFormValidation";

const NAME_RE = /^[\p{L}][\p{L}\s'.-]*$/u;
const PLACE_RE = /^[\p{L}][\p{L}\s'.-]*$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type InquiryFieldErrors = Record<string, string>;

function validateField(field: InquiryFormField, raw: string, phoneConfig: PhoneLocaleConfig): string | null {
  const val = raw.trim();

  if (field.required && !val) return "required";

  if (!val) return null;

  switch (field.type) {
    case "name":
      if (val.length < 2) return "nameMin";
      if (!NAME_RE.test(val)) return "nameInvalid";
      return null;
    case "email":
      if (!EMAIL_RE.test(val)) return "emailInvalid";
      return null;
    case "phone": {
      const digits = val.replace(/\D/g, "");
      if (digits.length < phoneConfig.minDigits) return "phoneMin";
      if (digits.length > phoneConfig.maxDigits) return "phoneMax";
      return null;
    }
    case "whatsapp": {
      const digits = val.replace(/\D/g, "");
      if (digits && (digits.length < 6 || digits.length > 15)) return "whatsappInvalid";
      return null;
    }
    case "place":
      if (val.length < 2) return "placeMin";
      if (!PLACE_RE.test(val)) return "placeInvalid";
      return null;
    case "select": {
      if (field.options?.length && !field.options.some((o) => o.value === val)) return "selectInvalid";
      return null;
    }
    case "textarea":
      if (field.maxLength && val.length > field.maxLength) return "messageMax";
      return null;
    case "text":
    default:
      return null;
  }
}

export function validateInquiryForm(
  form: InquiryFormConfig,
  values: Record<string, string>,
  phoneConfig: PhoneLocaleConfig,
): InquiryFieldErrors {
  const errors: InquiryFieldErrors = {};
  for (const field of form.fields) {
    const code = validateField(field, values[field.key] ?? "", phoneConfig);
    if (code) errors[field.key] = code;
  }
  return errors;
}

export function sanitizeInquiryValue(field: InquiryFormField, value: string, phoneConfig: PhoneLocaleConfig): string {
  switch (field.type) {
    case "name":
      return sanitizeNameInput(value);
    case "place":
      return sanitizePlaceInput(value);
    case "phone":
      return sanitizePhoneDigits(value, phoneConfig.maxDigits);
    case "whatsapp":
      return sanitizePhoneDigits(value, 15);
    case "textarea":
      return value.slice(0, field.maxLength ?? 2000);
    default:
      return value;
  }
}
