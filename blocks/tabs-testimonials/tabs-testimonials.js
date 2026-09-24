import { createOptimizedPicture, toClassName } from '../../scripts/aem.js';

/**
 * loads and decorates the tabs-testimonials block
 * An image-tabbed testimonials switcher: a row of image tab buttons (customer
 * logos/avatars) switches between testimonial panels. Each source row is one
 * testimonial panel — its first image becomes that panel's tab button.
 * @param {Element} block The tabs-testimonials block element
 */
export default function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonials-list';
  tablist.setAttribute('role', 'tablist');

  const panels = [...block.children];

  panels.forEach((panel, i) => {
    const firstImg = panel.querySelector('picture, img');
    const id = toClassName(
      (panel.querySelector('h1,h2,h3,h4,h5,h6')?.textContent
        || firstImg?.querySelector?.('img')?.alt
        || `testimonial-${i + 1}`),
    );

    // decorate the panel
    panel.className = 'tabs-testimonials-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('aria-hidden', !!i);
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.setAttribute('role', 'tabpanel');

    // build the image-based tab button from the panel's first image
    const button = document.createElement('button');
    button.className = 'tabs-testimonials-tab';
    button.id = `tab-${id}`;
    button.setAttribute('type', 'button');
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    if (firstImg) {
      const clone = firstImg.cloneNode(true);
      button.append(clone);
    } else {
      button.textContent = `Testimonial ${i + 1}`;
    }

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((p) => p.setAttribute('aria-hidden', true));
      tablist.querySelectorAll('button').forEach((btn) => btn.setAttribute('aria-selected', false));
      panel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    tablist.append(button);
  });

  block.prepend(tablist);

  // optimize imagery in tab buttons and panels
  block.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });
}
