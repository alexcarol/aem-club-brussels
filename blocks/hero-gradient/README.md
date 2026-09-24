# Hero Gradient

Full-bleed banner on a colorful gradient background. Presents an optional eyebrow, a large centered
headline, an optional subheading, and a call-to-action button, with optional decorative imagery layered
behind the text. Used for the top-of-page hero and the closing call-to-action banner.

- **Base block:** `hero`
- **Canonical model:** standalone

## Authoring

Create a block named **Hero Gradient**. Author the content in a single cell:

| Hero Gradient |
| --- |
| _(eyebrow)_ What is Adobe Experience Manager?<br>**Create a website, seriously fast.**<br>Supporting subheading paragraph.<br>[Create your site](/get-started) |

To add decorative background artwork, place an image on its own in a second row:

| Hero Gradient |
| --- |
| Eyebrow / Heading / Subheading / CTA |
| ![background](./media/hero-bg.png) |

### Content

- **Eyebrow** _(optional)_ — a short line above the headline (first paragraph is styled as an eyebrow).
- **Heading** — the main headline (`h1` for the top hero, `h2` for a closing banner).
- **Subheading** _(optional)_ — supporting paragraph text.
- **CTA** _(optional)_ — a link, rendered as a button.
- **Image** _(optional)_ — an image-only row becomes the decorative full-bleed background.

## Supported variations

_None. This block has a single presentation._

## Notes

The CSS is structural only — brand colors, gradient, and typography are applied during the design pass.
