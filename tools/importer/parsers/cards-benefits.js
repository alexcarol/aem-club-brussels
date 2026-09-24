/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-benefits.
 * Base block: cards (2 columns: icon cell + body cell, one row per benefit).
 * Source: https://aem.live/
 * Generated: 2026-09-24
 *
 * The source is a "columns four" grid: two wrapper divs each holding several
 * benefit items. Each benefit item is a leaf div containing an <h3> and a
 * description <p> (the first item also has empty <p> placeholders where the CSS
 * colored icon renders — there are no <img> icons in the source, images:0).
 * structure.json: leaf item divs are iterationSafe:true with no invalid nesting
 * and no interactive elements. Iterate every benefit by its <h3>, so the deeper
 * first item (wrapped in .columns-content-wrapper) is handled identically to the
 * flat ones. Icon cell is emitted empty ('') to keep the 2-column model.
 */
export default function parse(element, { document }) {
  const headings = [...element.querySelectorAll('h3, h2, h4')];
  const cells = [];

  headings.forEach((heading) => {
    const container = heading.parentElement;
    // Icon: an image if present (none in this source), else empty cell.
    const icon = container.querySelector('img, picture') || '';

    const body = [heading];
    // Description paragraphs in the same container, skipping empty icon-placeholder <p>.
    const paras = [...container.querySelectorAll(':scope > p')]
      .filter((p) => p.textContent.trim() || p.querySelector('img, picture, a'));
    body.push(...paras);

    cells.push([icon, body]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-benefits', cells });
  element.replaceWith(block);
}
