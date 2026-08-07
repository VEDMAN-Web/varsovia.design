"use client";

import { FormEvent, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Download } from "lucide-react";
import { submitContact } from "@/lib/submitContactClient";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { groupInquiryFields, resolveInquiryForm } from "@/lib/inquiryForm";
import type { InquiryFormField } from "@/lib/inquiryFormTypes";
import { sanitizeInquiryValue, validateInquiryForm } from "@/lib/inquiryFormValidation";
import {
  CONTACT_FIELD,
  CONTACT_FIELD_ROW,
  CONTACT_FORM_GAP,
  CONTACT_LABEL,
  CONTACT_TEXTAREA,
  INQUIRY_COPY,
  MODAL_FIELD,
  MODAL_FIELD_ROW,
  MODAL_FORM_GAP,
  MODAL_LABEL,
  type InquiryPurpose,
} from "@/components/forms/contactFormShared";
import { COUNTRY_DIAL_CODES, flagEmoji } from "@/lib/countryDialCodes";
import type { Locale } from "@/lib/i18n/routing";

type ContactInquiryFormProps = {
  purpose?: InquiryPurpose;
  downloadUrl?: string;
  onSubmitted?: () => void;
  className?: string;
  density?: "section" | "modal";
};

export default function ContactInquiryForm({
  purpose = "contact",
  downloadUrl,
  onSubmitted,
  className = "",
  density = "section",
}: ContactInquiryFormProps) {
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const site = useSiteSettings();
  const inquiryForm = useMemo(() => resolveInquiryForm(site), [site]);
  const [country, setCountry] = useState(
    () => COUNTRY_DIAL_CODES.find((c) => c.iso2 === "TH") ?? COUNTRY_DIAL_CODES[0],
  );
  const [dialOpen, setDialOpen] = useState(false);
  const [dialSearch, setDialSearch] = useState("");
  const phoneConfig = {
    flag: flagEmoji(country.iso:),
    dialCode: country.dial,
    minDigits: 4,
    maxDigits: 14,
    placeholder: "812345678",
  };
  const filteredCountries = COUNTRY_DIAL_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(dialSearch.trim().toLowerCase()) ||
      c.dial.includes(dialSearch.trim()),
  );
  const rows = useMemo(() => groupInquiryFields(inquiryForm.fields), [inquiryForm.fields]);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [formKey, setFormKey] = useState(0);

  const copy = INQUIRY_COPY[purpose];
  const isModal = density === "modal";
  const stretchSection = density === "section";
  const labelClass = isModal ? MODAL_LABEL : CONTACT_LABEL;
  const fieldClass = isModal ? MODAL_FIELD : CONTACT_FIELD;
  const rowClass = isModal ? MODAL_FIELD_ROW : CONTACT_FIELD_ROW;
  const formGapClass = isModal ? MODAL_FORM_GAP : CONTACT_FORM_GAP;
  const fieldClassSized =
    stretchSection && !isModal ? `${fieldClass} sm:h-[52px] md:h-[54px]` : fieldClass;

  function setFieldValue(key: string, field: InquiryFormField, raw: string) {
    setValues((prev) => ({
      ...prev,
      [key]: sanitizeInquiryValue(field, raw, phoneConfig),
    }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validationMessage(code: string, field: InquiryFormField) {
    if (code === "required") {
      if (field.type === "name") return t("validation.nameRequired");
      if (field.type === "email") return t("validation.emailRequired");
      if (field.type === "phone") return t("validation.phoneRequired");
      return t("validation.fieldRequired");
    }
    if (code === "nameMin") return t("validation.nameMin");
    if (code === "nameInvalid") return t("validation.nameInvalid");
    if (code === "emailInvalid") return t("validation.emailInvalid");
    if (code === "phoneMin" || code === "phoneMax") return t("validation.phoneInvalid");
    if (code === "whatsappInvalid") return t("validation.whatsappInvalid");
    if (code === "placeInvalid") return t("validation.placeInvalid");
    if (code === "placeMin") return t("validation.placeMin");
    if (code === "selectInvalid") return t("validation.selectInvalid");
    if (code === "messageMax") return t("validation.messageMax");
    return t("validation.fieldRequired");
  }

  function resetForm() {
    setValues({});
    setFieldErrors({});
    setFormKey((k) => k + 1);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const errors = validateInquiryForm(inquiryForm, values, phoneConfig);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setMessage("");
      return;
    }

    const payload: Record<string, string> = {};

    for (const field of inquiryForm.fields) {
      const raw = (values[field.key] ?? "").trim();
      if (!raw) continue;

      if (field.type === "phone" && field.useLocaleDialCode !== false) {
        payload[field.key] = `${phoneConfig.dialCode} ${raw.replace(/\D/g, "")}`;
      } else {
        payload[field.key] = raw;
      }
    }

    if (purpose === "catalogue") payload.source = "catalogue-download";

    setStatus("loading");
    setMessage("");
    setFieldErrors({});
    try {
      const res = await submitContact(payload);
      setStatus("success");
      setMessage(res.message || copy.successLead);
      resetForm();
      onSubmitted?.();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : tCommon("somethingWrong"));
    }
  }

  function renderField(field: InquiryFormField, stretchTextarea = false) {
    const id = `contact-${field.key}`;
    const err = fieldErrors[field.key];
    const value = values[field.key] ?? "";

    if (field.type === "phone" && field.useLocaleDialCode !== false) {
      return (
        <div key={field.key}>
          <label className={labelClass} htmlFor={id}>
            {field.label}
          </label>
          <div className={`${fieldClassSized} flex min-w-0 items-center gap-2 px-3 ${err ? "ring-2 ring-red-500/60" : ""}`}>
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setDialOpen((o) => !o)}
                className="flex shrink-0 items-center gap-1"
              >
                <span className="shrink-0 text-[16px] leading-none">{phoneConfig.flag}</span>
                <span className="shrink-0 text-[13px] font-medium text-[#251b1e] sm:text-[14px]">{phoneConfig.dialCode}</span>
                <ChevronDown size={12} className="shrink-0 text-[#6a414d]/60" />
              </button>
              {dialOpen ? (
                <div className="absolute left-0 top-full z-20 mt-1 w-[240px] overflow-hidden rounded-[6px] border border-[#cfc4c6] bg-white shadow-lg">
                  <div className="border-b border-[#e5dcd3] p-2">
                    <input
                      autoFocus
                      value={dialSearch}
                      onChange={(e) => setDialSearch(e.target.value)}
                      placeholder="Search country or code"
                      className="w-full rounded-[4px] border border-[#cfc4c6] px-2 py-1 text-[13px] outline-none"
                    />
                  </div>
                  <div className="max-h-[220px] overflow-y-auto py-1">
                    {filteredCountries.length === 0 ? (
                      <p className="px-3 py-2 text-[13px] text-[#6a414d]/60">No matches</p>
                    ) : (
                      filteredCountries.map((c) => (
                        <button
                          key={c.iso2}
                          type="button"
                          onClick={() => {
                            setCountry(c);
                            setDialOpen(false);
                            setDialSearch("");
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] hover:bg-[#f7f1f2]"
                        >
                          <span className="text-[16px] leading-none">{flagEmoji(c.iso2)}</span>
                          <span className="flex-1 truncate">{c.name}</span>
                          <span className="shrink-0 text-[#6a414d]/70">{c.dial}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            <span className="h-4 w-px shrink-0 bg-[#6a414d]/20" aria-hidden />
            <input
              id={id}
              name={field.key}
              required={field.required}
              value={value}
              onChange={(e) => setFieldValue(field.key, field, e.target.value)}
              inputMode="numeric"
              placeholder={field.placeholder || phoneConfig.placeholder}
              className="min-w-0 flex-1 bg-transparent text-[13px] text-[#251b1e] outline-none placeholder:text-[rgba(37,27,30,0.45)] sm:text-[14px]"
            />
          </div>
          {err ? <p className="font-outfit mt-1 pl-4 text-[13px] text-red-700">{validationMessage(err, field)}</p> : null}
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={field.key}>
          <label className={labelClass} htmlFor={id}>
            {field.label}
          </label>
          <div className="relative">
            <select
              id={id}
              name={field.key}
              required={field.required}
              value={value}
              onChange={(e) => setFieldValue(field.key, field, e.target.value)}
              className={`${fieldClassSized} cursor-pointer appearance-none pr-10 ${err ? "ring-2 ring-red-500/60" : ""}`}
            >
              <option value="" disabled>
                {field.placeholder || "â"}
              </option>
              {(field.options ?? []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6a414d]/70"
              aria-hidden
            />
          </div>
          {err ? <p className="font-outfit mt-1 pl-4 text-[13px] text-red-700">{validationMessage(err, field)}</p> : null}
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div
          key={field.key}
          className={`flex min-h-0 flex-col ${stretchTextarea ? "min-h-[120px] flex-1" : isModal ? "min-h-[48px]" : ""}`}
        >
          <label className={labelClass} htmlFor={id}>
            {field.label}
          </label>
          <textarea
            id={id}
            name={field.key}
            required={field.required}
            value={value}
            onChange={(e) => setFieldValue(field.key, field, e.target.value)}
            placeholder={field.placeholder}
            className={`resize-none ${err ? "ring-2 ring-red-500/60" : ""} ${
              stretchTextarea
                ? `${fieldClassSized} min-h-[120px] flex-1 py-3`
                : isModal
                  ? `${fieldClass} min-h-[48px] max-h-[112px] py-2 sm:max-h-[120px] lg:max-h-[140px]`
                  : CONTACT_TEXTAREA
            }`}
          />
          {err ? <p className="font-outfit mt-1 pl-4 text-[13px] text-red-700">{validationMessage(err, field)}</p> : null}
        </div>
      );
    }

    const inputType = field.type === "email" ? "email" : "text";

    return (
      <div key={field.key}>
        <label className={labelClass} htmlFor={id}>
          {field.label}
        </label>
        <input
          id={id}
          name={field.key}
          type={inputType}
          required={field.required}
          value={value}
          onChange={(e) => setFieldValue(field.key, field, e.target.value)}
          placeholder={field.placeholder}
          inputMode={field.type === "whatsapp" || field.type === "phone" ? "numeric" : undefined}
          className={`${fieldClassSized} ${err ? "ring-2 ring-red-500/60" : ""}`}
        />
        {err ? <p className="font-outfit mt-1 pl-4 text-[13px] text-red-700">{validationMessage(err, field)}</p> : null}
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className={`flex min-h-[320px] flex-1 flex-col items-center justify-center px-4 py-10 text-center lg:min-h-0 lg:h-full ${className}`.trim()}>
        <div className="relative mb-8 flex h-[133px] w-[133px] items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#dfc2c6]/35" aria-hidden />
          <div className="relative flex h-[94px] w-[94px] items-center justify-center rounded-full bg-[#dfc2c6]/50">
            <svg className="h-[34px] w-[34px] text-[#6a414d]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M9.55 15.15 18.025 6.675a1 1 0 1 1 1.414 1.414l-9.192 9.192a1 1 0 0 1-1.414 0l-4.242-4.243a1 1 0 0 1 1.414-1.414L9.55 15.15Z" />
            </svg>
          </div>
          <span className="absolute -left-8 top-6 h-1.5 w-1.5 rounded-full bg-[#cf5374]/80" aria-hidden />
          <span className="absolute -right-7 top-10 h-1 w-1 rounded-full bg-[#cf5374]/70" aria-hidden />
          <span className="absolute -bottom-5 left-4 h-1 w-1 rounded-full bg-[#cf5374]/60" aria-hidden />
          <span className="absolute -top-3 right-2 h-1.5 w-1.5 rounded-full bg-[#cf5374]/80" aria-hidden />
        </div>

        <h3 className="font-display text-[clamp(2rem,4vw,3.75rem)] font-normal tracking-[0.06em] text-[#6a414d] uppercase">
          {t("thankYou")}
        </h3>
        <p className="font-outfit mt-4 text-[clamp(1rem,1.6vw,1.375rem)] font-normal text-[#cf5374]">
          {copy.successLead || t("successMessage")}
        </p>
        <p className="font-outfit mt-3 max-w-[459px] text-[clamp(0.875rem,1.4vw,1rem)] leading-7 text-[#6a414d]/85">
          {copy.successBody || t("successFollowUp")}
        </p>

        {purpose === "catalogue" && downloadUrl ? (
          <a
            href={downloadUrl}
            download
            className="font-outfit mt-6 inline-flex h-[50px] items-center gap-2 rounded-[6px] bg-[#6a414d] px-5 text-[18px] font-normal text-white transition hover:bg-[#5a3640]"
          >
            {t("downloadPdf")}
            <Download size={16} aria-hidden />
          </a>
        ) : null}
      </div>
    );
  }

  const submitLabel = inquiryForm.submitLabel?.trim() || tCommon("submit");

  const lastTextareaKey = [...inquiryForm.fields].reverse().find((f) => f.type === "textarea")?.key;

  return (
    <form
      key={formKey}
      onSubmit={onSubmit}
      noValidate
      className={`${stretchSection ? "flex h-full min-h-0 flex-1 flex-col" : formGapClass} ${isModal ? "flex w-full min-w-0 flex-col" : ""} ${className}`.trim()}
    >
      <div className={`flex min-h-0 flex-col ${stretchSection ? "flex-1" : ""} ${formGapClass}`}>
        {rows.map((row, index) => {
          if (row.kind === "full") {
            return renderField(row.field, stretchSection && row.field.key === lastTextareaKey);
          }
          return (
            <div key={`row-${index}`} className={rowClass}>
              {row.fields.map((field) =>
                renderField(field, stretchSection && field.key === lastTextareaKey),
              )}
            </div>
          );
        })}
      </div>

      <div
        className={
          isModal
            ? "mt-auto flex w-full shrink-0 flex-col items-stretch pt-2 sm:items-end"
            : `mt-auto flex w-full shrink-0 flex-col items-center pt-4 sm:pt-5 ${stretchSection ? "md:pt-3" : ""}`
        }
      >
        {message ? (
          <p className={`font-outfit mb-2 text-center text-[14px] ${status === "error" ? "text-red-700" : "text-[#6a414d]"}`}>
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "loading"}
          className={`font-outfit rounded-[6px] bg-[#6a414d] font-normal text-white transition hover:bg-[#5a3640] disabled:opacity-70 ${
            isModal
              ? "h-[44px] w-full px-6 text-[16px] sm:w-auto sm:min-w-[200px] sm:text-[17px]"
              : "h-[48px] w-full max-w-[320px] px-6 text-[16px] sm:h-[50px] sm:px-5 sm:text-[18px] min-[520px]:w-auto min-[520px]:max-w-none"
          }`}
        >
          {status === "loading" ? tCommon("submitting") : submitLabel}
        </button>
      </div>
    </form>
  );
}
