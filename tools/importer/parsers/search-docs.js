/* eslint-disable */
/* global WebImporter */
/**
 * Parser for search-docs.
 * Base block: search (1 column). Source: https://aem.live/
 * Generated: 2026-09-24
 *
 * The block renders its own input/results UI and needs no authored content —
 * it defaults to the site's query-index.json. The only authored input the block
 * accepts is an optional link to a custom query index. In the source, the
 * search UI (form, input, results <ul>) is runtime-rendered, not authored: the
 * lone <a href="/docs/"> lives inside the "no results" message, so it is NOT an
 * authored index link. structure.json: no repeating units. Emit an empty block
 * (name only) unless a genuine authored index link is present.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Only treat a link as authored config if it points at a query-index JSON and
  // is NOT part of the runtime results list.
  const indexLink = [...element.querySelectorAll('a[href*="query-index"], a[href$=".json"]')]
    .find((a) => !a.closest('.doc-search-results, ul'));
  if (indexLink) cells.push([indexLink]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'search-docs', cells });
  element.replaceWith(block);
}
