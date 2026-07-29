const INTRO_CLASS = "intro-pending";

export function clearIntroPending() {
  document.documentElement.classList.remove(INTRO_CLASS);
}
