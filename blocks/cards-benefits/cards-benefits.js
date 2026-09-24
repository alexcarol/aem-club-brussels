import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the cards-benefits block
 * A centered grid of benefit items, each with a colored icon, a heading, and a
 * short description.
 * @param {Element} block The cards-benefits block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-benefits-icon';
      } else {
        div.className = 'cards-benefits-body';
      }
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '150' }]),
    );
  });

  block.replaceChildren(ul);
}
