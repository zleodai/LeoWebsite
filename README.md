# Leo Dai — Portfolio

A responsive, four-page portfolio based on the **Portfolio Website** Figma Sites framework. The homepage preserves the black canvas, sentence-style navigation, circular portrait, and simplified mobile layout.

## Run locally

Requires Node.js 20 or later. There are no package dependencies to install.

```powershell
cd C:\Users\Leo\Dev\Website
npm run dev
```

Open http://127.0.0.1:5173. To use another port, run `npm run dev -- --port 5174`.

## Pages

- `/` — introduction, Resume / Projects / About Me links, portrait.
- `/resume/` — PDF download, tools, languages, and experience.
- `/projects/` — solo projects and contributions, with keyboard-accessible expandable technical details and existing source/game links.
- `/aboutme/` — biography, education, coursework, and contact links.

The content works without client-side JavaScript. Native links and `<details>` provide navigation and disclosure behavior.

## Edit

- `dist/index.html`: homepage markup.
- `dist/assets/style.css`: shared visual styles and responsive rules.
- `content/site.json`: existing portfolio biography, work, education, and contact data.
- `content/projects.json`: existing 16-project catalog.
- `scripts/render.mjs`: templates for the three interior pages, tool/language lists, and project grouping.
- `dist/assets/Leo-Dai-Resume.pdf`: résumé copied from the existing portfolio's `ResumeA.pdf`.

Run `npm run build` after changing the content or page templates, then `npm run check`. The build only regenerates the three interior HTML pages. It does not overwrite the homepage, stylesheet, or assets. `dist/` is a self-contained static website and should be tracked as source along with the generator and content.

## Reference and assets

- Figma: https://www.figma.com/site/6yeDSBI9UCQE0SVHyOBU6A/Portfolio-Website?node-id=0-1
- The four layouts were inspected through the shared Figma Sites browser canvas. MCP design-context extraction returned an access error; this is a visual implementation, not a verified layer-by-layer export.
- The portrait uses the supplied original `dist/assets/headshot3.jpg`. Both pages apply a circular CSS crop with `object-fit: cover` and `object-position: 50% 75%`.
- Montserrat is bundled locally from the previous portfolio under the SIL Open Font License (`dist/assets/FONT-LICENSE.txt`). It approximates the reference typography; exact Figma font metadata was unavailable.
- Content is reused from `C:\Users\Leo\Documents\Github\LeoWebsite\src\data`. Project descriptions and external URLs are retained; claims and external repository availability have not been independently re-audited.
- Solo/contribution grouping is editable via `soloIds` in `scripts/render.mjs`. Team/academic projects and uncertain collaborations are placed in contributions; confirm classifications before publishing.
- No Figma password or authentication tokens are stored in this project.

## Delivery

Created locally at the requested path. No public deployment or changes to the original LeoWebsite checkout were made.
