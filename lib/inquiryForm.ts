import type { InquiryFormConfig } from "./inquiryFormTypes";
import type { SiteContent } from "./siteTypes";

/** Client fallback when API site has no inquiryForm yet (matches backend DEFAULT_INQUIRY_FORM, EN). */
export const FALLBACK_INQUIRY_FORM_EN: InquiryFormConfig = {
  version: 1,
  submitLabel: "Submit",
  fields: [
    {
      key: "name",
      type: "name",
      label: "Full Name",
      placeholder: "Enter Your Full Name",
      required: true,
      width: "full",
      order: 1,
    },
    {
      key: "email",
      type: "email",
      label: "Email Address",
      placeholder: "Enter Your Email Address",
      required: true,
      width: "full",
      order: 2,
    },
    {
      key: "whatsapp",
      type: "whatsapp",
      label: "WhatsApp Number",
      placeholder: "Enter Your WhatsApp Number",
      required: false,
      width: "half",
      order: 3,
    },
    {
      key: "phone",
      type: "phone",
      label: "Phone Number",
      placeholder: "7123456789",
      required: true,
      width: "half",
      order: 4,
      useLocaleDialCode: true,
    },
    {
      key: "city",
      type: "place",
      label: "City Name",
      placeholder: "Enter Your City Name",
      required: false,
      width: "half",
      order: 5,
    },
    {
      key: "country",
      type: "place",
      label: "Country Name",
      placeholder: "Enter Your Country Name",
      required: false,
      width: "half",
      order: 6,
    },
    {
      key: "projectType",
      type: "select",
      label: "Project Type",
      placeholder: "Select Your Project Type",
      required: false,
      width: "half",
      order: 7,
      options: [
        { value: "Modular Kitchen", label: "Modular Kitchen" },
        { value: "Wardrobe", label: "Wardrobe" },
        { value: "TV Unit", label: "TV Unit" },
        { value: "Interior Design", label: "Interior Design" },
        { value: "Other", label: "Other" },
      ],
    },
    {
      key: "budget",
      type: "select",
      label: "Budget Range",
      placeholder: "Select Your Budget Range",
      required: false,
      width: "half",
      order: 8,
      options: [
        { value: "under_5k", label: "Under $5,000" },
        { value: "5k_15k", label: "$5,000 – $15,000" },
        { value: "15k_30k", label: "$15,000 – $30,000" },
        { value: "30k_75k", label: "$30,000 – $75,000" },
        { value: "above_75k", label: "Above $75,000" },
      ],
    },
    {
      key: "message",
      type: "textarea",
      label: "Message",
      placeholder: "Tell us about your project",
      required: false,
      width: "full",
      order: 9,
      maxLength: 2000,
    },
  ],
};

export function resolveInquiryForm(site: SiteContent | null | undefined): InquiryFormConfig {
  const raw = site?.inquiryForm;
  if (raw?.fields?.length) {
    return {
      version: raw.version,
      submitLabel: raw.submitLabel,
      fields: [...raw.fields].sort((a, b) => a.order - b.order),
    };
  }
  return FALLBACK_INQUIRY_FORM_EN;
}

/** Group half-width fields into rows of two. */
export function groupInquiryFields(fields: InquiryFormConfig["fields"]) {
  const rows: Array<{ kind: "full"; field: InquiryFormConfig["fields"][0] } | { kind: "half"; fields: InquiryFormConfig["fields"] }> =
    [];
  let halfBuffer: InquiryFormConfig["fields"] = [];

  for (const field of fields) {
    if (field.width === "half") {
      halfBuffer.push(field);
      if (halfBuffer.length === 2) {
        rows.push({ kind: "half", fields: halfBuffer });
        halfBuffer = [];
      }
    } else {
      if (halfBuffer.length) {
        rows.push({ kind: "half", fields: halfBuffer });
        halfBuffer = [];
      }
      rows.push({ kind: "full", field });
    }
  }
  if (halfBuffer.length) rows.push({ kind: "half", fields: halfBuffer });
  return rows;
}
