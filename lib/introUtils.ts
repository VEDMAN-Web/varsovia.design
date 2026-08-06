const INTRO_CLASS = "intro-pending";

export function markIntroPending() {
  document.documentElement.classList.add(INTRO_CLASS);
}

export function clearIntroPending() {
  document.documentElement.classList.remove(INTRO_CLASS);
}

export function isIntroPending() {
  return document.documentElement.classList.contains(INTRO_CLASS);
}
