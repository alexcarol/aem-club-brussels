/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-steps.
 * Base block: cards (2 columns: body cell + image cell, one row per step).
 * Source: https://aem.live/
 * Generated: 2026-09-24
 *
 * A "columns" grid of numbered how-it-works steps. Each step is a leaf div holding
 * a title <h3> and a description <p> (plus a supporting image). structure.json: leaf
 * item divs iterationSafe:true, no invalid nesting, no interactive elements. Iterate
 * each step by its title heading. Per the block model the body cell (heading +
 * description) comes first and the image cell second; the step number (01/02/03) is
 * generated automatically by the block — on the decorated/live DOM it appears as a
 * separate numeric <h4>/heading, so numeric-only headings are filtered out and never
 * imported. The section eyebrow/heading is default content above the block, excluded.
 */
export default function parse(element, { document }) {
  const headings = [...element.querySelectorAll('h2, h3, h4, h5, h6')]
    // Drop auto-generated step-number headings (e.g. "01", "02").
    .filter((h) => !/^\s*\d+\s*$/.test(h.textContent));
  const cells = [];

  headings.forEach((heading) => {
    const container = heading.parentElement;

    const body = [heading];
    const paras = [...container.querySelectorAll(':scope > p')]
      .filter((p) => p.textContent.trim() || p.querySelector('a'));
    body.push(...paras);

    // Supporting image cell (empty when the source has no per-step image).
    const image = container.querySelector('picture, img') || '';

    cells.push([body, image]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-steps', cells });
  element.replaceWith(block);
}
