# Tabs Testimonials

An interactive, image-tabbed testimonials switcher. A centered row of image tab buttons (customer
logos/avatars) switches between testimonial panels. Each panel shows the customer image, a pull-quote,
the name and title, and a "Visit Site" CTA.

- **Base block:** `tabs`
- **Canonical model:** standalone

## Authoring

Put the section eyebrow/heading (e.g. "Customer Stories") as default content above the block, then create
a block named **Tabs Testimonials** with one row per testimonial. The first image in each row becomes
that testimonial's tab button:

| Tabs Testimonials | |
| --- | --- |
| ![Brand A logo](./media/a-logo.png) | "This changed how we ship."<br>**Jane Doe**, VP Marketing, Brand A<br>[Visit Site](https://a.example) |
| ![Brand B logo](./media/b-logo.png) | "Fastest launch we've had."<br>**John Roe**, CTO, Brand B<br>[Visit Site](https://b.example) |

### Content (per row)

- **Tab image** — the first image; becomes the clickable tab button.
- **Panel body** — the quote, the attribution (name + title), and a CTA link.

The first panel is shown by default; clicking a tab reveals its panel. Tabs are keyboard- and
screen-reader-accessible (`role="tab"`/`role="tabpanel"`, `aria-selected`, `aria-hidden`).

## Supported variations

_None._

## Notes

The CSS is structural only — brand colors and typography are applied during the design pass.
