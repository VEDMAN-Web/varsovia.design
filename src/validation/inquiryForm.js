/**
 * Admin-editable inquiry form (contact page + catalogue download modal).
 * Stored on SiteContent.inquiryForm; validated on POST /api/contact.
 */

const KNOWN_CONTACT_KEYS = new Set([
  "name",
  "email",
  "phone",
  "whatsapp",
  "city",
  "country",
  "projectType",
  "budget",
  "message",
]);

const FIELD_TYPES = new Set(["name", "text", "email", "phone", "whatsapp", "textarea", "select", "place"]);

const DEFAULT_INQUIRY_FORM = {
  version: 1,
  submitLabel: { en: "Submit", th: "ส่ง", pl: "Wyślij" },
  fields: [
    {
      key: "name",
      type: "name",
      label: { en: "Full Name", th: "ชื่อ-นามสกุล", pl: "Imię i nazwisko" },
      placeholder: { en: "Enter Your Full Name", th: "กรอกชื่อ-นามสกุล", pl: "Wpisz imię i nazwisko" },
      required: true,
      width: "full",
      order: 1,
      enabled: true,
    },
    {
      key: "email",
      type: "email",
      label: { en: "Email Address", th: "อีเมล", pl: "Adres e-mail" },
      placeholder: { en: "Enter Your Email Address", th: "กรอกอีเมล", pl: "Wpisz adres e-mail" },
      required: true,
      width: "full",
      order: 2,
      enabled: true,
    },
    {
      key: "whatsapp",
      type: "whatsapp",
      label: { en: "WhatsApp Number", th: "WhatsApp", pl: "Numer WhatsApp" },
      placeholder: { en: "Enter Your WhatsApp Number", th: "กรอก WhatsApp", pl: "Wpisz numer WhatsApp" },
      required: false,
      width: "half",
      order: 3,
      enabled: true,
    },
    {
      key: "phone",
      type: "phone",
      label: { en: "Phone Number", th: "เบอร์โทร", pl: "Numer telefonu" },
      placeholder: { en: "7123456789", th: "812345678", pl: "512345678" },
      required: true,
      width: "half",
      order: 4,
      enabled: true,
      useLocaleDialCode: true,
    },
    {
      key: "city",
      type: "place",
      label: { en: "City Name", th: "เมือง", pl: "Miasto" },
      placeholder: { en: "Enter Your City Name", th: "กรอกเมือง", pl: "Wpisz miasto" },
      required: false,
      width: "half",
      order: 5,
      enabled: true,
    },
    {
      key: "country",
      type: "place",
      label: { en: "Country Name", th: "ประเทศ", pl: "Kraj" },
      placeholder: { en: "Enter Your Country Name", th: "กรอกประเทศ", pl: "Wpisz kraj" },
      required: false,
      width: "half",
      order: 6,
      enabled: true,
    },
    {
      key: "projectType",
      type: "select",
      label: { en: "Project Type", th: "ประเภทโปรเจกต์", pl: "Typ projektu" },
      placeholder: { en: "Select Your Project Type", th: "เลือกประเภทโปรเจกต์", pl: "Wybierz typ projektu" },
      required: false,
      width: "half",
      order: 7,
      enabled: true,
      options: [
        { value: "Modular Kitchen", label: { en: "Modular Kitchen", th: "ครัวโมดูลาร์", pl: "Kuchnia modułowa" } },
        { value: "Wardrobe", label: { en: "Wardrobe", th: "ตู้เสื้อผ้า", pl: "Garderoba" } },
        { value: "TV Unit", label: { en: "TV Unit", th: "ชั้นวาง TV", pl: "Stolik RTV" } },
        { value: "Interior Design", label: { en: "Interior Design", th: "ออกแบบภายใน", pl: "Projekt wnętrz" } },
        { value: "Other", label: { en: "Other", th: "อื่นๆ", pl: "Inne" } },
      ],
    },
    {
      key: "budget",
      type: "select",
      label: { en: "Budget Range", th: "งบประมาณ", pl: "Zakres budżetu" },
      placeholder: { en: "Select Your Budget Range", th: "เลือกงบประมาณ", pl: "Wybierz budżet" },
      required: false,
      width: "half",
      order: 8,
      enabled: true,
      options: [
        { value: "under_5k", label: { en: "Under $5,000", th: "ต่ำกว่า $5,000", pl: "Poniżej $5,000" } },
        { value: "5k_15k", label: { en: "$5,000 – $15,000", th: "$5,000 – $15,000", pl: "$5,000 – $15,000" } },
        { value: "15k_30k", label: { en: "$15,000 – $30,000", th: "$15,000 – $30,000", pl: "$15,000 – $30,000" } },
        { value: "30k_75k", label: { en: "$30,000 – $75,000", th: "$30,000 – $75,000", pl: "$30,000 – $75,000" } },
        { value: "above_75k", label: { en: "Above $75,000", th: "มากกว่า $75,000", pl: "Powyżej $75,000" } },
      ],
    },
    {
      key: "message",
      type: "textarea",
      label: { en: "Message", th: "ข้อความ", pl: "Wiadomość" },
      placeholder: { en: "Tell us about your project", th: "บอกเราเกี่ยวกับโปรเจกต์", pl: "Opisz swój projekt" },
      required: false,
      width: "full",
      order: 9,
      enabled: true,
      maxLength: 2000,
    },
  ],
};

