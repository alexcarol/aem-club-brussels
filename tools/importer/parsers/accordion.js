/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion variant.
 * Base block: accordion
 * Source selector: .faq-list
 * Generated: 2026-05-06
 *
 * Source structure:
 *   div.faq-list > details.faq-item > summary.faq-question > span (title)
 *   div.faq-list > details.faq-item > div.faq-answer (content)
 *
 * Target structure:
 *   Row per accordion item: [Title cell | Content cell]
 */
export default function parse(element, { document }) {
  // Extract all accordion items from the source
  const items = element.querySelectorAll('details.faq-item, details[class*="faq"], details');

  const cells = [];

  items.forEach((item) => {
    // Extract title from summary element
    const summary = item.querySelector('summary.faq-question, summary');
    const titleSpan = summary ? summary.querySelector('span') : null;
    const titleText = titleSpan
      ? titleSpan.textContent.trim()
      : (summary ? summary.textContent.trim() : '');

    // Extract answer/content from the faq-answer div
    const answerDiv = item.querySelector('div.faq-answer, div[class*="answer"], div[class*="content"]');

    // Build title cell - create a text node for the title
    const titleNode = document.createTextNode(titleText);

    // Build content cell - clone answer content or use text
    let contentCell;
    if (answerDiv) {
      // Get all child elements from the answer div
      const contentElements = Array.from(answerDiv.children);
      if (contentElements.length > 0) {
        contentCell = contentElements;
      } else {
        contentCell = document.createTextNode(answerDiv.textContent.trim());
      }
    } else {
      contentCell = document.createTextNode('');
    }

    // Each row is [title, content] - matching the 2-column structure from library example
    if (Array.isArray(contentCell)) {
      cells.push([titleNode, contentCell]);
    } else {
      cells.push([titleNode, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion', cells });
  element.replaceWith(block);
}
