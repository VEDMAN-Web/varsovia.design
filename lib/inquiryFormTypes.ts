export type InquiryFormFieldType =
  | "name"
  | "text"
  | "email"
  | "phone"
  | "whatsapp"
  | "textarea"
  | "select"
  | "place";

export type InquiryFormSelectOption = {
  value: string;
  label: string;
};

export type InquiryFormField = {
  key: string;
  type: InquiryFormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  width: "full" | "half";
  order: number;
  useLocaleDialCode?: boolean;
  maxLength?: number;
  options?: InquiryFormSelectOption[];
};

export type InquiryFormConfig = {
  version?: number;
  submitLabel?: string;
  fields: InquiryFormField[];
};
