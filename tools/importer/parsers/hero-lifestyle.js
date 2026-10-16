/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-lifestyle. Base: hero. Source: https://arco.coffee/
 * Generated: 2026-09-24
 *
 * Authored contract (blocks/hero-lifestyle):
 *   row 1: background image (picture)   [optional]
 *   row 2: heading, descriptive paragraph, one or more CTA links
 * Single-column block: all content in one cell per row.
 *
 * Source is EDS-decorated: div > div containing
 *   <p><picture>…</picture></p>, <h1>, <p>description</p>,
 *   <p><strong><a>primary</a></strong><em><a>secondary</a></em></p>
 * The strong/em wrappers carry the EDS button semantics (primary/secondary)
 * and are preserved.
 */
export default function parse(element, { document }) {
  // Background image: the first picture anywhere in the block.
  const picture = element.querySelector('picture');

  // Heading.
  const heading = element.querySelector('h1, h2, h3, [class*="title"]');

  // Content paragraphs = every <p> that is not just an image wrapper.
  const paragraphs = [...element.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture'));

  // Empty-block guard.
  if (!heading && !paragraphs.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Optional image row (single cell).
  if (picture) cells.push([picture]);

  // Content row (single cell holding heading + paragraphs/CTAs).
  const contentCell = [];
  if (heading) contentCell.push(heading);
  contentCell.push(...paragraphs);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-lifestyle', cells });
  element.replaceWith(block);
}
