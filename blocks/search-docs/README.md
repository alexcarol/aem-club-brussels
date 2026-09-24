# Search Docs

A documentation search field with live results. As the visitor types (3+ characters), the block queries
a JSON index and renders matching pages with their title, description, and optional image, highlighting
the matched terms.

- **Base block:** `search`
- **Canonical model:** standalone

## Authoring

Create a block named **Search Docs**. It needs no content to work — it defaults to the site's
`query-index.json`. To point it at a different index, add a single link:

| Search Docs |
| --- |
| [Documentation index](/docs/query-index.json) |

The placeholder text ("Search the documentation") and the "no results" message come from the site's
`placeholders` sheet (`searchPlaceholder`, `searchNoResults`).

## Supported variations

| Variation | Class | Effect |
| --- | --- | --- |
| Minimal | `minimal` | Compact results list (small round thumbnails, no card borders) instead of the default card grid. |

## Notes

The CSS is structural only — brand colors and typography are applied during the design pass.
