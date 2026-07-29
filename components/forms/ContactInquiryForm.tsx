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
import type { Locale } from "@/lib/i18n/routing";

// ─── Phone config per locale ──────────────────────────────────────────────────
const PHONE_CONFIG: Record<Locale, {
  flag: string;
  dialCode: string;
  maxDigits: number;
  pattern: string;      // HTML input pattern for native validation
  placeholder: string;  // digit-only placeholder
}> = {
  en: {
    flag: "/icon/flag-english.svg",
    dialCode: "+91",
    maxDigits: 10,
    pattern: "[0-9]{10}",
    placeholder: "9876543210",
  },
  th: {
    flag: "/icon/flag-thailand.svg",
    dialCode: "+66",
    maxDigits: 9,
    pattern: "[0-9]{8,9}",
    placeholder: "812345678",
  },
  pl: {
    flag: "/icon/flag-polish.svg",
    dialCode: "+48",
    maxDigits: 9,
    pattern: "[0-9]{9}",
    placeholder: "512345678",
  },
};

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
  const [phoneDigits, setPhoneDigits] = useState("");
  const [formKey, setFormKey] = useState(0);

  const copy = INQUIRY_COPY[purpose];
  const isModal = density === "modal";
  const labelClass = isModal ? MODAL_LABEL : CONTACT_LABEL;
  const fieldClass = isModal ? MODAL_FIELD : CONTACT_FIELD;
  const rowClass = isModal ? MODAL_FIELD_ROW : CONTACT_FIELD_ROW;
  const formGapClass = isModal ? MODAL_FORM_GAP : CONTACT_FORM_GAP;

  function handlePhoneInput(e: React.ChangeEvent<HTMLInputElement>) {
    // Strip everything except digits
    const digits = e.target.value.replace(/\D/g, "").slice(0, phoneConfig.maxDigits);
    setPhoneDigits(digits);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries()) as Record<string, string>;

    // Prefix dial code so the lead shows full international number
    if (payload.phone) {
      payload.phone = `${phoneConfig.dialCode} ${payload.phone}`;
    }

    if (purpose === "catalogue") {
      payload.source = "catalogue-download";
    }

    setStatus("loading");
    setMessage("");
    try {
      const res = await submitContact(payload);
      setStatus("success");
      setMessage(res.message || copy.successLead);
      setPhoneDigits("");
      setFormKey((k) => k + 1); // remount form to reset all uncontrolled fields
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
    <form key={formKey} onSubmit={onSubmit} className={`${formGapClass} ${className}`.trim()}>
      <div>
        <label className={labelClass}>{t("fullName")}</label>
        <input name="name" required placeholder={t("fullNamePh")} className={fieldClass} />
      </div>

      <div>
        <label className={labelClass}>{t("email")}</label>
        <input name="email" type="email" required placeholder={t("emailPh")} className={fieldClass} />
      </div>

      <div className={rowClass}>
        <div>
          <label className={labelClass}>{t("whatsapp")}</label>
          <input name="whatsapp" placeholder={t("whatsappPh")} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>{t("phone")}</label>
          <div className={`${fieldClass} flex items-center gap-2 px-3`}>
            <img
              src={phoneConfig.flag}
              alt=""
              className="h-[18px] w-auto shrink-0 rounded-[2px] object-cover"
              style={{ minWidth: "22px" }}
            />
            <span className="shrink-0 text-[14px] font-medium text-[#251b1e]">{phoneConfig.dialCode}</span>
            <span className="h-4 w-px shrink-0 bg-[#6a414d]/20" aria-hidden />
            <input
              name="phone"
              required
              value={phoneDigits ?? ""}
              onChange={handlePhoneInput}
              inputMode="numeric"
              pattern={phoneConfig.pattern}
              maxLength={phoneConfig.maxDigits}
              placeholder={phoneConfig.placeholder}
              title={t("phonePh")}
              className="min-w-0 flex-1 bg-transparent text-[14px] text-[#251b1e] outline-none placeholder:text-[rgba(37,27,30,0.45)]"
            />
          </div>
        </div>
      </div>

      <div className={rowClass}>
        <div>
          <label className={labelClass}>{t("city")}</label>
          <input name="city" placeholder={t("cityPh")} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>{t("country")}</label>
          <input name="country" placeholder={t("countryPh")} className={fieldClass} />
        </div>
      </div>

      <div className={rowClass}>
        <div>
          <label className={labelClass}>{t("projectType")}</label>
          <div className="relative">
            <select
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
          <label className={labelClass}>{t("budgetRange")}</label>
          <div className="relative">
            <select
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

      <div className={`flex min-h-0 flex-col ${isModal ? "" : "min-h-[146px] flex-1"}`}>
        <label className={labelClass}>{t("message")}</label>
        <textarea
          name="message"
          placeholder={t("messagePh")}
          className={`resize-none ${isModal ? `${fieldClass} h-[118px] py-3` : CONTACT_TEXTAREA}`}
        />
      </div>

      {message ? (
        <p className={`font-outfit text-[14px] ${status === "error" ? "text-red-700" : "text-[#6a414d]"}`}>
          {message}
        </p>
      ) : null}

      <div className={`mt-auto flex shrink-0 justify-center ${isModal ? "pb-1 pt-2" : "pt-10"}`}>
        <button
          type="submit"
          disabled={status === "loading"}
          className={`font-outfit rounded-[6px] bg-[#6a414d] font-normal text-white transition hover:bg-[#5a3640] disabled:opacity-70 ${
            isModal ? "h-[46px] px-[18px] text-[18px]" : "h-[50px] px-5 text-[18px]"
          }`}
        >
          {status === "loading" ? tCommon("submitting") : tCommon("submit")}
        </button>
      </div>
    </form>
  );
}
