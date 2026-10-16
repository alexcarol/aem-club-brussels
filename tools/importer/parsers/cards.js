/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards variant.
 * Base block: cards
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-05-06
 *
 * Source structure: .grid-layout container with multiple a.article-card children,
 * each containing an image (.article-card-image img) and body content
 * (.article-card-body with .tag, date, and h3.h4-heading).
 *
 * Target structure (from block library): 2-column table where each row is one card.
 * Column 1: image, Column 2: text content (heading, description, optional CTA).
 */
export default function parse(element, { document }) {
  // The element is the .grid-layout container.
  // Extract all card items - article cards or card links
  const cards = element.querySelectorAll('a.article-card, a.card-link');

  // Fallback: if no cards matched with those classes, try generic link children
  const cardList = cards.length > 0 ? cards : element.querySelectorAll(':scope > a');

  const cells = [];

  cardList.forEach((card) => {
    // Column 1: Image
    const image = card.querySelector('.article-card-image img, img.cover-image, img');

    // Column 2: Text content (heading + metadata + link as CTA)
    const heading = card.querySelector('h3, h4, .h4-heading, [class*="heading"]');
    const tag = card.querySelector('.tag');
    const date = card.querySelector('.paragraph-sm, .utility-text-secondary');

    // Build text content cell
    const textContent = [];

    if (heading) {
      textContent.push(heading);
    }

    // Add tag/category and date as description paragraph
    if (tag || date) {
      const desc = document.createElement('p');
      const parts = [];
      if (tag) parts.push(tag.textContent.trim());
      if (date) parts.push(date.textContent.trim());
      desc.textContent = parts.join(' | ');
      textContent.push(desc);
    }

    // Add the card link as a CTA if it has an href
    const href = card.tagName === 'A' ? card.getAttribute('href') : null;
    if (href) {
      const cta = document.createElement('a');
      cta.setAttribute('href', href);
      cta.textContent = heading ? heading.textContent.trim() : 'Read more';
      textContent.push(cta);
    }

    // Build the row: [image cell, text cell]
    const imageCell = image || '';
    cells.push([imageCell, textContent]);
  });

  // Only create block if we found cards
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
    element.replaceWith(block);
  }
}
