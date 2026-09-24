/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: aem.live site-wide cleanup.
 * Removes non-authorable site chrome so the import contains only page-level
 * authorable content. All selectors verified against migration-work/cleaned.html.
 *
 * Verified selectors (line references in cleaned.html):
 *   header.header-wrapper       (line 2)   - global site header
 *   nav.gnav                    (line 11)  - global navigation (inside header)
 *   aside#gnav-search-bar       (line 132) - global nav search flyout (inside header)
 *   footer.footer-wrapper       (line 840) - global site footer
 *   aside                       (line 837) - empty leftover aside inside main
 *
 * No cookie banners, consent dialogs, modals, scripts, iframes, links or
 * noscript tags are present in the captured DOM, so beforeTransform has no
 * parse-blocking elements to strip on this site.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (header, nav, footer, leftover asides).
    WebImporter.DOMUtils.remove(element, [
      'header.header-wrapper',
      'nav.gnav',
      'aside#gnav-search-bar',
      'footer.footer-wrapper',
      'aside',
    ]);
  }
}
