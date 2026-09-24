import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the hero-gradient block
 * A full-bleed banner on a colorful gradient background: optional eyebrow,
 * a large centered headline, an optional subheading, a CTA, and optional
 * decorative imagery. Used for the top-of-page hero and the closing CTA banner.
 * @param {Element} block The hero-gradient block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Separate decorative imagery from text content. A row whose only content is
  // a picture is treated as the decorative background/foreground artwork.
  rows.forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    const pic = cell.querySelector('picture');
    const textEls = [...cell.children].filter((el) => el.querySelector('picture') === null
      && el.tagName !== 'PICTURE');
    if (pic && textEls.length === 0 && cell.children.length <= 1) {
      row.className = 'hero-gradient-image';
    } else {
      row.className = 'hero-gradient-content';
    }
  });

  // Optimize any decorative images.
  block.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });

  // Tag an eyebrow: a short paragraph that appears before the first heading.
  const content = block.querySelector('.hero-gradient-content');
  if (content) {
    const first = content.firstElementChild?.firstElementChild || content.firstElementChild;
    if (first && first.tagName === 'P') first.classList.add('hero-gradient-eyebrow');
  }
}
