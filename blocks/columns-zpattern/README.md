# Columns Z-Pattern

A stack of value-proposition rows. Each row pairs an image with text (icon eyebrow, heading, and a
bulleted description). Consecutive rows automatically alternate the image side, producing a "Z-pattern"
reading flow.

- **Base block:** `columns`
- **Canonical model:** standalone

## Authoring

Create a block named **Columns Z-Pattern**. Add one row per value prop, each with two cells — an image
and the accompanying text:

| Columns Z-Pattern | |
| --- | --- |
| ![business](./media/owners.png) | _(icon)_ **Business Owners**<br>- Faster time to market<br>- Better performance |
| ![visitors](./media/visitors.png) | _(icon)_ **Visitors**<br>- Instant page loads<br>- Great experience |
| ![developers](./media/devs.png) | _(icon)_ **Developers**<br>- Simple tooling<br>- No lock-in |

The image side alternates automatically: odd rows put the image first, even rows put it second. Put a
section heading (e.g. "Faster sites, better business") as default content above the block.

### Content (per row)

- **Image** — the row's illustration (image-only cell).
- **Text** — icon/eyebrow, heading, and a bullet list describing the value prop.

## Supported variations

_None. Image alternation is automatic._

## Notes

The CSS is structural only — brand colors, drop shadows, and typography are applied during the design pass.
