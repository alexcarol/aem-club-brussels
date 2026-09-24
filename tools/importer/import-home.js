/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroGradientParser from './parsers/hero-gradient.js';
import searchDocsParser from './parsers/search-docs.js';
import columnsZpatternParser from './parsers/columns-zpattern.js';
import cardsBenefitsParser from './parsers/cards-benefits.js';
import columnsLogosParser from './parsers/columns-logos.js';
import tabsTestimonialsParser from './parsers/tabs-testimonials.js';
import cardsStepsParser from './parsers/cards-steps.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/aemlive-cleanup.js';
import sectionsTransformer from './transformers/aemlive-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-gradient': heroGradientParser,
  'search-docs': searchDocsParser,
  'columns-zpattern': columnsZpatternParser,
  'cards-benefits': cardsBenefitsParser,
  'columns-logos': columnsLogosParser,
  'tabs-testimonials': tabsTestimonialsParser,
  'cards-steps': cardsStepsParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json (template "home")
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'aem.live homepage',
  urls: [
    'https://aem.live/',
  ],
  blocks: [
    { name: 'hero-gradient', instances: ['.hero.colorful-bg', '.roi-calculator.colorful-bg'] },
    { name: 'search-docs', instances: ['.doc-search'] },
    { name: 'columns-zpattern', instances: ['.z-pattern'] },
    { name: 'cards-benefits', instances: ['.columns.four.colored-icon'] },
    { name: 'columns-logos', instances: ['.section.logo-wall-container:nth-of-type(4)'] },
    { name: 'tabs-testimonials', instances: ['.testimonials'] },
    { name: 'cards-steps', instances: ['.columns-container:nth-of-type(6) .columns-wrapper'] },
  ],
  sections: [
    { id: 's1', name: 'hero', selector: ['.hero-container.doc-search-container.logo-wall-container'], style: 'colorful-gradient', blocks: ['hero-gradient', 'search-docs'], defaultContent: [] },
    { id: 's2', name: 'value-props', selector: ['.z-pattern-container'], style: null, blocks: ['columns-zpattern'], defaultContent: ['.z-pattern-heading'] },
    { id: 's3', name: 'benefits', selector: ['.title-section.columns-container:nth-of-type(3)'], style: null, blocks: ['cards-benefits'], defaultContent: ['.default-content-wrapper'] },
    { id: 's4', name: 'logo-wall', selector: ['.section.logo-wall-container:nth-of-type(4)'], style: null, blocks: ['columns-logos'], defaultContent: [] },
    { id: 's5', name: 'testimonials', selector: ['.testimonials-container'], style: null, blocks: ['tabs-testimonials'], defaultContent: ['.default-content-wrapper'] },
    { id: 's6', name: 'how-it-works', selector: ['.title-section.columns-container:nth-of-type(6)'], style: null, blocks: ['cards-steps'], defaultContent: ['.default-content-wrapper'] },
    { id: 's7', name: 'closing-cta', selector: ['.roi-calculator-container'], style: 'colorful-gradient', blocks: ['hero-gradient'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first; section transformer runs when the template has 2+ sections
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup + section markers)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced by an earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path. Map the root/homepage URL to `/index`
    //    (an empty path crashes the bundled importer's path polyfill).
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
