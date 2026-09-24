import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the cards-steps block
 * A sequence of numbered "how it works" steps. Each step shows an auto-generated
 * step number (01, 02, 03…), a heading, a description, and a supporting image.
 * @param {Element} block The cards-steps block element
 */
export default function decorate(block) {
  const ol = document.createElement('ol');

  [...block.children].forEach((row, i) => {
    const li = document.createElement('li');

    // auto-generated step number
    const number = document.createElement('span');
    number.className = 'cards-steps-number';
    number.textContent = String(i + 1).padStart(2, '0');
    li.append(number);

    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (div === number) return;
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-steps-image';
      } else if (div.classList.length === 0) {
        div.className = 'cards-steps-body';
      }
    });

    ol.append(li);
  });

  ol.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });

  block.replaceChildren(ol);
}
