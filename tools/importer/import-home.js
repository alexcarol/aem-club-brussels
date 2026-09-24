/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroLifestyleParser from './parsers/hero-lifestyle.js';
import cardsProductParser from './parsers/cards-product.js';
import quizInteractiveParser from './parsers/quiz-interactive.js';
import cardsStoryParser from './parsers/cards-story.js';
import testimonialsCardsParser from './parsers/testimonials-cards.js';
import columnsMediaParser from './parsers/columns-media.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/arco-cleanup.js';
import sectionsTransformer from './transformers/arco-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-lifestyle': heroLifestyleParser,
  'cards-product': cardsProductParser,
  'quiz-interactive': quizInteractiveParser,
  'cards-story': cardsStoryParser,
  'testimonials-cards': testimonialsCardsParser,
  'columns-media': columnsMediaParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'Arco coffee homepage: hero, featured products, brew-style quiz, latest stories, testimonials, and a built-to-last media feature.',
  urls: [
    'https://arco.coffee/',
  ],
  blocks: [
    {
      name: 'hero-lifestyle',
      instances: ['.hero-container .hero.block', '.hero.block'],
    },
    {
      name: 'cards-product',
      instances: ['.cards-container:nth-of-type(2) .cards.block'],
    },
    {
      name: 'quiz-interactive',
      instances: ['.quiz-container .quiz.block', '.quiz.block'],
    },
    {
      name: 'cards-story',
      instances: ['.cards-container:nth-of-type(4) .cards.block'],
    },
    {
      name: 'testimonials-cards',
      instances: ['.testimonials-container .testimonials.block', '.testimonials.block'],
    },
    {
      name: 'columns-media',
      instances: ['.columns-container .columns.block', '.columns.block'],
    },
  ],
  sections: [
    {
      id: 'rc1', name: 'hero', selector: ['.section.hero-container'], style: null, blocks: ['hero-lifestyle'], defaultContent: [],
    },
    {
      id: 'rc2', name: 'featured-products', selector: ['.section.cards-container:nth-of-type(2)'], style: null, blocks: ['cards-product'], defaultContent: ['.cards-container:nth-of-type(2) .default-content-wrapper'],
    },
    {
      id: 'rc3', name: 'quiz', selector: ['.section.quiz-container'], style: null, blocks: ['quiz-interactive'], defaultContent: ['.quiz-container .default-content-wrapper'],
    },
    {
      id: 'rc4', name: 'latest-stories', selector: ['.section.cards-container:nth-of-type(4)'], style: null, blocks: ['cards-story'], defaultContent: ['.cards-container:nth-of-type(4) .default-content-wrapper'],
    },
    {
      id: 'rc5', name: 'testimonials', selector: ['.section.testimonials-container'], style: null, blocks: ['testimonials-cards'], defaultContent: ['.testimonials-container .default-content-wrapper'],
    },
    {
      id: 'rc6', name: 'built-to-last', selector: ['.section.columns-container'], style: null, blocks: ['columns-media'], defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first; sections transformer runs when 2+ sections
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
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
 * Find all blocks on the page based on the embedded template configuration.
 * Multiple selectors per block are tried in order; the first that matches wins,
 * so we don't double-parse the same element via a fallback selector.
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const claimed = new Set();

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (claimed.has(element)) return;
        claimed.add(element);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
    const found = pageBlocks.some((b) => b.name === blockDef.name);
    if (!found) console.warn(`Block "${blockDef.name}" selectors not found`);
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block; skip elements already replaced by an earlier parser
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
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

    // 4. afterTransform (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path; map homepage root to /index
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
