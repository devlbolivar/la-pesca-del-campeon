# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static landing page for "La Pesca del Campeón", a wholesale fish & seafood supplier serving restaurants in Santiago, Chile. Spanish-language content throughout. Implemented from the Claude Design project "Wholesale Fish Processing Landing Page" (`La Pesca del Campeon v2.dc.html`).

No build step, no dependencies, no package manager — plain HTML, CSS and vanilla JS only.

## Running locally

Open `index.html` directly in a browser, or serve the folder:

```
npx serve .
```

There are no test, lint, or build commands — verify changes by loading the page in a browser.

## Architecture

Three files, each with a single responsibility:

- **`index.html`** — static markup for the page shell (nav, hero, contact section, footer) plus empty container elements (`#servicesGrid`, `#stepsGrid`, `#filters`, `#speciesGrid`, `#statsGrid`) that JS populates at runtime. WhatsApp CTA links (`#waLinkNav`, `#waLinkHero`, `#waLinkContact`) start with `href="#"` and are rewired by JS on load.
- **`js/script.js`** — single IIFE, no modules/imports. Contains:
  - Content data as arrays of plain objects: `SERVICES`, `STEPS`, `SPECIES`, `STATS`, `FILTER_LABELS`. To change page copy or the species catalog, edit these arrays — there is no CMS or data file.
  - A tiny DOM-builder helper (`el()`) used instead of innerHTML templating for rendering cards/grids.
  - Client-side filtering of the species catalog by cut (Todos / Filete / Entero / Medallón), matched via `normalizeLabel()` which folds accents/gender endings (e.g. "Entera" ↔ "Entero") so a species's `cuts` array doesn't need to exactly match a filter label.
  - `WHATSAPP_NUMBER` and `WHATSAPP_MESSAGE` constants build the `wa.me` deep link injected into all WhatsApp CTAs (`buildWaLink()` / `wireWhatsappLinks()`) — this is the single source of truth for the contact number and prefilled message.
  - Everything renders on `DOMContentLoaded` via `init()`.
- **`css/style.css`** — dark navy/blue/orange palette defined as CSS custom properties in `:root`. Mobile nav collapse and responsive grids handled via a single `@media (max-width: 720px)` block at the end of the file.

## Content conventions

- Photo placeholders (`.img-ph`, built by `imagePlaceholder(label)` in script.js) mark where real product photography should go. To add a real photo, replace the `imagePlaceholder(...)` call's usage with an `<img>` element — the `photo` field on each data object is currently just a placeholder label, not a file path.
- Fonts are loaded from Google Fonts in `index.html`: Bricolage Grotesque (display/headings) and Instrument Sans (body).
