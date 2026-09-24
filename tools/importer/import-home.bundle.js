/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/hero-gradient.js
  function parse(element, { document: document2 }) {
    const content = element.querySelector(".inner-content") || element;
    const eyebrow = content.querySelector("h3, h4, h5, h6, .eyebrow");
    const heading = content.querySelector("h1, h2");
    const subheading = content.querySelector("p");
    const ctas = [...content.querySelectorAll('a.button, a[class*="button"], a')];
    const bgPicture = element.querySelector(".image-wrapper picture, .image-wrapper img");
    const leadImg = element.querySelector(":scope > img");
    const bgImage = bgPicture || leadImg || "";
    const contentCell = [];
    if (eyebrow) contentCell.push(eyebrow);
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctas);
    if (!heading && !eyebrow && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([contentCell]);
    if (bgImage) cells.push([bgImage]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-gradient", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/search-docs.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    const indexLink = [...element.querySelectorAll('a[href*="query-index"], a[href$=".json"]')].find((a) => !a.closest(".doc-search-results, ul"));
    if (indexLink) cells.push([indexLink]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "search-docs", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-zpattern.js
  function parse3(element, { document: document2 }) {
    const rows = [...element.querySelectorAll(":scope > .z-row-even, :scope > .z-row-odd")];
    const cells = [];
    rows.forEach((row) => {
      const imageSide = row.querySelector(".image-side");
      const image = imageSide ? imageSide.querySelector("picture, img") || imageSide : row.querySelector("picture, img") || "";
      const contentSide = row.querySelector(".content-side") || row;
      const content = [];
      const eyebrow = contentSide.querySelector(".icon-eyebrow, p.icon-eyebrow, p");
      if (eyebrow) content.push(eyebrow);
      const heading = contentSide.querySelector("h1, h2, h3, h4, h5, h6, .main-headline");
      if (heading) content.push(heading);
      const list = contentSide.querySelector("ul, ol");
      if (list) content.push(list);
      if (!image && !content.length) return;
      cells.push([image, content]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-zpattern", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-benefits.js
  function parse4(element, { document: document2 }) {
    const headings = [...element.querySelectorAll("h3, h2, h4")];
    const cells = [];
    headings.forEach((heading) => {
      const container = heading.parentElement;
      const icon = container.querySelector("img, picture") || "";
      const body = [heading];
      const paras = [...container.querySelectorAll(":scope > p")].filter((p) => p.textContent.trim() || p.querySelector("img, picture, a"));
      body.push(...paras);
      cells.push([icon, body]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-benefits", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-logos.js
  function parse5(element, { document: document2 }) {
    const COLS = 4;
    const items = [...element.querySelectorAll(".logo-wall-list-item")];
    const logos = items.map((li) => {
      const link = li.querySelector("a.logo-wall-item-link, a");
      const media = li.querySelector("picture, img");
      if (link) return link;
      return media || "";
    }).filter(Boolean);
    if (!logos.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    for (let i = 0; i < logos.length; i += COLS) {
      const row = logos.slice(i, i + COLS);
      while (row.length < COLS) row.push("");
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-logos", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonials.js
  function parse6(element, { document: document2 }) {
    const buttons = [...element.querySelectorAll(".tab-list .tablist-container button, .tab-list button")];
    const panels = [...element.querySelectorAll(".tabcontent .tabpanel, .tabpanel")];
    const cells = [];
    panels.forEach((panel, i) => {
      const button = buttons[i];
      const tabImage = button && button.querySelector("picture, img") || panel.querySelector(".image-side picture, .image-side img") || "";
      const info = panel.querySelector(".testimonial-info") || panel;
      const body = [];
      const panelImage = panel.querySelector(".image-side picture, .image-side img");
      if (panelImage) body.push(panelImage);
      const quote = info.querySelector(".testimonial-quote, p");
      if (quote) body.push(quote);
      const customerInfo = info.querySelector(".customer-info");
      if (customerInfo) {
        const custPic = customerInfo.querySelector("picture, img");
        if (custPic) body.push(custPic);
        customerInfo.querySelectorAll(".titles p, p").forEach((p) => body.push(p));
        const cta = customerInfo.querySelector("a.button, a");
        if (cta) body.push(cta);
      }
      const stats = info.querySelector("ul");
      if (stats) body.push(stats);
      if (!tabImage && !body.length) return;
      cells.push([tabImage, body]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-testimonials", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-steps.js
  function parse7(element, { document: document2 }) {
    const headings = [...element.querySelectorAll("h2, h3, h4, h5, h6")].filter((h) => !/^\s*\d+\s*$/.test(h.textContent));
    const cells = [];
    headings.forEach((heading) => {
      const container = heading.parentElement;
      const body = [heading];
      const paras = [...container.querySelectorAll(":scope > p")].filter((p) => p.textContent.trim() || p.querySelector("a"));
      body.push(...paras);
      const image = container.querySelector("picture, img") || "";
      cells.push([body, image]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-steps", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/aemlive-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.header-wrapper",
        "nav.gnav",
        "aside#gnav-search-bar",
        "footer.footer-wrapper",
        "aside"
      ]);
    }
  }

  // tools/importer/transformers/aemlive-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "hero-gradient": parse,
    "search-docs": parse2,
    "columns-zpattern": parse3,
    "cards-benefits": parse4,
    "columns-logos": parse5,
    "tabs-testimonials": parse6,
    "cards-steps": parse7
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "aem.live homepage",
    urls: [
      "https://aem.live/"
    ],
    blocks: [
      { name: "hero-gradient", instances: [".hero.colorful-bg", ".roi-calculator.colorful-bg"] },
      { name: "search-docs", instances: [".doc-search"] },
      { name: "columns-zpattern", instances: [".z-pattern"] },
      { name: "cards-benefits", instances: [".columns.four.colored-icon"] },
      { name: "columns-logos", instances: [".section.logo-wall-container:nth-of-type(4)"] },
      { name: "tabs-testimonials", instances: [".testimonials"] },
      { name: "cards-steps", instances: [".columns-container:nth-of-type(6) .columns-wrapper"] }
    ],
    sections: [
      { id: "s1", name: "hero", selector: [".hero-container.doc-search-container.logo-wall-container"], style: "colorful-gradient", blocks: ["hero-gradient", "search-docs"], defaultContent: [] },
      { id: "s2", name: "value-props", selector: [".z-pattern-container"], style: null, blocks: ["columns-zpattern"], defaultContent: [".z-pattern-heading"] },
      { id: "s3", name: "benefits", selector: [".title-section.columns-container:nth-of-type(3)"], style: null, blocks: ["cards-benefits"], defaultContent: [".default-content-wrapper"] },
      { id: "s4", name: "logo-wall", selector: [".section.logo-wall-container:nth-of-type(4)"], style: null, blocks: ["columns-logos"], defaultContent: [] },
      { id: "s5", name: "testimonials", selector: [".testimonials-container"], style: null, blocks: ["tabs-testimonials"], defaultContent: [".default-content-wrapper"] },
      { id: "s6", name: "how-it-works", selector: [".title-section.columns-container:nth-of-type(6)"], style: null, blocks: ["cards-steps"], defaultContent: [".default-content-wrapper"] },
      { id: "s7", name: "closing-cta", selector: [".roi-calculator-container"], style: "colorful-gradient", blocks: ["hero-gradient"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
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
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
