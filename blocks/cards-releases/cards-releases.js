import { createOptimizedPicture } from '../../scripts/aem.js';

const YT_ID_RE = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;

function extractYouTubeId(url) {
  const match = (url || '').match(YT_ID_RE);
  return match ? match[1] : null;
}

/**
 * Build a responsive YouTube embed for a given anchor.
 * @param {HTMLAnchorElement} anchor A link pointing at a YouTube URL
 * @returns {HTMLElement|null} embed wrapper or null when not a YouTube link
 */
function buildVideoEmbed(anchor) {
  const id = extractYouTubeId(anchor.href);
  if (!id) return null;
  const embed = document.createElement('div');
  embed.className = 'cards-releases-video';
  const frame = document.createElement('iframe');
  frame.src = `https://www.youtube.com/embed/${id}`;
  frame.setAttribute('loading', 'lazy');
  frame.setAttribute('allowfullscreen', '');
  frame.setAttribute(
    'allow',
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
  );
  frame.title = anchor.textContent.trim() || 'Music video';
  embed.append(frame);
  return embed;
}

/**
 * loads and decorates the releases cards block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((cell) => {
      if (cell.children.length === 1 && cell.querySelector('picture, img')) {
        cell.className = 'cards-releases-image';
      } else {
        cell.className = 'cards-releases-body';
      }
    });

    const body = li.querySelector('.cards-releases-body');
    if (body) {
      // Streaming platform links become a grouped action row of buttons.
      const actionAnchors = [...body.querySelectorAll('a')].filter(
        (a) => !extractYouTubeId(a.href) || a.closest('h1, h2, h3, h4, h5, h6'),
      );
      // A YouTube link on its own line (not the title link) becomes an embedded video.
      [...body.querySelectorAll('p > a, li > a')].forEach((a) => {
        if (a.closest('h1, h2, h3, h4, h5, h6')) return;
        const embed = extractYouTubeId(a.href) ? buildVideoEmbed(a) : null;
        if (embed) {
          const container = a.closest('p') || a;
          container.replaceWith(embed);
        }
      });

      const links = [...body.querySelectorAll('a')].filter(
        (a) => actionAnchors.includes(a) && !a.closest('.cards-releases-video'),
      );
      if (links.length) {
        const actions = document.createElement('div');
        actions.className = 'cards-releases-actions';
        links.forEach((a) => {
          a.classList.add('button');
          const wrapper = a.closest('p');
          actions.append(a);
          if (wrapper && !wrapper.textContent.trim() && !wrapper.querySelector('a, img')) {
            wrapper.remove();
          }
        });
        body.append(actions);
      }
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  block.replaceChildren(ul);
}
