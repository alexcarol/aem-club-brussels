import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the columns-logos block
 * A grid of partner/customer logos. Each logo may be a plain image or a linked
 * image. Any leading text row is treated as a centered heading.
 * @param {Element} block The columns-logos block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    // A row with cells that each contain a logo becomes one or more logo items.
    [...row.children].forEach((cell) => {
      const pic = cell.querySelector('picture, img');
      if (!pic) return;
      const li = document.createElement('li');
      li.className = 'columns-logos-item';
      while (cell.firstChild) li.append(cell.firstChild);
      ul.append(li);
    });
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]),
    );
  });

  block.replaceChildren(ul);
}
