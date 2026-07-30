/** Deep-merge locale extra JSON over base messages (one level of nesting). */
export function mergeLocaleMessages<T extends Record<string, unknown>>(
  base: T,
  extra: Partial<T> | Record<string, unknown>,
): T {
  const out = { ...base } as Record<string, unknown>;

  for (const key of Object.keys(extra)) {
    const baseVal = base[key];
    const extraVal = extra[key as keyof typeof extra];

    if (
      extraVal &&
      typeof extraVal === "object" &&
      !Array.isArray(extraVal) &&
      baseVal &&
      typeof baseVal === "object" &&
      !Array.isArray(baseVal)
    ) {
      out[key] = { ...(baseVal as object), ...(extraVal as object) };
    } else if (extraVal !== undefined) {
      out[key] = extraVal;
    }
  }

  return out as T;
}
