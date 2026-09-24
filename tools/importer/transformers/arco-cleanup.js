/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: arco.coffee site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Onboarding "coach" overlay widgets (scrim, dot, tooltip) — non-authorable page chrome.
    // Verified in cleaned.html: .coach-scrim (l445), .coach-dot (l447,469), .coach-tooltip (l449,471)
    WebImporter.DOMUtils.remove(element, [
      '.coach-scrim',
      '.coach-dot',
      '.coach-tooltip',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Global site chrome — header/nav and footer. Non-authorable.
    // Verified in cleaned.html: header.header-wrapper (l2), footer.footer-wrapper (l437)
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
    ]);
  }
}
