/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters sections.
 * Inserts <hr> section breaks and Section Metadata blocks based on template sections.
 * All selectors verified from captured DOM in migration-work/cleaned.html and live page.
 *
 * Template sections (7 total, mapped to live DOM):
 *   1. header.section.secondary-section (style: dark) - <header> child of main
 *   2. section.section:nth-of-type(1) (no style) - feature/columns
 *   3. section.section:nth-of-type(2) (style: grey) - gallery/cards (has .secondary-section)
 *   4. section.section:nth-of-type(3) (no style) - testimonials/tabs
 *   5. section.section:nth-of-type(4) (style: grey) - articles/cards (has .secondary-section)
 *   6. section.section:nth-of-type(5) (no style) - FAQ/accordion
 *   7. section.section.inverse-section (style: dark) - CTA banner
 *
 * Note: Template uses "main > section.section.secondary-section:nth-of-type(1)" which does
 * not match on the live page because nth-of-type counts ALL section elements regardless of
 * class. We use a fallback strategy with nth-of-class matching.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Attempts to find a section element using the template selector.
 * Falls back to nth-of-class matching when nth-of-type + class selectors fail.
 */
function findSection(element, document, selector) {
  // Strategy 1: Try the selector as-is on element
  let el = element.querySelector(selector);
  if (el) return el;

  // Strategy 2: If selector starts with "main >", replace with ":scope >"
  if (/^main\s*>/.test(selector)) {
    const scopedSelector = selector.replace(/^main\s*>/, ':scope >');
    try {
      el = element.querySelector(scopedSelector);
    } catch (e) { /* ignore selector parse errors */ }
    if (el) return el;
  }

  // Strategy 3: For selectors with class + nth-of-type that don't match,
  // extract the class filter and nth index, then use querySelectorAll with nth-of-class logic.
  // e.g. "main > section.section.secondary-section:nth-of-type(1)" -> find 1st section.section.secondary-section
  const nthClassMatch = selector.match(/([a-z]+(?:\.[a-z0-9_-]+)+):nth-of-type\((\d+)\)/i);
  if (nthClassMatch) {
    const baseSelector = nthClassMatch[1];
    const nthIndex = parseInt(nthClassMatch[2], 10) - 1; // 0-based
    const candidates = element.querySelectorAll(baseSelector);
    if (candidates.length > nthIndex) return candidates[nthIndex];
  }

  // Strategy 4: Try on document (selector may be absolute)
  try {
    el = document.querySelector(selector);
  } catch (e) { /* ignore */ }
  if (el && element.contains(el)) return el;

  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to preserve DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = findSection(element, document, section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block after the section element if style is defined
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Add <hr> before non-first sections to create section breaks
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
