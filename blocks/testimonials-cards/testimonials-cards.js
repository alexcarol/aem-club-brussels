import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the testimonials-cards block
 *
 * Expected initial structure (from authoring): one row per testimonial, each with
 *   - a cell containing the customer photo
 *   - a cell containing the rating (text such as "★★★★★" or "5 stars"),
 *     the quotation, and the customer name
 *
 * Authors may omit the photo; the card degrades gracefully.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'testimonials-cards-card';
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'testimonials-cards-avatar';
      } else {
        div.className = 'testimonials-cards-body';
      }
    });

    ul.append(li);
  });

  // optimize avatar images to a small square
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
