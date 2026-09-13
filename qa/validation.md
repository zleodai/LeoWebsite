# Verification

Checked locally on 2026-09-13.

- Build generated the résumé, 16-project catalog, and About Me pages successfully.
- Static checks cover all four pages, local links/assets/anchors, unique IDs, page headings, project disclosures, and PDF/JPEG signatures.
- HTTP requests returned 200 for all four routes and the résumé, font, and portrait; an unknown route returned 404.
- Browser navigation, résumé section anchors, project expansion/collapse, keyboard activation, and coursework expansion worked.
- Clicking the résumé link produced a browser download event.
- All four pages fit 375px and 320px iframe viewports without horizontal overflow. An expanded project also fit at 320px. Frames were used because the browser viewport override did not change the effective viewport reliably. This is responsive browser verification, not physical-device testing.
- Desktop homepage and mobile layout screenshots are included here. The temporary responsive review page was removed from the deliverable.

External project availability and factual portfolio claims were not re-audited. Exact Figma layers/fonts were unavailable through MCP; see README for asset limitations.

## Project JSON update

- Replaced the solo/contribution sections with one project list.
- Migrated all 13 entries present in the current source JSON to individual files under `content/projects/`. Compared titles, categories, descriptions, technical work, technologies, and source URLs against that source before removing the superseded aggregate file.
- Verified missing URLs hide source buttons, missing labels fall back to “View source,” and custom labels and other text are HTML-escaped. Temporary verification content was removed and the site rebuilt.
- Build and static checks pass with a dynamic project count. Browser review confirmed unified navigation, expanded project content, source text, and keyboard collapse. `projects-expanded.jpg` captures the updated page.

## Technical and game sections

- Projects now separates eight technical projects from five games: RALCOOP, Photophobic Teyeme, Unstable, The Walls Weren't Always Red, and Smainter Smail. Each JSON file controls its section using `section: "technical"` or `section: "game"`.
- Browser inspection confirmed the exact membership of both sections. At a 375px frame width the headings read “Projects” and “Game Projects”; desktop headings retain “Here are my.” See `project-sections-mobile.jpg`.
