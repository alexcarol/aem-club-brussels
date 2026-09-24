# Columns Logos

A wall/grid of partner or customer logos. Logos can be plain images or linked images. Renders as up to
eight columns on desktop and reflows down to two on mobile.

- **Base block:** `columns`
- **Canonical model:** standalone

## Authoring

Put the heading (e.g. "Go live with trusted digital leaders") as default content above the block, then
create a block named **Columns Logos** and add the logos. You can place several logos per row:

| Columns Logos | | | |
| --- | --- | --- | --- |
| ![Adobe](./media/adobe.png) | ![Brand B](./media/b.png) | ![Brand C](./media/c.png) | ![Brand D](./media/d.png) |
| ![Brand E](./media/e.png) | ![Brand F](./media/f.png) | ![Brand G](./media/g.png) | ![Brand H](./media/h.png) |

To make a logo clickable, wrap it in a link.

### Content

- **Logos** — one image (optionally linked) per cell; all cells across all rows are flattened into a
  single responsive grid.

## Supported variations

_None._

## Notes

The CSS is structural only — spacing and any grayscale/brand treatment are applied during the design pass.
