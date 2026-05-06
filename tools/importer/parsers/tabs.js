/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs variant.
 * Base block: tabs
 * Source selector: .tabs-wrapper
 * Generated: 2026-05-06
 *
 * Source structure:
 * - .tabs-content > .tab-pane (content panels with grid layout: image + name/role/quote)
 * - .tab-menu > button.tab-menu-link (tab labels with avatar + name/role)
 *
 * Target structure (from block library):
 * - 2-column table: Tab Label | Tab Content
 * - One row per tab
 */
export default function parse(element, { document }) {
  // Extract tab labels from the tab menu buttons
  const tabButtons = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button'));

  // Extract tab content panels
  const tabPanes = Array.from(element.querySelectorAll('.tabs-content .tab-pane, .tab-pane'));

  const cells = [];

  // Iterate through tab panes and pair with labels
  const count = Math.max(tabPanes.length, tabButtons.length);

  for (let i = 0; i < count; i++) {
    // Get tab label text from the button
    let tabLabel = '';
    if (tabButtons[i]) {
      // Extract the name (strong text) from the button as the tab label
      const strongEl = tabButtons[i].querySelector('strong');
      if (strongEl) {
        tabLabel = strongEl.textContent.trim();
      } else {
        tabLabel = tabButtons[i].textContent.trim();
      }
    }

    // Get tab content from the corresponding pane
    const contentCell = [];
    if (tabPanes[i]) {
      // Extract the image
      const img = tabPanes[i].querySelector('img');
      if (img) {
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt || '';
        contentCell.push(newImg);
      }

      // Extract the name (strong text in paragraph-xl)
      const nameEl = tabPanes[i].querySelector('.paragraph-xl strong, div strong');
      if (nameEl) {
        const nameP = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = nameEl.textContent.trim();
        nameP.appendChild(strong);
        contentCell.push(nameP);
      }

      // Extract the role/subtitle (sibling div after the name div)
      const nameDiv = tabPanes[i].querySelector('.paragraph-xl.utility-margin-bottom-0');
      if (nameDiv && nameDiv.nextElementSibling) {
        const roleText = nameDiv.nextElementSibling.textContent.trim();
        if (roleText) {
          const roleP = document.createElement('p');
          roleP.textContent = roleText;
          contentCell.push(roleP);
        }
      }

      // Extract the quote/testimonial text
      const quoteEl = tabPanes[i].querySelector('p.paragraph-xl, p');
      if (quoteEl) {
        const quoteP = document.createElement('p');
        quoteP.textContent = quoteEl.textContent.trim();
        contentCell.push(quoteP);
      }
    }

    cells.push([tabLabel || `Tab ${i + 1}`, contentCell.length > 0 ? contentCell : '']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs', cells });
  element.replaceWith(block);
}
