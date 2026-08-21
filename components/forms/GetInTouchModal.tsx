"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Shield, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useModalScrollLock } from "@/hooks/useModalScrollLock";
import { trackGenerateLead } from "@/lib/analytics";
import { sanitizeNameInput, sanitizePhoneDigits } from "@/lib/contactFormValidation";
import CountryDialSelect, { defaultDialCountry } from "@/components/forms/CountryDialSelect";
import { resolveInquiryForm } from "@/lib/inquiryForm";
import { submitContact } from "@/lib/submitContactClient";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import {
  GET_IN_TOUCH_BTN,
  GET_IN_TOUCH_CARD,
  GET_IN_TOUCH_CLOSE,
  GET_IN_TOUCH_FIELD,
  GET_IN_TOUCH_FIELD_BOX,
  GET_IN_TOUCH_FIELD_GAP,
  GET_IN_TOUCH_LABEL,
  GET_IN_TOUCH_OVERLAY,
  GET_IN_TOUCH_PRIVACY,
  GET_IN_TOUCH_RULE,
  GET_IN_TOUCH_SUBTITLE,
  GET_IN_TOUCH_TEXTAREA,
  GET_IN_TOUCH_TITLE,
} from "@/components/forms/getInTouchLayoutShared";

const NAME_RE = /^[\p{L}][\p{L}\s'.-]*$/u;

export function opensGetInTouch(href?: string) {
  const raw = String(href || "").trim();
  if (/^https?:\/\//i.test(raw)) return false;
  const path = (raw.split("?")[0] || "").replace(/\/+$/, "") || "/contact";
  const normalized = path.replace(/^\/(en|th|pl)(?=\/|$)/, "") || "/";
  return (
    normalized === "/contact" ||
    normalized === "#get-in-touch" ||
    normalized === "#contact" ||
    normalized === "#inquiry" ||
    normalized === "#"
  );
}

type GetInTouchModalProps = {
  open: boolean;
  onClose: () => void;
  source?: string;
};

function fieldByKey(fields: { key: string; label?: string; placeholder?: string }[], key: string) {
  return fields.find((f) => f.key === key);
}

function ModalBody({ onClose, source }: { onClose: () => void; source: string }) {
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");
  const site = useSiteSettings();
  const inquiry = useMemo(() => resolveInquiryForm(site), [site]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  useModalScrollLock(true, dialogRef, dialogRef);

  const [country, setCountry] = useState(() => defaultDialCountry());

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  const nameField = fieldByKey(inquiry.fields, "name");
  const waField = fieldByKey(inquiry.fields, "whatsapp");
  const msgField = fieldByKey(inquiry.fields, "message");

  const title = inquiry.compactTitle?.trim() || t("getInTouchTitle");
  const subtitle = inquiry.compactSubtitle?.trim() || t("getInTouchSubtitle");
  const submitLabel = inquiry.compactSubmitLabel?.trim() || t("getInTouchSubmit");
  const privacy = inquiry.compactPrivacy?.trim() || t("getInTouchPrivacy");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    nameRef.current?.focus();
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (status !== "success") return;
    const id = window.setTimeout(() => onClose(), 2200);
    return () => window.clearTimeout(id);
  }, [status, onClose]);

  function validate() {
    const next: Record<string, string> = {};
    const n = name.trim();
    if (!n) next.name = t("validation.nameRequired");
    else if (n.length < 2) next.name = t("validation.nameMin");
    else if (!NAME_RE.test(n)) next.name = t("validation.nameInvalid");

    const digits = whatsapp.replace(/\D/g, "");
    if (!digits) next.whatsapp = t("validation.whatsappRequired");
    else if (digits.length < 6 || digits.length > 15) {
      next.whatsapp = t("validation.whatsappInvalid");
    }

    if (message.length > 2000) next.message = t("validation.messageMax");
    return next;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      setServerMessage("");
      return;
    }
    setErrors({});
    setStatus("loading");
    setServerMessage("");
    const waValue = `${country.dial} ${whatsapp.replace(/\D/g, "")}`.trim();
    try {
      const res = await submitContact({
        name: name.trim(),
        whatsapp: waValue,
        message: message.trim(),
        source,
      });
      setStatus("success");
      setServerMessage(res.message || t("successMessage"));
      trackGenerateLead(source);
    } catch (err) {
      setStatus("error");
      setServerMessage(err instanceof Error ? err.message : tCommon("somethingWrong"));
    }
  }

  if (status === "success") {
    return (
      <div
        ref={dialogRef}
        className={GET_IN_TOUCH_CARD}
        role="dialog"
        aria-modal="true"
        aria-labelledby="get-in-touch-success"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className={GET_IN_TOUCH_CLOSE}
          aria-label={t("getInTouchClose")}
        >
          <X size={18} strokeWidth={1.75} />
        </button>
        <div className="px-2 py-10 text-center">
          <h3
            id="get-in-touch-success"
            className="font-display text-[clamp(1.75rem,4vw,2.25rem)] font-normal uppercase tracking-[0.08em] text-[#6a414d]"
          >
            {t("thankYou")}
          </h3>
          <p className="font-outfit mt-3 text-[15px] text-[#cf5374]">{serverMessage || t("successMessage")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={dialogRef}
        className={GET_IN_TOUCH_CARD}
        role="dialog"
        aria-modal="true"
        aria-labelledby="get-in-touch-title"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
    >
      <button
        type="button"
        onClick={onClose}
        className={GET_IN_TOUCH_CLOSE}
        aria-label={t("getInTouchClose")}
      >
        <X size={18} strokeWidth={1.75} />
      </button>

      <h2 id="get-in-touch-title" className={GET_IN_TOUCH_TITLE}>
        {title}
      </h2>
      <p className={GET_IN_TOUCH_SUBTITLE}>{subtitle}</p>
      <div className={GET_IN_TOUCH_RULE} aria-hidden />

      <form onSubmit={onSubmit} noValidate className="flex flex-col">
        <div>
          <label className={GET_IN_TOUCH_LABEL} htmlFor="get-in-touch-name">
            {nameField?.label || t("fullName")}
          </label>
          <input
            ref={nameRef}
            id="get-in-touch-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(sanitizeNameInput(e.target.value))}
            placeholder={nameField?.placeholder || t("fullNamePh")}
            className={`${GET_IN_TOUCH_FIELD} ${errors.name ? "ring-2 ring-red-500/60" : ""}`}
          />
          {errors.name ? <p className="font-outfit mt-1 text-[13px] text-red-700">{errors.name}</p> : null}
        </div>

        <div className={GET_IN_TOUCH_FIELD_GAP}>
          <label className={GET_IN_TOUCH_LABEL} htmlFor="get-in-touch-whatsapp">
            {waField?.label || t("whatsapp")}
          </label>
          <div
            className={`${GET_IN_TOUCH_FIELD_BOX} ${errors.whatsapp ? "ring-2 ring-red-500/60" : ""}`}
          >
            <CountryDialSelect
              value={country}
              labelledBy="get-in-touch-whatsapp"
              onChange={setCountry}
            />
            <input
              id="get-in-touch-whatsapp"
              name="whatsapp"
              inputMode="numeric"
              autoComplete="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(sanitizePhoneDigits(e.target.value, 15))}
              placeholder={t("getInTouchWhatsappPh")}
              className="min-w-0 flex-1 bg-transparent text-[14px] text-[#251b1e] outline-none placeholder:text-[rgba(37,27,30,0.45)]"
            />
          </div>
          {errors.whatsapp ? (
            <p className="font-outfit mt-1 text-[13px] text-red-700">{errors.whatsapp}</p>
          ) : null}
        </div>

        <div className={GET_IN_TOUCH_FIELD_GAP}>
          <label className={GET_IN_TOUCH_LABEL} htmlFor="get-in-touch-message">
            {msgField?.label || t("message")}
          </label>
          <textarea
            id="get-in-touch-message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
            placeholder={t("getInTouchMessagePh")}
            className={`${GET_IN_TOUCH_TEXTAREA} ${errors.message ? "ring-2 ring-red-500/60" : ""}`}
          />
          {errors.message ? (
            <p className="font-outfit mt-1 text-[13px] text-red-700">{errors.message}</p>
          ) : null}
        </div>

        {serverMessage && status === "error" ? (
          <p className="font-outfit mt-3 text-center text-[14px] text-red-700">{serverMessage}</p>
        ) : null}

        <button type="submit" disabled={status === "loading"} className={GET_IN_TOUCH_BTN}>
          {status === "loading" ? tCommon("submitting") : submitLabel}
        </button>

        <p className={GET_IN_TOUCH_PRIVACY}>
          <Shield size={14} strokeWidth={1.75} className="shrink-0 text-[#8a7a7e]" aria-hidden />
          <span>{privacy}</span>
        </p>
      </form>
    </div>
  );
}

export default function GetInTouchModal({
  open,
  onClose,
  source = "get-in-touch",
}: GetInTouchModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !open) return null;

  return createPortal(
    <div className={`${GET_IN_TOUCH_OVERLAY} font-outfit`} onClick={onClose} role="presentation" data-lenis-prevent>
      <ModalBody onClose={onClose} source={source} />
    </div>,
    document.body,
  );
}
