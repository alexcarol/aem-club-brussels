/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-gradient.
 * Base block: hero (1 column). Source: https://aem.live/
 * Generated: 2026-09-24
 *
 * Instances (.hero.colorful-bg and .roi-calculator.colorful-bg) are each a single
 * hero — the parser runs per matched element. structure.json: repeatingUnit tag:div
 * is the two top-level instances, not an in-block repeat, iterationSafe:true, no
 * invalid nesting. This is a 1-column block: content goes in one cell, optional
 * decorative background image in its own row.
 */
export default function parse(element, { document }) {
  // Content lives in .inner-content (may be nested in .upper-content / .contained-wrapper).
  const content = element.querySelector('.inner-content') || element;

  const eyebrow = content.querySelector('h3, h4, h5, h6, .eyebrow');
  const heading = content.querySelector('h1, h2');
  const subheading = content.querySelector('p');
  const ctas = [...content.querySelectorAll('a.button, a[class*="button"], a')];

  // Decorative background artwork: the layered image in .image-wrapper, else the
  // leading full-bleed decorative <img> that is a direct child of the block.
  const bgPicture = element.querySelector('.image-wrapper picture, .image-wrapper img');
  const leadImg = element.querySelector(':scope > img');
  const bgImage = bgPicture || leadImg || '';

  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow);
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctas);

  // Empty-block guard.
  if (!heading && !eyebrow && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([contentCell]); // 1-column content row (one cell holding all elements)
  if (bgImage) cells.push([bgImage]); // optional decorative background row

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-gradient', cells });
  element.replaceWith(block);
}
