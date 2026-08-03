export type ApiPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type ApiMeta = {
  locale?: string;
  pagination?: ApiPagination;
  message?: string;
  tookMs?: number;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: ApiMeta;
};

export type ApiErrorBody = {
  code: string;
  message: string;
  details?: unknown;
};

export type ApiFailure = {
  success: false;
  data: null;
  error: ApiErrorBody;
};

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export function isApiEnvelope(body: unknown): body is ApiEnvelope<unknown> {
  return (
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    typeof (body as ApiEnvelope<unknown>).success === "boolean"
  );
}

export function readApiErrorMessage(body: unknown, fallback = "Request failed."): string {
  if (!body || typeof body !== "object") return fallback;
  const record = body as Record<string, unknown>;
  if (record.error && typeof record.error === "object") {
    const msg = (record.error as ApiErrorBody).message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  if (typeof record.message === "string" && record.message.trim()) return record.message;
  return fallback;
}

/** Unwrap `data` from the standard API envelope. Throws on `success: false`. */
export function unwrapApiData<T>(body: unknown): T {
  if (isApiEnvelope(body)) {
    if (!body.success) {
      throw new Error(readApiErrorMessage(body));
    }
    return body.data as T;
  }
  return body as T;
}

export function unwrapApiList<T>(body: unknown): T[] {
  const data = unwrapApiData<unknown>(body);
  return Array.isArray(data) ? (data as T[]) : [];
}

export function getApiMeta(body: unknown): ApiMeta | undefined {
  if (isApiEnvelope(body) && body.success) {
    return body.meta;
  }
  return undefined;
}
