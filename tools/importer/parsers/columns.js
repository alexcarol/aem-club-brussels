/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns variant.
 * Base block: columns
 * Source selector: main > section.section:nth-of-type(1) > .container > .grid-layout
 * Generated: 2026-05-06
 *
 * Extracts content from a grid-layout container with multiple child divs,
 * placing each child div's content into a column cell of the Columns block.
 */
export default function parse(element, { document }) {
  // Get direct child divs - each represents a column
  const columnDivs = element.querySelectorAll(':scope > div');

  // Build cells array - one row with N columns matching the grid layout
  const cells = [];

  if (columnDivs.length > 0) {
    // Create a single row with each column div's content as a cell
    const row = [];
    columnDivs.forEach((colDiv) => {
      // Collect all child elements from this column
      const cellContent = [];
      const children = colDiv.querySelectorAll(':scope > *');
      children.forEach((child) => {
        cellContent.push(child);
      });

      // If no children found, use the div itself
      if (cellContent.length === 0 && colDiv.textContent.trim()) {
        cellContent.push(colDiv);
      }

      row.push(cellContent);
    });
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
