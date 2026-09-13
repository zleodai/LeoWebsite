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
- `/projects/` — separate Projects and Game Projects sections, with keyboard-accessible expandable technical details and optional source links. Mobile headings omit “Here are my.”
- `/aboutme/` — biography, education, coursework, and contact links.

The content works without client-side JavaScript. Native links and `<details>` provide navigation and disclosure behavior.

## Edit

- `dist/index.html`: homepage markup.
- `dist/assets/style.css`: shared visual styles and responsive rules.
- `content/site.json`: existing portfolio biography, work, education, and contact data.
- `content/projects/*.json`: one file per project; these files supply all project content.
- `scripts/render.mjs`: templates for the three interior pages and tool/language lists.
- `dist/assets/Leo-Dai-Resume.pdf`: résumé copied from the existing portfolio's `ResumeA.pdf`.

Run `npm run build` after changing the content or page templates, then `npm run check`. The build only regenerates the three interior HTML pages. It does not overwrite the homepage, stylesheet, or assets. `dist/` is a self-contained static website and should be tracked as source along with the generator and content.

## Project JSON

Add, edit, or remove a `.json` file in `content/projects/`, then run `npm run build` and refresh the page. Every JSON file in this folder is loaded automatically at build time. The browser receives the generated HTML, so projects remain readable without JavaScript.

```json
{
  "id": "example-project",
  "section": "technical",
  "order": 10,
  "title": "Example Project",
  "categoryTitle": "Developer tool",
  "description": "A short description of the project.",
  "technicalWork": ["Describe a system you implemented.", "Explain a technical decision."],
  "technologies": ["C#", "Unity"],
  "period": "2026",
  "sourceLinkMessage": "Explore the repository",
  "sourceLink": "https://github.com/your-name/your-project"
}
```

- `id`: unique lowercase slug, used for the project's URL anchor.
- `section`: `technical` for Projects or `game` for Game Projects. Defaults to `technical` when omitted. This controls the section independently of the descriptive `categoryTitle`.
- `title`, `categoryTitle`, `description`: required text. The category appears beneath the title in the collapsed row.
- `technicalWork`, `technologies`: required arrays of strings; empty arrays hide their corresponding content.
- `order`: optional number; lower values appear first. Omitted values default to 99, with ties sorted by title.
- `period`: optional date or period label.
- `sourceLink`: optional full HTTP or HTTPS URL. Omit it or use an empty string to hide the source button.
- `sourceLinkMessage`: optional button text. When a URL exists but this label is omitted or empty, the button reads **View source**. A label without a URL produces no button.

The build validates these fields and identifies the file when content is invalid. All text is escaped before insertion into HTML.

## Reference and assets

- Figma: https://www.figma.com/site/6yeDSBI9UCQE0SVHyOBU6A/Portfolio-Website?node-id=0-1
- The four layouts were inspected through the shared Figma Sites browser canvas. MCP design-context extraction returned an access error; this is a visual implementation, not a verified layer-by-layer export.
- The portrait uses the supplied original `dist/assets/headshot3.jpg`. Both pages apply a circular CSS crop with `object-fit: cover` and `object-position: 50% 75%`.
- Montserrat is bundled locally from the previous portfolio under the SIL Open Font License (`dist/assets/FONT-LICENSE.txt`). It approximates the reference typography; exact Figma font metadata was unavailable.
- Content is reused from `C:\Users\Leo\Documents\Github\LeoWebsite\src\data`. Project descriptions and external URLs are retained; claims and external repository availability have not been independently re-audited.
- No Figma password or authentication tokens are stored in this project.

## Delivery

Created locally at the requested path. No public deployment or changes to the original LeoWebsite checkout were made.
