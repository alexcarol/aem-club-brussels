/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero variant.
 * Base block: hero
 * Source selectors: header.section.secondary-section, section.section.inverse-section
 * Generated: 2026-05-06
 *
 * Target structure (from block library):
 *   Row 1: Background image (optional)
 *   Row 2: Title (heading) + Subheading + CTA links
 *
 * Source HTML structure:
 *   - h1.h1-heading or h2.h2-heading (title)
 *   - p.subheading (subtitle/description)
 *   - .button-group containing a.button links (CTAs)
 *   - img.cover-image (background/decorative images)
 */
export default function parse(element, { document }) {
  // Extract background/hero image(s) - use first available image as background
  const heroImage = element.querySelector('img.cover-image, img[class*="cover"], img[class*="hero"], img[class*="background"], img');

  // Extract heading - h1 preferred, fallback to h2, h3, or class-based
  const heading = element.querySelector('h1, h2, h3, .h1-heading, .h2-heading, [class*="heading"]');

  // Extract subheading/description
  const description = element.querySelector('p.subheading, p[class*="subheading"], p[class*="subtitle"], .subheading');

  // Extract CTA links from button group or directly
  const ctaLinks = Array.from(
    element.querySelectorAll('.button-group a, a.button, a[class*="cta"], a[class*="btn"]')
  );

  // Deduplicate CTAs (avoid selecting same link twice with multiple selectors)
  const uniqueCtas = [...new Set(ctaLinks)];

  // Build cells array matching block library structure
  // Each entry in cells is a row; each row is an array of cells;
  // each cell is either a single element or an array of elements.
  const cells = [];

  // Row 1: Background image (optional) - single cell with image
  if (heroImage) {
    cells.push([[heroImage]]);
  }

  // Row 2: Content cell - single cell containing heading + subheading + CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (uniqueCtas.length > 0) {
    contentCell.push(...uniqueCtas);
  }

  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
