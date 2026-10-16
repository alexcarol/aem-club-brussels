import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the cards-product block
 *
 * Expected initial structure (from authoring): one row per product, each with
 *   - a cell containing the product image
 *   - a cell containing the product name (heading), description, and a price/CTA link
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-product-card-image';
      } else {
        div.className = 'cards-product-card-body';
        // style the price/CTA link as a filled pill button
        const link = div.querySelector('a');
        if (link) link.classList.add('button', 'primary', 'cards-product-price');
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
