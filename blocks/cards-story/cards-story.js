import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the cards-story block
 *
 * Expected initial structure (from authoring): one row per story, each with
 *   - a cell containing the story image
 *   - a cell containing the article title (heading), short description, and a 'Read More' link
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
        div.className = 'cards-story-card-image';
      } else {
        div.className = 'cards-story-card-body';
        // 'Read More' stays a text link
        const link = div.querySelector('a');
        if (link) link.classList.add('cards-story-link');
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
