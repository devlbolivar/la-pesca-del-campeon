# La Pesca del Campeón — Landing Page

Static landing page for a wholesale fish & seafood supplier serving restaurants in Santiago, Chile. Implemented from the Claude Design project "Wholesale Fish Processing Landing Page" (`La Pesca del Campeon v2.dc.html`).

No build step or dependencies — plain HTML, CSS and vanilla JS.

## Structure

```
index.html        Markup for all sections (nav, hero, servicios, proceso, especies, confianza, contacto)
css/style.css      Styling (dark navy / blue / orange palette, responsive grid layout)
js/script.js       Content data (services, steps, species, stats) + species filter interactivity + WhatsApp link building
```

## Run locally

Just open `index.html` in a browser, or serve the folder:

```
npx serve .
```

## Notes

- WhatsApp CTAs deep-link to `wa.me` with a prefilled message, built from the phone number in `js/script.js` (`WHATSAPP_NUMBER`).
- The "Catálogo de especies" section filters client-side by cut (Todos / Filete / Entero / Medallón).
- Photo placeholders (`.img-ph`) mark where real product photography should go — swap each `imagePlaceholder(...)` call's label for an `<img>` once photos are available.
- Fonts: Bricolage Grotesque (display) + Instrument Sans (body), loaded from Google Fonts.
