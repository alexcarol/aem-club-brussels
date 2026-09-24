/**
 * loads and decorates the columns-media block
 *
 * Expected initial structure (from authoring): a single row with two columns —
 *   - one column containing an image
 *   - one column containing a heading, paragraph, and a primary CTA link
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-media-${cols.length}-cols`);

  // setup image columns and CTA buttons
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-media-img-col');
        }
      } else {
        // text column: promote the CTA link to a primary button
        const link = col.querySelector('a');
        if (link && !link.classList.contains('button')) {
          link.classList.add('button', 'primary');
        }
      }
    });
  });
}
