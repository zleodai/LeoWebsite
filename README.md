# Leo Dai Portfolio

## Development

- Install dependencies with `npm ci`.
- Run the local site with `npm start` (default: http://localhost:3000).
- Generate the production site with `npm run build`.
- Run browser checks with `npm test`. On a new machine, run `npm run test:install` first.

## Content

Edit `public/data/siteContent.json` for navigation, introduction, experience,
education, and contact details. Keep the initial title and description in
`public/index.html` consistent with its `meta` fields.

Add projects to the appropriate array in `public/data/projects.json`. Each
project can include a title, description, type, link, cover image, and `stack`
array of languages and technologies. This array is the sole source for project
tags and technology filters; legacy `skillIds` do not add tags. Describe methods
such as GOAP, state machines, or procedural generation in the description and
contribution bullets instead. `featured: true` ranks a project first in the default search
view; lower `priority` numbers appear first within each group. The overlay shows
the description, technology list, contribution bullets, image, and project link.
Search matches project names, types, descriptions, and technologies. Category and technology
filters combine with the search; visitors can also sort by name.

## Structure And Theme

- `src/App.js`: content loading and section ordering.
- `src/components/`: section components and shared project presentation.
- `src/data/content.js`: content fetching, link resolution, and project grouping.
- `src/styles/theme.css`: shared colors, fonts, spacing, and dimensions.
- `src/styles/layout.css`: page layout and navigation.
- `src/styles/components.css`: component appearance and mobile adjustments.
- `src/styles/projects.css`: searchable project table and detail overlay.

Start theme changes with the CSS variables in `theme.css`. Technology tags stay
on individual projects. Experience appears before projects in `App.js`.
Rebuild after source or public-content changes to refresh the tracked `build/`
output; do not edit generated build files directly.
