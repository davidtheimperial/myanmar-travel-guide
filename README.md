# Myanmar Travel Guide

A small, dependency-free static site about Myanmar's culture, history and attractions,
with a clear travel advisory. Plain HTML, one stylesheet, one small script.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, section cards, key facts, practical notes |
| `culture.html` | Peoples, religion, festivals, dress, food, arts, etiquette |
| `history.html` | Timeline from the Pyu city-states to the present |
| `attractions.html` | Bagan, Inle Lake, Shwedagon, Mandalay, Ngapali, Hpa-An |
| `disclaimer.html` | Travel advisory and disclaimer |
| `404.html` | Custom not-found page for GitHub Pages |
| `styles.css` | All styling, including dark mode and print |
| `app.js` | Mobile menu behaviour, footer year, active nav |
| `robots.txt`, `sitemap.xml` | Crawler hints |

## Run it locally

No build step. Any static server works:

```sh
python -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly from disk also works,
including the mobile menu, because everything is relative and same-origin.

## Deploy

The site is published from the `main` branch of the GitHub Pages repository.
Commit and push; Pages rebuilds automatically.

```sh
git add .
git commit -m "Rework layout, navigation and content"
git push
```

## Conventions

- Every page uses the same header/footer markup so the nav and footer never drift.
- The current page is marked with `aria-current="page"` in the markup; `app.js` also
  fills it in as a fallback.
- Colours, spacing and type live as custom properties at the top of `styles.css`.
  Dark mode is a second block of the same variables under `prefers-color-scheme: dark`.
- No external fonts, images or scripts, so the site loads fast and works offline.

## Keeping it accurate

The advisory page refers to figures that change monthly (displacement, humanitarian need).
Re-check the linked sources before each significant update, and update the "last reviewed"
line at the bottom of `disclaimer.html`.
