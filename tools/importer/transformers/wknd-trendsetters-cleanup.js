/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters cleanup.
 * Removes non-authorable site shell content (nav, footer, breadcrumbs, skip link).
 * All selectors verified from captured DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove skip-link (site shell accessibility element)
    // Found in captured HTML: <a href="#main-content" class="skip-link">Skip to main content</a>
    WebImporter.DOMUtils.remove(element, ['a.skip-link']);
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site shell elements
    // Found in captured HTML: <div class="navbar">...</div>
    // Found in captured HTML: <footer class="footer inverse-footer">...</footer>
    // Found in captured HTML: <div class="breadcrumbs">...</div>
    WebImporter.DOMUtils.remove(element, ['.navbar', 'footer.footer', '.breadcrumbs', 'link', 'noscript']);
  }
}
