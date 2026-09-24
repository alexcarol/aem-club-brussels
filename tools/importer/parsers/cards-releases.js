/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-releases.
 * Base block: cards (2 columns: image cell + text/body cell, one row per card).
 * Source: https://grod.rocks/music/
 * Generated: 2026-09-24
 *
 * Iteration key: `.release-item` (structure.json: repeatingUnit count 4, iterationSafe: true,
 * no invalid nesting). The streaming `a.btn` links carry distinct hrefs so the html2md
 * inline-merge pass leaves them separate, and they are not the iteration key.
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll(':scope > .release-item, .release-item');
  const cells = [];

  items.forEach((item) => {
    // --- Image cell: the cover image (kept inside its link when present) ---
    const cover = item.querySelector('img.release-cover, img');
    const imageContent = cover ? (cover.closest('a') || cover) : '';

    // --- Body cell: format, title, tracks, optional video, listen label, links ---
    const meta = item.querySelector('.release-meta') || item;
    const body = [];

    // Release year lives on the item itself (sibling of .release-meta), not inside meta.
    const year = item.querySelector(':scope > .release-year, .release-year');
    if (year) body.push(year);

    const format = meta.querySelector('.release-format, .eyebrow');
    if (format) body.push(format);

    const title = meta.querySelector('.release-title, h1, h2, h3, h4, h5, h6');
    if (title) body.push(title);

    const tracks = meta.querySelector('.release-tracks, ol');
    if (tracks) body.push(tracks);

    // Music video: the source embeds an <iframe>; iframes do not survive html2md.
    // Preserve the YouTube URL as a link so the block can rebuild the embed.
    const video = meta.querySelector('.release-video');
    if (video) {
      const videoLabel = video.querySelector('.release-links-label');
      if (videoLabel) body.push(videoLabel);
      const frame = video.querySelector('iframe[src]');
      if (frame) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = frame.src;
        a.textContent = frame.title || 'Music video';
        p.append(a);
        body.push(p);
      }
    }

    // "Listen On" label — the direct-child label (not the one inside .release-video).
    const listenLabel = [...meta.querySelectorAll(':scope > .release-links-label')][0]
      || (video ? null : meta.querySelector('.release-links-label'));
    if (listenLabel) body.push(listenLabel);

    // Streaming platform links (distinct hrefs -> safe from inline-merge collapse).
    const actions = meta.querySelector('.release-actions');
    if (actions) {
      [...actions.querySelectorAll('a')].forEach((a) => body.push(a));
    }

    // Empty-block guard for a malformed item.
    if (!imageContent && !body.length) return;

    cells.push([imageContent, body]);
  });

  // If nothing was extracted, unwrap rather than emit an empty block.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-releases', cells });
  element.replaceWith(block);
}
