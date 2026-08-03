const { getRequestLocale, isAdminRequest } = require("./locale");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parsePagination(query) {
  const page = Math.max(1, parseInt(String(query.page), 10) || DEFAULT_PAGE);
  const limit = Math.max(
    1,
    Math.min(MAX_LIMIT, parseInt(String(query.limit), 10) || DEFAULT_LIMIT),
  );
  return { page, limit, skip: (page - 1) * limit };
}

function buildPaginationMeta(page, limit, total) {
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

function buildMeta(req, extra = {}) {
  const meta = { ...extra };
  if (req && !isAdminRequest(req)) {
    meta.locale = getRequestLocale(req);
  }
  return meta;
}

function sendSuccess(res, data, { status = 200, req, meta = {} } = {}) {
  const payload = {
    success: true,
    data,
    meta: req ? buildMeta(req, meta) : meta,
  };
  return res.status(status).json(payload);
}

function sendList(res, req, items, { page, limit, total, meta = {} }) {
  return sendSuccess(res, items, {
    req,
    meta: {
      ...meta,
      pagination: buildPaginationMeta(page, limit, total),
    },
  });
}

function errorCodeForStatus(status) {
  if (status === 400) return "BAD_REQUEST";
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 422) return "VALIDATION_ERROR";
  return "INTERNAL_ERROR";
}

function sendError(res, status, { code, message, details }) {
  const payload = {
    success: false,
    data: null,
    error: {
      code: code || errorCodeForStatus(status),
      message: message || "Request failed.",
    },
  };
  if (details !== undefined && details !== null) {
    payload.error.details = details;
  }
  return res.status(status).json(payload);
}

/** Read `{ message }` from legacy or envelope error bodies (client helpers). */
function readErrorMessage(body) {
  if (!body || typeof body !== "object") return "Request failed.";
  if (body.error && typeof body.error.message === "string") return body.error.message;
  if (typeof body.message === "string") return body.message;
  return "Request failed.";
}

module.exports = {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  parsePagination,
  buildPaginationMeta,
  sendSuccess,
  sendList,
  sendError,
  readErrorMessage,
};
