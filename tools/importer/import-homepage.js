/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import columnsParser from './parsers/columns.js';
import cardsParser from './parsers/cards.js';
import tabsParser from './parsers/tabs.js';
import accordionParser from './parsers/accordion.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'columns': columnsParser,
  'cards': cardsParser,
  'tabs': tabsParser,
  'accordion': accordionParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Homepage template with hero, featured content, and promotional sections',
  urls: [
    'https://www.wknd-trendsetters.site/'
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['header.section.secondary-section', 'section.section.inverse-section']
    },
    {
      name: 'columns',
      instances: ['main > section.section:nth-of-type(1) > .container > .grid-layout']
    },
    {
      name: 'cards',
      instances: ['.grid-layout.desktop-4-column.grid-gap-md']
    },
    {
      name: 'tabs',
      instances: ['.tabs-wrapper']
    },
    {
      name: 'accordion',
      instances: ['.faq-list']
    }
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Section',
      selector: 'header.section.secondary-section',
      style: 'dark',
      blocks: ['hero'],
      defaultContent: []
    },
    {
      id: 'section-2-feature',
      name: 'Feature Article Section',
      selector: 'main > section.section:nth-of-type(1)',
      style: null,
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-3-gallery',
      name: 'Image Gallery Section',
      selector: 'main > section.section.secondary-section:nth-of-type(1)',
      style: 'grey',
      blocks: ['cards'],
      defaultContent: ['.utility-text-align-center h2.h2-heading', '.utility-text-align-center .paragraph-lg']
    },
    {
      id: 'section-4-testimonials',
      name: 'Testimonials Section',
      selector: 'main > section.section:nth-of-type(3)',
      style: null,
      blocks: ['tabs'],
      defaultContent: []
    },
    {
      id: 'section-5-articles',
      name: 'Latest Articles Section',
      selector: 'main > section.section.secondary-section:nth-of-type(2)',
      style: 'grey',
      blocks: ['cards'],
      defaultContent: ['.utility-text-align-center h2.h2-heading', '.utility-text-align-center .paragraph-lg']
    },
    {
      id: 'section-6-faq',
      name: 'FAQ Section',
      selector: 'main > section.section:nth-of-type(5)',
      style: null,
      blocks: ['accordion'],
      defaultContent: ['main > section.section:nth-of-type(5) h2.h2-heading', 'main > section.section:nth-of-type(5) .subheading']
    },
    {
      id: 'section-7-cta-banner',
      name: 'CTA Banner Section',
      selector: 'section.section.inverse-section',
      style: 'dark',
      blocks: ['hero'],
      defaultContent: []
    }
  ]
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

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
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform transformers (section breaks + metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      }
    }];
  }
};
