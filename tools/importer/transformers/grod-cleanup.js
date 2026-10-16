/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: grod (grod.rocks) site-wide cleanup.
 * Removes non-authorable site chrome. All selectors verified against
 * migration-work/cleaned.html.
 *
 * Non-authorable elements found in captured DOM (siblings of / inside <main>):
 *   <a class="skip-link">Skip to main content</a>   -> skip link
 *   <nav class="site-nav"> ... </nav>                -> global site navigation
 *   <footer class="site-footer"> ... </footer>       -> global site footer
 *   <link href="/_astro/BaseLayout...css">           -> stray stylesheet link
 *   <fragment></fragment>                            -> empty build artifact
 *
 * NOTE: <header class="page-header"> lives INSIDE <main> and IS authorable
 * page-header content, so bare `header`/`nav`/`footer` selectors are avoided;
 * only the site-chrome-specific classes are targeted.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (specific selectors from captured DOM).
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'nav.site-nav',
      'footer.site-footer',
      'link',
      'fragment',
      'noscript',
    ]);
  }
}
