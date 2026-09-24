import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the columns-zpattern block
 * A stack of alternating image + text rows ("Z-pattern"). Each row pairs an
 * image on one side with text content (icon eyebrow, heading, tagged/bullet
 * list) on the other; consecutive rows alternate the image side.
 * @param {Element} block The columns-zpattern block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row, i) => {
    row.classList.add('columns-zpattern-row');
    // alternate image alignment row by row
    row.classList.add(i % 2 === 0 ? 'columns-zpattern-row-even' : 'columns-zpattern-row-odd');

    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1 && col.textContent.trim() === '') {
        col.classList.add('columns-zpattern-img');
      } else {
        col.classList.add('columns-zpattern-text');
      }
    });
  });

  // optimize imagery
  block.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });
}
