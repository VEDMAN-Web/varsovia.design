"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Download } from "lucide-react";
import { submitContact } from "@/lib/api";
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
import {
  PHONE_CONFIG,
  sanitizeNameInput,
  sanitizePhoneDigits,
  sanitizePlaceInput,
  validateContactForm,
  type ContactField,
} from "@/lib/contactFormValidation";
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
  const phoneConfig = PHONE_CONFIG[locale] ?? PHONE_CONFIG.en;

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [whatsappDigits, setWhatsappDigits] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formKey, setFormKey] = useState(0);

  const copy = INQUIRY_COPY[purpose];
  const isModal = density === "modal";
  const labelClass = isModal ? MODAL_LABEL : CONTACT_LABEL;
  const fieldClass = isModal ? MODAL_FIELD : CONTACT_FIELD;
  const rowClass = isModal ? MODAL_FIELD_ROW : CONTACT_FIELD_ROW;
  const formGapClass = isModal ? MODAL_FORM_GAP : CONTACT_FORM_GAP;

  function fieldErrorClass(field: ContactField) {
    return fieldErrors[field] ? "ring-2 ring-red-500/60" : "";
  }

  function clearFieldError(field: ContactField) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function resetForm() {
    setName("");
    setEmail("");
    setPhoneDigits("");
    setWhatsappDigits("");
    setCity("");
    setCountry("");
    setFormMessage("");
    setFieldErrors({});
    setFormKey((k) => k + 1);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const values = {
      name,
      email,
      phone: phoneDigits,
      whatsapp: whatsappDigits,
      city,
      country,
      message: formMessage,
    };

    const errors = validateContactForm(values, phoneConfig);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus("error");
      setMessage(t("fixErrors"));
      return;
    }

    const payload: Record<string, string> = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: `${phoneConfig.dialCode} ${phoneDigits}`,
    };

    if (whatsappDigits.trim()) payload.whatsapp = whatsappDigits;
    if (city.trim()) payload.city = city.trim();
    if (country.trim()) payload.country = country.trim();
    if (formMessage.trim()) payload.message = formMessage.trim();

    const projectType = String(data.get("projectType") ?? "").trim();
    const budget = String(data.get("budget") ?? "").trim();
    if (projectType) payload.projectType = projectType;
    if (budget) payload.budget = budget;
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

  return (
    <form
      key={formKey}
      onSubmit={onSubmit}
      noValidate
      className={`${formGapClass} ${isModal ? "flex w-full min-w-0 flex-col" : ""} ${className}`.trim()}
    >
      <div>
        <label className={labelClass} htmlFor="contact-name">
          {t("fullName")}
        </label>
        <input
          id="contact-name"
          name="name"
          required
          value={name}
          onChange={(e) => {
            setName(sanitizeNameInput(e.target.value));
            clearFieldError("name");
          }}
          placeholder={t("fullNamePh")}
          className={`${fieldClass} ${fieldErrorClass("name")}`}
        />
        {fieldErrors.name ? (
          <p className="font-outfit mt-1 pl-4 text-[13px] text-red-700">{t(`validation.${fieldErrors.name}`)}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="contact-email">
          {t("email")}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearFieldError("email");
          }}
          placeholder={t("emailPh")}
          className={`${fieldClass} ${fieldErrorClass("email")}`}
        />
        {fieldErrors.email ? (
          <p className="font-outfit mt-1 pl-4 text-[13px] text-red-700">{t(`validation.${fieldErrors.email}`)}</p>
        ) : null}
      </div>

      <div className={rowClass}>
        <div>
          <label className={labelClass} htmlFor="contact-whatsapp">
            {t("whatsapp")}
          </label>
          <input
            id="contact-whatsapp"
            name="whatsapp"
            inputMode="numeric"
            value={whatsappDigits}
            onChange={(e) => {
              setWhatsappDigits(sanitizePhoneDigits(e.target.value, 15));
              clearFieldError("whatsapp");
            }}
            placeholder={t("whatsappPh")}
            className={`${fieldClass} ${fieldErrorClass("whatsapp")}`}
          />
          {fieldErrors.whatsapp ? (
            <p className="font-outfit mt-1 pl-4 text-[13px] text-red-700">{t(`validation.${fieldErrors.whatsapp}`)}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="contact-phone">
            {t("phone")}
          </label>
          <div className={`${fieldClass} flex min-w-0 items-center gap-2 px-3 ${fieldErrorClass("phone")}`}>
            <img
              src={phoneConfig.flag}
              alt=""
              className="h-[18px] w-[22px] shrink-0 rounded-[2px] object-cover"
            />
            <span className="shrink-0 text-[13px] font-medium text-[#251b1e] sm:text-[14px]">{phoneConfig.dialCode}</span>
            <span className="h-4 w-px shrink-0 bg-[#6a414d]/20" aria-hidden />
            <input
              id="contact-phone"
              name="phone"
              required
              value={phoneDigits}
              onChange={(e) => {
                setPhoneDigits(sanitizePhoneDigits(e.target.value, phoneConfig.maxDigits));
                clearFieldError("phone");
              }}
              inputMode="numeric"
              placeholder={phoneConfig.placeholder}
              className="min-w-0 flex-1 bg-transparent text-[13px] text-[#251b1e] outline-none placeholder:text-[rgba(37,27,30,0.45)] sm:text-[14px]"
            />
          </div>
          {fieldErrors.phone ? (
            <p className="font-outfit mt-1 pl-4 text-[13px] text-red-700">{t(`validation.${fieldErrors.phone}`)}</p>
          ) : null}
        </div>
      </div>

      <div className={rowClass}>
        <div>
          <label className={labelClass} htmlFor="contact-city">
            {t("city")}
          </label>
          <input
            id="contact-city"
            name="city"
            value={city}
            onChange={(e) => {
              setCity(sanitizePlaceInput(e.target.value));
              clearFieldError("city");
            }}
            placeholder={t("cityPh")}
            className={`${fieldClass} ${fieldErrorClass("city")}`}
          />
          {fieldErrors.city ? (
            <p className="font-outfit mt-1 pl-4 text-[13px] text-red-700">{t(`validation.${fieldErrors.city}`)}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="contact-country">
            {t("country")}
          </label>
          <input
            id="contact-country"
            name="country"
            value={country}
            onChange={(e) => {
              setCountry(sanitizePlaceInput(e.target.value));
              clearFieldError("country");
            }}
            placeholder={t("countryPh")}
            className={`${fieldClass} ${fieldErrorClass("country")}`}
          />
          {fieldErrors.country ? (
            <p className="font-outfit mt-1 pl-4 text-[13px] text-red-700">{t(`validation.${fieldErrors.country}`)}</p>
          ) : null}
        </div>
      </div>

      <div className={rowClass}>
        <div>
          <label className={labelClass} htmlFor="contact-project-type">
            {t("projectType")}
          </label>
          <div className="relative">
            <select
              id="contact-project-type"
              name="projectType"
              defaultValue=""
              className={`${fieldClass} cursor-pointer appearance-none pr-10`}
            >
              <option value="" disabled>
                {t("projectTypePh")}
              </option>
              <option value="Modular Kitchen">{t("projectModularKitchen")}</option>
              <option value="Wardrobe">{t("projectWardrobe")}</option>
              <option value="TV Unit">{t("projectTvUnit")}</option>
              <option value="Interior Design">{t("projectInteriorDesign")}</option>
              <option value="Other">{t("projectOther")}</option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6a414d]/70"
              aria-hidden
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="contact-budget">
            {t("budgetRange")}
          </label>
          <div className="relative">
            <select
              id="contact-budget"
              name="budget"
              defaultValue=""
              className={`${fieldClass} cursor-pointer appearance-none pr-10`}
            >
              <option value="" disabled>
                {t("budgetPh")}
              </option>
              <option value={t("budget1")}>{t("budget1")}</option>
              <option value={t("budget2")}>{t("budget2")}</option>
              <option value={t("budget3")}>{t("budget3")}</option>
              <option value={t("budget4")}>{t("budget4")}</option>
              <option value={t("budget5")}>{t("budget5")}</option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6a414d]/70"
              aria-hidden
            />
          </div>
        </div>
      </div>

      <div className={`flex min-h-0 flex-col ${isModal ? "min-h-[48px]" : ""}`}>
        <label className={labelClass} htmlFor="contact-message">
          {t("message")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formMessage}
          onChange={(e) => {
            setFormMessage(e.target.value.slice(0, 2000));
            clearFieldError("message");
          }}
          placeholder={t("messagePh")}
          className={`resize-none ${fieldErrorClass("message")} ${
            isModal
              ? `${fieldClass} min-h-[48px] max-h-[112px] py-2 sm:max-h-[120px] lg:max-h-[140px]`
              : CONTACT_TEXTAREA
          }`}
        />
        {fieldErrors.message ? (
          <p className="font-outfit mt-1 pl-4 text-[13px] text-red-700">{t(`validation.${fieldErrors.message}`)}</p>
        ) : null}
      </div>

      <div
        className={
          isModal
            ? "flex w-full shrink-0 flex-col items-stretch pt-2 sm:items-end"
            : "flex w-full shrink-0 flex-col items-center pt-4 sm:pt-5"
        }
      >
        {message ? (
          <p
            className={`font-outfit mb-2 text-center text-[14px] ${status === "error" ? "text-red-700" : "text-[#6a414d]"}`}
          >
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
          {status === "loading" ? tCommon("submitting") : tCommon("submit")}
        </button>
      </div>
    </form>
  );
}
