/**
 * loads and decorates the quiz-interactive block
 *
 * Expected initial structure (from authoring): one row per question.
 *   - cell 1: the question text
 *   - cells 2..n: the selectable answer options (one per cell)
 *
 * The block renders a single-step-at-a-time quiz with a progress bar. Selecting
 * an answer advances to the next question; the final selection completes the quiz.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  // Parse authored rows into a list of { question, answers[] }
  const steps = [...block.children]
    .map((row) => {
      const cells = [...row.children];
      if (!cells.length) return null;
      const question = cells[0].textContent.trim();
      const answers = cells
        .slice(1)
        .map((cell) => cell.textContent.trim())
        .filter(Boolean);
      if (!question) return null;
      return { question, answers };
    })
    .filter(Boolean);

  block.textContent = '';

  if (!steps.length) return;

  const total = steps.length;
  let current = 0;

  const container = document.createElement('div');
  container.className = 'quiz-interactive-container';

  const stepEl = document.createElement('div');
  stepEl.className = 'quiz-interactive-step';

  // progress bar
  const progress = document.createElement('div');
  progress.className = 'quiz-interactive-progress';
  const track = document.createElement('div');
  track.className = 'quiz-interactive-progress-track';
  const fill = document.createElement('div');
  fill.className = 'quiz-interactive-progress-fill';
  track.append(fill);
  const label = document.createElement('span');
  label.className = 'quiz-interactive-progress-label';
  progress.append(track, label);

  const question = document.createElement('h3');
  question.className = 'quiz-interactive-question';

  const options = document.createElement('div');
  options.className = 'quiz-interactive-options';

  stepEl.append(progress, question, options);
  container.append(stepEl);
  block.append(container);

  const render = () => {
    const step = steps[current];
    const pct = Math.round(((current + 1) / total) * 100);
    fill.style.width = `${pct}%`;
    label.textContent = `${current + 1} of ${total}`;
    question.textContent = step.question;
    question.id = `quiz-interactive-question-${current}`;

    options.textContent = '';
    step.answers.forEach((answer) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-interactive-option';
      btn.textContent = answer;
      btn.addEventListener('click', () => {
        if (current < total - 1) {
          current += 1;
          render();
        } else {
          container.classList.add('quiz-interactive-complete');
        }
      });
      options.append(btn);
    });
  };

  render();
}
