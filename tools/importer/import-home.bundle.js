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

  // tools/importer/parsers/hero-lifestyle.js
  function parse(element, { document: document2 }) {
    const picture = element.querySelector("picture");
    const heading = element.querySelector('h1, h2, h3, [class*="title"]');
    const paragraphs = [...element.querySelectorAll("p")].filter((p) => !p.querySelector("picture"));
    if (!heading && !paragraphs.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (picture) cells.push([picture]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    contentCell.push(...paragraphs);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-lifestyle", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse2(element, { document: document2 }) {
    const items = [...element.querySelectorAll(":scope > ul > li")];
    const rows = items.length ? items : [...element.querySelectorAll(":scope > div")];
    const cells = [];
    rows.forEach((item) => {
      const picture = item.querySelector("picture");
      const imageCell = picture || "";
      const bodyEls = [];
      const heading = item.querySelector("h1, h2, h3, h4, h5, h6");
      if (heading) bodyEls.push(heading);
      item.querySelectorAll("p").forEach((p) => {
        if (p.querySelector("picture")) return;
        bodyEls.push(p);
      });
      cells.push([imageCell, bodyEls]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/quiz-interactive.js
  function parse3(element, { document: document2 }) {
    const steps = [...element.querySelectorAll(".quiz-step")];
    const cells = [];
    steps.forEach((step) => {
      const questionEl = step.querySelector(".quiz-question, h1, h2, h3, h4, h5, h6");
      const question = questionEl ? questionEl.textContent.trim() : "";
      const answers = [...step.querySelectorAll(".quiz-option, button")].map((btn) => btn.textContent.trim()).filter(Boolean);
      if (!question && !answers.length) return;
      cells.push([question, ...answers]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "quiz-interactive", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-story.js
  function parse4(element, { document: document2 }) {
    const items = [...element.querySelectorAll(":scope > ul > li")];
    const rows = items.length ? items : [...element.querySelectorAll(":scope > div")];
    const cells = [];
    rows.forEach((item) => {
      const picture = item.querySelector("picture");
      const imageCell = picture || "";
      const bodyEls = [];
      const heading = item.querySelector("h1, h2, h3, h4, h5, h6");
      if (heading) bodyEls.push(heading);
      item.querySelectorAll("p").forEach((p) => {
        if (p.querySelector("picture")) return;
        bodyEls.push(p);
      });
      cells.push([imageCell, bodyEls]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-story", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/testimonials-cards.js
  function parse5(element, { document: document2 }) {
    const items = [...element.querySelectorAll(":scope > ul > li")];
    const rows = items.length ? items : [...element.querySelectorAll(":scope > div")];
    const cells = [];
    rows.forEach((item) => {
      const picture = item.querySelector("picture");
      const imageCell = picture || "";
      const bodyEls = [];
      const starContainer = item.querySelector('.testimonials-stars, [class*="stars"]');
      const stars = starContainer ? [...starContainer.children] : [...item.querySelectorAll('[class*="star"]')];
      if (stars.length) {
        const ratingP = document2.createElement("p");
        ratingP.textContent = stars.map((s) => s.textContent.trim()).join("");
        bodyEls.push(ratingP);
      }
      const quote = item.querySelector("blockquote, .testimonials-quote");
      if (quote) bodyEls.push(quote);
      const name = item.querySelector(".testimonials-name");
      if (name) bodyEls.push(name);
      cells.push([imageCell, bodyEls]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "testimonials-cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  function parse6(element, { document: document2 }) {
    const rowWrapper = element.querySelector(":scope > div");
    const columns = rowWrapper ? [...rowWrapper.children] : [...element.children];
    const rowCells = columns.map((col) => {
      const picture = col.querySelector("picture");
      if (picture && col.querySelectorAll("h1,h2,h3,h4,h5,h6,p:not(:has(picture))").length === 0) {
        return picture;
      }
      const contentEls = [...col.children].filter((child) => !child.querySelector("picture"));
      return contentEls.length ? contentEls : col;
    });
    if (!rowCells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [rowCells];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/arco-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".coach-scrim",
        ".coach-dot",
        ".coach-tooltip"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer"
      ]);
    }
  }

  // tools/importer/transformers/arco-sections.js
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
    "hero-lifestyle": parse,
    "cards-product": parse2,
    "quiz-interactive": parse3,
    "cards-story": parse4,
    "testimonials-cards": parse5,
    "columns-media": parse6
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "Arco coffee homepage: hero, featured products, brew-style quiz, latest stories, testimonials, and a built-to-last media feature.",
    urls: [
      "https://arco.coffee/"
    ],
    blocks: [
      {
        name: "hero-lifestyle",
        instances: [".hero-container .hero.block", ".hero.block"]
      },
      {
        name: "cards-product",
        instances: [".cards-container:nth-of-type(2) .cards.block"]
      },
      {
        name: "quiz-interactive",
        instances: [".quiz-container .quiz.block", ".quiz.block"]
      },
      {
        name: "cards-story",
        instances: [".cards-container:nth-of-type(4) .cards.block"]
      },
      {
        name: "testimonials-cards",
        instances: [".testimonials-container .testimonials.block", ".testimonials.block"]
      },
      {
        name: "columns-media",
        instances: [".columns-container .columns.block", ".columns.block"]
      }
    ],
    sections: [
      {
        id: "rc1",
        name: "hero",
        selector: [".section.hero-container"],
        style: null,
        blocks: ["hero-lifestyle"],
        defaultContent: []
      },
      {
        id: "rc2",
        name: "featured-products",
        selector: [".section.cards-container:nth-of-type(2)"],
        style: null,
        blocks: ["cards-product"],
        defaultContent: [".cards-container:nth-of-type(2) .default-content-wrapper"]
      },
      {
        id: "rc3",
        name: "quiz",
        selector: [".section.quiz-container"],
        style: null,
        blocks: ["quiz-interactive"],
        defaultContent: [".quiz-container .default-content-wrapper"]
      },
      {
        id: "rc4",
        name: "latest-stories",
        selector: [".section.cards-container:nth-of-type(4)"],
        style: null,
        blocks: ["cards-story"],
        defaultContent: [".cards-container:nth-of-type(4) .default-content-wrapper"]
      },
      {
        id: "rc5",
        name: "testimonials",
        selector: [".section.testimonials-container"],
        style: null,
        blocks: ["testimonials-cards"],
        defaultContent: [".testimonials-container .default-content-wrapper"]
      },
      {
        id: "rc6",
        name: "built-to-last",
        selector: [".section.columns-container"],
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      }
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
    const claimed = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        elements.forEach((element) => {
          if (claimed.has(element)) return;
          claimed.add(element);
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
      const found = pageBlocks.some((b) => b.name === blockDef.name);
      if (!found) console.warn(`Block "${blockDef.name}" selectors not found`);
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
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
