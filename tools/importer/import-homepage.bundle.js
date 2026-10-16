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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const heroImage = element.querySelector('img.cover-image, img[class*="cover"], img[class*="hero"], img[class*="background"], img');
    const heading = element.querySelector('h1, h2, h3, .h1-heading, .h2-heading, [class*="heading"]');
    const description = element.querySelector('p.subheading, p[class*="subheading"], p[class*="subtitle"], .subheading');
    const ctaLinks = Array.from(
      element.querySelectorAll('.button-group a, a.button, a[class*="cta"], a[class*="btn"]')
    );
    const uniqueCtas = [...new Set(ctaLinks)];
    const cells = [];
    if (heroImage) {
      cells.push([[heroImage]]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (uniqueCtas.length > 0) {
      contentCell.push(...uniqueCtas);
    }
    if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse2(element, { document }) {
    const columnDivs = element.querySelectorAll(":scope > div");
    const cells = [];
    if (columnDivs.length > 0) {
      const row = [];
      columnDivs.forEach((colDiv) => {
        const cellContent = [];
        const children = colDiv.querySelectorAll(":scope > *");
        children.forEach((child) => {
          cellContent.push(child);
        });
        if (cellContent.length === 0 && colDiv.textContent.trim()) {
          cellContent.push(colDiv);
        }
        row.push(cellContent);
      });
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse3(element, { document }) {
    const cards = element.querySelectorAll("a.article-card, a.card-link");
    const cardList = cards.length > 0 ? cards : element.querySelectorAll(":scope > a");
    const cells = [];
    cardList.forEach((card) => {
      const image = card.querySelector(".article-card-image img, img.cover-image, img");
      const heading = card.querySelector('h3, h4, .h4-heading, [class*="heading"]');
      const tag = card.querySelector(".tag");
      const date = card.querySelector(".paragraph-sm, .utility-text-secondary");
      const textContent = [];
      if (heading) {
        textContent.push(heading);
      }
      if (tag || date) {
        const desc = document.createElement("p");
        const parts = [];
        if (tag) parts.push(tag.textContent.trim());
        if (date) parts.push(date.textContent.trim());
        desc.textContent = parts.join(" | ");
        textContent.push(desc);
      }
      const href = card.tagName === "A" ? card.getAttribute("href") : null;
      if (href) {
        const cta = document.createElement("a");
        cta.setAttribute("href", href);
        cta.textContent = heading ? heading.textContent.trim() : "Read more";
        textContent.push(cta);
      }
      const imageCell = image || "";
      cells.push([imageCell, textContent]);
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/tabs.js
  function parse4(element, { document }) {
    const tabButtons = Array.from(element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu button"));
    const tabPanes = Array.from(element.querySelectorAll(".tabs-content .tab-pane, .tab-pane"));
    const cells = [];
    const count = Math.max(tabPanes.length, tabButtons.length);
    for (let i = 0; i < count; i++) {
      let tabLabel = "";
      if (tabButtons[i]) {
        const strongEl = tabButtons[i].querySelector("strong");
        if (strongEl) {
          tabLabel = strongEl.textContent.trim();
        } else {
          tabLabel = tabButtons[i].textContent.trim();
        }
      }
      const contentCell = [];
      if (tabPanes[i]) {
        const img = tabPanes[i].querySelector("img");
        if (img) {
          const newImg = document.createElement("img");
          newImg.src = img.src;
          newImg.alt = img.alt || "";
          contentCell.push(newImg);
        }
        const nameEl = tabPanes[i].querySelector(".paragraph-xl strong, div strong");
        if (nameEl) {
          const nameP = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = nameEl.textContent.trim();
          nameP.appendChild(strong);
          contentCell.push(nameP);
        }
        const nameDiv = tabPanes[i].querySelector(".paragraph-xl.utility-margin-bottom-0");
        if (nameDiv && nameDiv.nextElementSibling) {
          const roleText = nameDiv.nextElementSibling.textContent.trim();
          if (roleText) {
            const roleP = document.createElement("p");
            roleP.textContent = roleText;
            contentCell.push(roleP);
          }
        }
        const quoteEl = tabPanes[i].querySelector("p.paragraph-xl, p");
        if (quoteEl) {
          const quoteP = document.createElement("p");
          quoteP.textContent = quoteEl.textContent.trim();
          contentCell.push(quoteP);
        }
      }
      cells.push([tabLabel || `Tab ${i + 1}`, contentCell.length > 0 ? contentCell : ""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion.js
  function parse5(element, { document }) {
    const items = element.querySelectorAll('details.faq-item, details[class*="faq"], details');
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary.faq-question, summary");
      const titleSpan = summary ? summary.querySelector("span") : null;
      const titleText = titleSpan ? titleSpan.textContent.trim() : summary ? summary.textContent.trim() : "";
      const answerDiv = item.querySelector('div.faq-answer, div[class*="answer"], div[class*="content"]');
      const titleNode = document.createTextNode(titleText);
      let contentCell;
      if (answerDiv) {
        const contentElements = Array.from(answerDiv.children);
        if (contentElements.length > 0) {
          contentCell = contentElements;
        } else {
          contentCell = document.createTextNode(answerDiv.textContent.trim());
        }
      } else {
        contentCell = document.createTextNode("");
      }
      if (Array.isArray(contentCell)) {
        cells.push([titleNode, contentCell]);
      } else {
        cells.push([titleNode, contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["a.skip-link"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".navbar", "footer.footer", ".breadcrumbs", "link", "noscript"]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function findSection(element, document, selector) {
    let el = element.querySelector(selector);
    if (el) return el;
    if (/^main\s*>/.test(selector)) {
      const scopedSelector = selector.replace(/^main\s*>/, ":scope >");
      try {
        el = element.querySelector(scopedSelector);
      } catch (e) {
      }
      if (el) return el;
    }
    const nthClassMatch = selector.match(/([a-z]+(?:\.[a-z0-9_-]+)+):nth-of-type\((\d+)\)/i);
    if (nthClassMatch) {
      const baseSelector = nthClassMatch[1];
      const nthIndex = parseInt(nthClassMatch[2], 10) - 1;
      const candidates = element.querySelectorAll(baseSelector);
      if (candidates.length > nthIndex) return candidates[nthIndex];
    }
    try {
      el = document.querySelector(selector);
    } catch (e) {
    }
    if (el && element.contains(el)) return el;
    return null;
  }
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = findSection(element, document, section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero": parse,
    "columns": parse2,
    "cards": parse3,
    "tabs": parse4,
    "accordion": parse5
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Homepage template with hero, featured content, and promotional sections",
    urls: [
      "https://www.wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "hero",
        instances: ["header.section.secondary-section", "section.section.inverse-section"]
      },
      {
        name: "columns",
        instances: ["main > section.section:nth-of-type(1) > .container > .grid-layout"]
      },
      {
        name: "cards",
        instances: [".grid-layout.desktop-4-column.grid-gap-md"]
      },
      {
        name: "tabs",
        instances: [".tabs-wrapper"]
      },
      {
        name: "accordion",
        instances: [".faq-list"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Section",
        selector: "header.section.secondary-section",
        style: "dark",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-2-feature",
        name: "Feature Article Section",
        selector: "main > section.section:nth-of-type(1)",
        style: null,
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-3-gallery",
        name: "Image Gallery Section",
        selector: "main > section.section.secondary-section:nth-of-type(1)",
        style: "grey",
        blocks: ["cards"],
        defaultContent: [".utility-text-align-center h2.h2-heading", ".utility-text-align-center .paragraph-lg"]
      },
      {
        id: "section-4-testimonials",
        name: "Testimonials Section",
        selector: "main > section.section:nth-of-type(3)",
        style: null,
        blocks: ["tabs"],
        defaultContent: []
      },
      {
        id: "section-5-articles",
        name: "Latest Articles Section",
        selector: "main > section.section.secondary-section:nth-of-type(2)",
        style: "grey",
        blocks: ["cards"],
        defaultContent: [".utility-text-align-center h2.h2-heading", ".utility-text-align-center .paragraph-lg"]
      },
      {
        id: "section-6-faq",
        name: "FAQ Section",
        selector: "main > section.section:nth-of-type(5)",
        style: null,
        blocks: ["accordion"],
        defaultContent: ["main > section.section:nth-of-type(5) h2.h2-heading", "main > section.section:nth-of-type(5) .subheading"]
      },
      {
        id: "section-7-cta-banner",
        name: "CTA Banner Section",
        selector: "section.section.inverse-section",
        style: "dark",
        blocks: ["hero"],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
