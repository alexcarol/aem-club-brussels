/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-logos.
 * Base block: columns (logo grid). Source: https://aem.live/
 * Generated: 2026-09-24
 *
 * The instance selector (.section.logo-wall-container:nth-of-type(4)) matches the
 * whole section, which also contains the hero and doc-search blocks. Extraction is
 * therefore scoped strictly to the logo wall's list items so hero/search imagery is
 * not captured. Each logo is a linked <picture> in an <li.logo-wall-list-item>.
 * structure.json: li.logo-wall-list-item ×12, iterationSafe:true, no invalid nesting;
 * the anchors carry distinct hrefs so the html2md inline-merge pass keeps them
 * separate. Logos are laid out 4 per row (grid flattens them anyway); the final row
 * is padded with empty cells to keep the column count uniform. The logo-wall title
 * is section default content and is excluded.
 */
export default function parse(element, { document }) {
  const COLS = 4;
  const items = [...element.querySelectorAll('.logo-wall-list-item')];

  // Each logo cell: the linked picture (kept inside its link) or the bare image.
  const logos = items.map((li) => {
    const link = li.querySelector('a.logo-wall-item-link, a');
    const media = li.querySelector('picture, img');
    if (link) return link;
    return media || '';
  }).filter(Boolean);

  if (!logos.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  for (let i = 0; i < logos.length; i += COLS) {
    const row = logos.slice(i, i + COLS);
    while (row.length < COLS) row.push(''); // pad last row for uniform column count
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-logos', cells });
  element.replaceWith(block);
}
