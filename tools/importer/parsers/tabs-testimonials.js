/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonials.
 * Base block: tabs (2 columns: tab image cell + panel body cell, one row per testimonial).
 * Source: https://aem.live/
 * Generated: 2026-09-24
 *
 * Source has two parallel structures: a .tab-list of <button> tab controls (each
 * holding the tab logo image) and a .tabcontent with one .tabpanel per testimonial.
 * They are parallel by index. structure.json: buttons ×3 and panels iterationSafe:true,
 * no invalid nesting. Per the block model, the first image in each row becomes the tab
 * button; the body cell holds the quote, the customer image, the name/title, the CTA,
 * and the stats list. Iteration is keyed on the .tabpanel wrappers (stable block
 * wrappers), pairing each with its button by index. The section heading is default
 * content above the block and is excluded.
 */
export default function parse(element, { document }) {
  const buttons = [...element.querySelectorAll('.tab-list .tablist-container button, .tab-list button')];
  const panels = [...element.querySelectorAll('.tabcontent .tabpanel, .tabpanel')];
  const cells = [];

  panels.forEach((panel, i) => {
    // Tab image: the corresponding tab button's image (falls back to the panel image).
    const button = buttons[i];
    const tabImage = (button && button.querySelector('picture, img'))
      || panel.querySelector('.image-side picture, .image-side img')
      || '';

    const info = panel.querySelector('.testimonial-info') || panel;
    const body = [];

    // Large customer/panel image.
    const panelImage = panel.querySelector('.image-side picture, .image-side img');
    if (panelImage) body.push(panelImage);

    // Pull-quote.
    const quote = info.querySelector('.testimonial-quote, p');
    if (quote) body.push(quote);

    // Attribution: customer photo, name + title paragraphs, CTA (all in .customer-info).
    const customerInfo = info.querySelector('.customer-info');
    if (customerInfo) {
      const custPic = customerInfo.querySelector('picture, img');
      if (custPic) body.push(custPic);
      customerInfo.querySelectorAll('.titles p, p').forEach((p) => body.push(p));
      const cta = customerInfo.querySelector('a.button, a');
      if (cta) body.push(cta);
    }

    // Stats list.
    const stats = info.querySelector('ul');
    if (stats) body.push(stats);

    if (!tabImage && !body.length) return;

    cells.push([tabImage, body]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonials', cells });
  element.replaceWith(block);
}
