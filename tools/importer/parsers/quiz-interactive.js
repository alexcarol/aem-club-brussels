/* eslint-disable */
/* global WebImporter */
/**
 * Parser for quiz-interactive. Base: quiz. Source: https://arco.coffee/
 * Generated: 2026-09-24
 *
 * Authored contract (blocks/quiz-interactive): one row per question,
 *   - cell 1: the question text
 *   - cells 2..n: the selectable answer options (one per cell)
 *
 * The live block is client-side rendered and shows a single step at a time,
 * so only the currently-visible question and its options are present in the DOM
 * (the label reads "1 of 3"). We extract every rendered .quiz-step; each yields
 * one row: question text followed by one cell per answer button.
 */
export default function parse(element, { document }) {
  const steps = [...element.querySelectorAll('.quiz-step')];

  const cells = [];
  steps.forEach((step) => {
    const questionEl = step.querySelector('.quiz-question, h1, h2, h3, h4, h5, h6');
    const question = questionEl ? questionEl.textContent.trim() : '';
    const answers = [...step.querySelectorAll('.quiz-option, button')]
      .map((btn) => btn.textContent.trim())
      .filter(Boolean);
    if (!question && !answers.length) return;
    cells.push([question, ...answers]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'quiz-interactive', cells });
  element.replaceWith(block);
}
