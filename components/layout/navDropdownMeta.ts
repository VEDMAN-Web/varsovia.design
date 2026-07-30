/** Subtitle copy for nav dropdown links — keyed by href path */
export function getNavDropdownSubtitle(
  href: string,
  t: (key: string) => string,
): string | undefined {
  try {
    return t(href);
  } catch {
    return undefined;
  }
}