function normalizeForm(raw) {
  const base = raw && typeof raw === "object" ? raw : {};
  const fields = Array.isArray(base.fields) ? base.fields : DEFAULT_INQUIRY_FORM.fields;
  return {
    version: base.version ?? 1,
    submitLabel: base.submitLabel ?? DEFAULT_INQUIRY_FORM.submitLabel,
    fields: fields
      .filter((f) => f && typeof f === "object" && f.enabled !== false)
      .map((f, i) => ({
        ...f,
        order: typeof f.order === "number" ? f.order : i + 1,
        enabled: f.enabled !== false,
      }))
      .sort((a, b) => a.order - b.order),
  };
}

function getActiveForm(siteDoc) {
  return normalizeForm(siteDoc?.inquiryForm);
}

function localizeInquiryForm(form, locale) {
  const { resolveLocalized } = require("../utils/locale");
  const normalized = normalizeForm(form);
  return {
    version: normalized.version,
    submitLabel: resolveLocalized(normalized.submitLabel, locale),
    fields: normalized.fields.map((field) => ({
      key: field.key,
      type: field.type,
      label: resolveLocalized(field.label, locale),
      placeholder: resolveLocalized(field.placeholder, locale),
      required: Boolean(field.required),
      width: field.width === "half" ? "half" : "full",
      order: field.order,
      useLocaleDialCode: Boolean(field.useLocaleDialCode),
      maxLength: field.maxLength,
      options: Array.isArray(field.options)
        ? field.options.map((opt) => ({
            value: String(opt.value ?? ""),
            label: resolveLocalized(opt.label, locale),
          }))
        : undefined,
    })),
  };
}

function getInquiryFormFieldSpec() {
  return {
    version: DEFAULT_INQUIRY_FORM.version,
    knownStorageKeys: [...KNOWN_CONTACT_KEYS],
    fieldTypes: [...FIELD_TYPES],
    widths: ["full", "half"],
    notes: [
      "Edit via PUT /api/site with { inquiryForm: { fields: [...] } } (admin key).",
      "Use stable `key` values; known keys map to contact lead columns, others go to `responses`.",
      "Select options need `value` (stored) and `label` ({ en, th?, pl? }).",
      "Phone fields: set useLocaleDialCode true to match site locale dial codes on the frontend.",
    ],
    exampleField: {
      key: "projectType",
      type: "select",
      label: { en: "Project Type" },
      placeholder: { en: "Select…" },
      required: false,
      width: "half",
      order: 10,
      enabled: true,
      options: [{ value: "kitchen", label: { en: "Kitchen" } }],
    },
    defaultForm: DEFAULT_INQUIRY_FORM,
  };
}

module.exports = {
  KNOWN_CONTACT_KEYS,
  FIELD_TYPES,
  DEFAULT_INQUIRY_FORM,
  normalizeForm,
  getActiveForm,
  localizeInquiryForm,
  getInquiryFormFieldSpec,
};
