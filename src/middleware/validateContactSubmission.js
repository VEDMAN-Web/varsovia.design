const { z } = require("zod");
const SiteContent = require("../models/SiteContent");
const { sendError } = require("../utils/apiResponse");
const { getActiveForm, KNOWN_CONTACT_KEYS } = require("../validation/inquiryForm");

const NAME_RE = /^[\p{L}][\p{L}\s'.-]*$/u;
const PLACE_RE = /^[\p{L}][\p{L}\s'.-]*$/u;

let cachedForm = null;
let cachedAt = 0;
const CACHE_MS = 30_000;

async function loadInquiryForm() {
  if (cachedForm && Date.now() - cachedAt < CACHE_MS) return cachedForm;
  const site = await SiteContent.findOne({ key: "main" }).select("inquiryForm").lean();
  cachedForm = getActiveForm(site);
  cachedAt = Date.now();
  return cachedForm;
}

const COMPACT_SOURCES = new Set(["get-in-touch", "journal-contact", "blog-contact"]);
const COMPACT_KEYS = new Set(["name", "whatsapp", "message"]);

function isCompactSubmission(body) {
  return COMPACT_SOURCES.has(String(body?.source || "").trim());
}

function fieldZod(field) {
  const key = field.key;
  let schema;

  switch (field.type) {
    case "name":
      schema = z
        .string()
        .max(200)
        .trim()
        .refine((val) => val.length >= 2 && NAME_RE.test(val), {
          message: "Enter a valid name (letters only).",
        });
      break;
    case "email":
      schema = z.string().email("Invalid email address.").max(200).trim();
      break;
    case "phone":
      schema = z.string().min(6, "Phone is required.").max(40).trim();
      break;
    case "whatsapp":
      schema = z
        .string()
        .max(30)
        .trim()
        .refine((val) => !val || /^\d{6,15}$/.test(val.replace(/\D/g, "")), "Invalid WhatsApp number.");
      break;
    case "textarea":
      schema = z.string().max(field.maxLength ?? 2000).trim();
      break;
    case "select":
      schema = z.string().max(200).trim();
      if (Array.isArray(field.options) && field.options.length > 0) {
        const allowed = new Set(field.options.map((o) => String(o.value)));
        schema = schema.refine((val) => !val || allowed.has(val), "Invalid selection.");
      }
      break;
    case "place":
      schema = z
        .string()
        .max(100)
        .trim()
        .refine((val) => val === "" || (PLACE_RE.test(val) && val.length >= 2), {
          message: "Use letters only (no numbers or symbols).",
        });
      break;
    case "text":
    default:
      schema = z
        .string()
        .max(200)
        .trim()
        .refine((val) => val === "" || (NAME_RE.test(val) && val.length >= 2), {
          message: "Use letters only.",
        });
      break;
  }

  if (field.required) {
    if (field.type === "phone") return schema.min(6);
    if (field.type === "email") return schema.min(1);
    if (field.type === "select") return schema.min(1, "This field is required.");
    return schema.min(1, "This field is required.");
  }

  return schema.optional().or(z.literal(""));
}

function buildContactZod(form, compact) {
  const shape = {};
  for (const field of form.fields) {
    if (!field.key || typeof field.key !== "string") continue;
    if (compact && !COMPACT_KEYS.has(field.key)) continue;
    const next =
      compact && field.key === "whatsapp" ? { ...field, required: true } : field;
    shape[field.key] = fieldZod(next);
  }
  if (compact && !shape.whatsapp) {
    shape.whatsapp = fieldZod({
      key: "whatsapp",
      type: "whatsapp",
      required: true,
    });
  }
  if (compact && !shape.name) {
    shape.name = fieldZod({ key: "name", type: "name", required: true });
  }
  if (compact && !shape.message) {
    shape.message = fieldZod({ key: "message", type: "textarea", required: false, maxLength: 2000 });
  }
  shape.source = z.string().max(100).trim().optional();
  return z.object(shape).passthrough();
}

function mapBodyToContact(parsed, form, compact) {
  const doc = {
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    city: "",
    country: "",
    projectType: "",
    budget: "",
    message: "",
    source: parsed.source || "",
    responses: {},
  };

  for (const field of form.fields) {
    const raw = parsed[field.key];
    const val = raw == null ? "" : String(raw).trim();
    if (!val) continue;

    if (KNOWN_CONTACT_KEYS.has(field.key)) {
      doc[field.key] = val;
    } else {
      doc.responses[field.key] = val;
    }
  }

  if (compact) {
    for (const key of COMPACT_KEYS) {
      if (!doc[key] && parsed[key] != null) {
        doc[key] = String(parsed[key]).trim();
      }
    }
    if (!doc.name) return { error: "Name is required." };
    if (!doc.whatsapp && !doc.phone) return { error: "WhatsApp number is required." };
    if (!doc.phone && doc.whatsapp) doc.phone = doc.whatsapp;
    return { doc };
  }

  if (!doc.name || !doc.email || !doc.phone) {
    return { error: "Name, email, and phone are required." };
  }

  return { doc };
}

async function validateContactSubmission(req, res, next) {
  try {
    const form = await loadInquiryForm();
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const compact = isCompactSubmission(body);
    const schema = buildContactZod(form, compact);
    const result = schema.safeParse(body);

    if (!result.success) {
      const issues = result.error.issues || [];
      const errors = issues.map((e) => ({
        field: (e.path || []).join("."),
        message: e.message,
      }));
      return sendError(res, 422, {
        code: "VALIDATION_ERROR",
        message: "Validation failed.",
        details: errors,
      });
    }

    const mapped = mapBodyToContact(result.data, form, compact);
    if (mapped.error) {
      return sendError(res, 400, { message: mapped.error });
    }

    req.contactPayload = mapped.doc;
    next();
  } catch (error) {
    next(error);
  }
}

function invalidateInquiryFormCache() {
  cachedForm = null;
  cachedAt = 0;
}

module.exports = { validateContactSubmission, invalidateInquiryFormCache, loadInquiryForm };
