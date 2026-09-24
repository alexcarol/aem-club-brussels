# Cards Steps

A sequence of numbered "how it works" steps. Each step shows an auto-generated number (01, 02, 03…), a
heading, a description, and a supporting image. Renders as three columns on desktop, stacked on mobile.

- **Base block:** `cards`
- **Canonical model:** standalone

## Authoring

Put the section eyebrow/heading (e.g. "How it works" / "Creating a site with AEM is easy as") as default
content above the block, then create a block named **Cards Steps** with one row per step:

| Cards Steps | |
| --- | --- |
| **Create content in Word or Google Docs**<br>Write and edit in the tools you already use. | ![step 1](./media/step1.png) |
| **Share your folder with Adobe**<br>Connect your content source. | ![step 2](./media/step2.png) |
| **See your site in action**<br>Preview and publish instantly. | ![step 3](./media/step3.png) |

The step numbers (01, 02, 03…) are generated automatically from row order — don't author them.

### Content (per row)

- **Body** — a heading and a description paragraph.
- **Image** — a supporting image in its own cell.

## Supported variations

_None._

## Notes

The CSS is structural only — brand colors, the numbered styling, and typography are applied during the
design pass.
