/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-media. Base: columns. Source: https://arco.coffee/
 * Generated: 2026-09-24
 *
 * Authored contract (blocks/columns-media): a single row with two columns —
 *   - one column containing an image
 *   - one column containing a heading, paragraph, and a primary CTA link
 *
 * Source is EDS-decorated: div.columns.block > div > (div.columns-img-col > picture)
 *   and (div > h2, p, p.button-container>a). Iterate the inner column divs
 *   (repeating unit tag:div, iterationSafe: true, count 2) and place each column's
 *   content into its own cell of the single row.
 */
export default function parse(element, { document }) {
  // The row wrapper is the block's single direct child; its children are the columns.
  const rowWrapper = element.querySelector(':scope > div');
  const columns = rowWrapper
    ? [...rowWrapper.children]
    : [...element.children];

  const rowCells = columns.map((col) => {
    const picture = col.querySelector('picture');
    if (picture && col.querySelectorAll('h1,h2,h3,h4,h5,h6,p:not(:has(picture))').length === 0) {
      // image-only column
      return picture;
    }
    // text column: keep heading, paragraphs, and CTA in order
    const contentEls = [...col.children].filter((child) => !child.querySelector('picture'));
    return contentEls.length ? contentEls : col;
  });

  if (!rowCells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [rowCells];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
