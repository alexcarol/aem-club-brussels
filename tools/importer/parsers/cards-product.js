/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-product. Base: cards. Source: https://arco.coffee/
 * Generated: 2026-09-24
 *
 * Authored contract (blocks/cards-product): one row per product, each with
 *   - cell 1: product image (picture)
 *   - cell 2: product name (heading), description, price/CTA link
 *
 * Source is EDS-decorated: div.cards.block > ul > li, each li holding
 *   div.cards-card-image (picture) and div.cards-card-body (h3, p, p.button-container>a).
 * Iterate the <li> repeating unit (iterationSafe: true, count 5).
 */
export default function parse(element, { document }) {
  const items = [...element.querySelectorAll(':scope > ul > li')];

  // Fallback if the ul wrapper is absent.
  const rows = items.length ? items : [...element.querySelectorAll(':scope > div')];

  const cells = [];
  rows.forEach((item) => {
    const picture = item.querySelector('picture');
    const imageCell = picture || '';

    // Body: everything that is not the image wrapper.
    const bodyEls = [];
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) bodyEls.push(heading);
    // description paragraphs (exclude image wrapper and the CTA paragraph handled below,
    // but keep them all here — the CTA link lives in its own <p> and is included in order).
    item.querySelectorAll('p').forEach((p) => {
      if (p.querySelector('picture')) return;
      bodyEls.push(p);
    });

    cells.push([imageCell, bodyEls]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
