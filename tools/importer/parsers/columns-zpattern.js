/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-zpattern.
 * Base block: columns (2 columns). Source: https://aem.live/
 * Generated: 2026-09-24
 *
 * One row per value prop. Each row (.z-row-even / .z-row-odd) has an image-side
 * and a content-side (icon eyebrow, heading, bullet list). Iterate the row
 * wrappers directly — structure.json flags them iterationSafe:true with no
 * invalid nesting, and there are no interactive (a/button) elements involved.
 * The consensus unit is .z-row-even (×2) but the block also has .z-row-odd rows,
 * so iterate both. The .z-pattern-heading is section default content, not part
 * of the block, so it is excluded.
 */
export default function parse(element, { document }) {
  const rows = [...element.querySelectorAll(':scope > .z-row-even, :scope > .z-row-odd')];
  const cells = [];

  rows.forEach((row) => {
    const imageSide = row.querySelector('.image-side');
    const image = imageSide
      ? (imageSide.querySelector('picture, img') || imageSide)
      : (row.querySelector('picture, img') || '');

    const contentSide = row.querySelector('.content-side') || row;
    const content = [];
    const eyebrow = contentSide.querySelector('.icon-eyebrow, p.icon-eyebrow, p');
    if (eyebrow) content.push(eyebrow);
    const heading = contentSide.querySelector('h1, h2, h3, h4, h5, h6, .main-headline');
    if (heading) content.push(heading);
    const list = contentSide.querySelector('ul, ol');
    if (list) content.push(list);

    // Skip a fully empty row.
    if (!image && !content.length) return;

    cells.push([image, content]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-zpattern', cells });
  element.replaceWith(block);
}
