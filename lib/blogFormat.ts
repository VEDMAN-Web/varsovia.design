/** Display date + optional relative hint for blog detail meta row */
export function formatBlogDetailMeta(dateStr: string): string {
  const parsed = Date.parse(dateStr);
  if (Number.isNaN(parsed)) return dateStr;

  let formatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(parsed));
  formatted = formatted.replace(/^(\d+\s+\w+)\s(\d{4})$/, "$1, $2");

  const diffMs = Date.now() - parsed;
  if (diffMs > 0 && diffMs < 48 * 60 * 60 * 1000) {
    const hours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));
    return `${formatted} • ${hours}h ago`;
  }

  return formatted;
}
