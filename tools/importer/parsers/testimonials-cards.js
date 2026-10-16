/* eslint-disable */
/* global WebImporter */
/**
 * Parser for testimonials-cards. Base: testimonials. Source: https://arco.coffee/
 * Generated: 2026-09-24
 *
 * Authored contract (blocks/testimonials-cards): one row per testimonial, each with
 *   - cell 1: customer photo (picture)   [optional]
 *   - cell 2: rating (text such as "★★★★★"), the quotation, and the customer name
 *
 * Source is EDS-decorated: div.testimonials.block > ul.testimonials-list >
 *   li.testimonials-card, each holding div.testimonials-photo (picture),
 *   div.testimonials-stars (span.testimonials-star…), blockquote.testimonials-quote,
 *   p.testimonials-name. Iterate the li repeating unit (iterationSafe: true, count 3).
 */
export default function parse(element, { document }) {
  const items = [...element.querySelectorAll(':scope > ul > li')];
  const rows = items.length ? items : [...element.querySelectorAll(':scope > div')];

  const cells = [];
  rows.forEach((item) => {
    const picture = item.querySelector('picture');
    const imageCell = picture || '';

    const bodyEls = [];

    // Rating: collapse the star spans into a single text paragraph.
    // Use the container's children when present to avoid double-selecting a
    // span that matches multiple star-related classes.
    const starContainer = item.querySelector('.testimonials-stars, [class*="stars"]');
    const stars = starContainer
      ? [...starContainer.children]
      : [...item.querySelectorAll('[class*="star"]')];
    if (stars.length) {
      const ratingP = document.createElement('p');
      ratingP.textContent = stars.map((s) => s.textContent.trim()).join('');
      bodyEls.push(ratingP);
    }

    // Quotation.
    const quote = item.querySelector('blockquote, .testimonials-quote');
    if (quote) bodyEls.push(quote);

    // Customer name.
    const name = item.querySelector('.testimonials-name');
    if (name) bodyEls.push(name);

    cells.push([imageCell, bodyEls]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'testimonials-cards', cells });
  element.replaceWith(block);
}
