"use client";

import { FormEvent, useState } from "react";
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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const copy = INQUIRY_COPY[purpose];
  const isModal = density === "modal";
  const labelClass = isModal ? MODAL_LABEL : CONTACT_LABEL;
  const fieldClass = isModal ? MODAL_FIELD : CONTACT_FIELD;
  const rowClass = isModal ? MODAL_FIELD_ROW : CONTACT_FIELD_ROW;
  const formGapClass = isModal ? MODAL_FORM_GAP : CONTACT_FORM_GAP;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries()) as Record<string, string>;

    if (purpose === "catalogue") {
      payload.source = "catalogue-download";
    }

    setStatus("loading");
    setMessage("");
    try {
      const res = await submitContact(payload);
      setStatus("success");
      setMessage(res.message || copy.successLead);
      form.reset();
      onSubmitted?.();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
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
          {copy.successTitle}
        </h3>
        <p className="font-outfit mt-4 text-[clamp(1rem,1.6vw,1.375rem)] font-normal text-[#cf5374]">
          {copy.successLead}
        </p>
        <p className="font-outfit mt-3 max-w-[459px] text-[clamp(0.875rem,1.4vw,1rem)] leading-7 text-[#6a414d]/85">
          {copy.successBody}
        </p>

        {purpose === "catalogue" && downloadUrl ? (
          <a
            href={downloadUrl}
            download
            className="font-outfit mt-6 inline-flex h-[50px] items-center gap-2 rounded-[6px] bg-[#6a414d] px-5 text-[18px] font-normal text-white transition hover:bg-[#5a3640]"
          >
            {INQUIRY_COPY.catalogue.downloadLabel}
            <Download size={16} aria-hidden />
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`${formGapClass} ${className}`.trim()}>
      <div>
        <label className={labelClass}>Full Name</label>
        <input name="name" required placeholder="Enter Your Full Name" className={fieldClass} />
      </div>

      <div>
        <label className={labelClass}>Email Address</label>
        <input name="email" type="email" required placeholder="Enter Your Email Address" className={fieldClass} />
      </div>

      <div className={rowClass}>
        <div>
          <label className={labelClass}>WhatsApp Number</label>
          <input name="whatsapp" placeholder="Enter Your WhatsApp Number" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Phone Number</label>
          <div className={`${fieldClass} flex items-center gap-2 px-3`}>
            <img src="/icon/flag-thailand.svg" alt="" className="h-[18px] w-[18px] shrink-0" />
            <ChevronDown size={14} className="shrink-0 text-[#6a414d]/70" aria-hidden />
            <span className="shrink-0 text-[14px] text-[#251b1e]">+66</span>
            <input
              name="phone"
              required
              placeholder="Enter Your Number"
              className="min-w-0 flex-1 bg-transparent text-[14px] text-[#251b1e] outline-none placeholder:text-[rgba(37,27,30,0.6)]"
            />
          </div>
        </div>
      </div>

      <div className={rowClass}>
        <div>
          <label className={labelClass}>City Name</label>
          <input name="city" placeholder="Enter Your City Name" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Country Name</label>
          <input name="country" placeholder="Enter Your Country Name" className={fieldClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Project Type</label>
        <div className="relative">
          <select
            name="projectType"
            defaultValue=""
            className={`${fieldClass} cursor-pointer appearance-none pr-10`}
          >
            <option value="" disabled>
              Select Your Project Type
            </option>
            <option value="Modular Kitchen">Modular Kitchen</option>
            <option value="Wardrobe">Wardrobe</option>
            <option value="TV Unit">TV Unit</option>
            <option value="Interior Design">Interior Design</option>
            <option value="Other">Other</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6a414d]/70"
            aria-hidden
          />
        </div>
      </div>

      <div className={`flex min-h-0 flex-col ${isModal ? "" : "min-h-[146px] flex-1"}`}>
        <label className={labelClass}>Message</label>
        <textarea
          name="message"
          placeholder="Tell Us a Bit About Your Kitchen Project..."
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
          {status === "loading" ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
