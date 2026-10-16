import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the hero-lifestyle block
 *
 * Expected initial structure (from authoring):
 *   row 1: background image (picture)
 *   row 2: heading, descriptive paragraph, and one or more CTA links
 *
 * Authors may omit the image (text-only hero) or provide fewer/more CTAs;
 * the block degrades gracefully.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  // First row that contains a picture is treated as the background image.
  const imageRow = rows.find((row) => row.querySelector('picture'));
  const contentRows = rows.filter((row) => row !== imageRow);

  // Background image handling
  if (imageRow) {
    const img = imageRow.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(
        img.src,
        img.alt,
        true,
        [{ width: '2000' }],
      );
      imageRow.replaceChildren(optimized);
    }
    imageRow.className = 'hero-lifestyle-image';
  } else {
    block.classList.add('no-image');
  }

  // Content wrapper for heading/paragraph/CTAs
  const content = document.createElement('div');
  content.className = 'hero-lifestyle-content';
  contentRows.forEach((row) => {
    // unwrap the single cell so headings/paragraphs sit directly in the content box
    const cell = row.firstElementChild || row;
    [...cell.childNodes].forEach((node) => content.append(node));
    row.remove();
  });

  // Mark CTA groups: first button-container is primary, subsequent are secondary
  const ctaGroups = content.querySelectorAll('.button-container');
  ctaGroups.forEach((group, index) => {
    const link = group.querySelector('a');
    if (!link) return;
    if (index === 0) {
      link.classList.add('button', 'primary');
    } else {
      link.classList.add('button', 'secondary');
    }
  });

  block.append(content);
}
