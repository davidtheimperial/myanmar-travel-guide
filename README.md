# Myanmar Travel Guide

A small, dependency-free static site about Myanmar's culture, history and attractions,
with a clear travel advisory. Plain HTML, one stylesheet, one small script.

The canonical site is published on Netlify at
<https://myanmartravelguide.netlify.app/>. Every canonical tag, Open Graph URL, sitemap
entry and internal link points there.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, section cards, key facts, practical notes |
| `culture.html` | Peoples, religion, festivals, dress, food, arts, etiquette |
| `history.html` | Timeline from the Pyu city-states to the present |
| `attractions.html` | Bagan, Inle Lake, Shwedagon, Mandalay, Ngapali, Hpa-An |
| `disclaimer.html` | Travel advisory and disclaimer |
| `credits.html` | Photographer and licence credits for all media |
| `about.html` | Who writes the guide, how it is sourced, how to cite it |
| `404.html` | Custom not-found page |
| `styles.css` | All styling, including dark mode and print |
| `app.js` | Mobile menu, footer year, active nav, ambient music toggle |
| `netlify.toml` | Publish directory, pretty URLs and cache headers |
| `assets/img/` | Photographs, with WebP variants and attribution in `assets/credits.json` |
| `assets/img/og/` | 1200×630 social/Open Graph cards, one per page |
| `assets/video/` | The Bagan sunset clip shown on the attractions page |
| `robots.txt`, `sitemap.xml` | Crawler hints |

## URLs

Internal links are root-relative and extensionless (`/culture`, not `culture.html`).
Netlify's pretty URLs serve `culture.html` at `/culture`, which is the form used in
canonical tags, Open Graph URLs and the sitemap. Keep those three in agreement if you
add pages.

## Run it locally

There is no build step. Because internal links are root-relative and rely on pretty
URLs, preview with the Netlify CLI rather than a plain file server:

```sh
netlify dev --port 8889
```

Then open <http://localhost:8889>. Opening the files directly from disk will not follow
the extensionless links.

## Images

Photographs ship as JPEG (fallback) plus responsive WebP at 480/800/1200 px, wired up
with `<picture>`/`srcset`. The 1200×630 Open Graph cards live in `assets/img/og/`. If
you add or replace a photo, regenerate the variants so the markup keeps working; the
site has no runtime image processing.

## Deploy

The site is published from the `main` branch. Commit and push; Netlify rebuilds
automatically. `netlify.toml` sets the publish directory, enables pretty URLs and adds
long cache headers for assets.

```sh
git add .
git commit -m "Update content"
git push
```

## Conventions

- Every page uses the same header/footer markup so the nav and footer never drift.
- The current page is marked with `aria-current="page"` in the markup; `app.js` also
  fills it in as a fallback.
- Each page carries JSON-LD (`Organization`, `Person`, `WebPage`/`Article`,
  `BreadcrumbList`) describing the author and dates.
- Colours, spacing and type live as custom properties at the top of `styles.css`.
  Dark mode is a second block of the same variables under `prefers-color-scheme: dark`.
- No external fonts or scripts. Images and video are bundled in `assets/`; every file is
  freely licensed and attributed on `credits.html`. The ambient music is synthesised with
  the Web Audio API, so there is no audio file to download or license.

## Keeping it accurate

The advisory page refers to figures that change monthly (displacement, humanitarian need).
Re-check the linked sources before each significant update, and update the "last reviewed"
line at the bottom of `disclaimer.html` and the `dateModified` values in each page's JSON-LD.
