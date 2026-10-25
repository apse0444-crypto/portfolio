# Your Name — Portfolio

A single-page personal portfolio built with plain HTML, CSS, and a small amount of
vanilla JavaScript. No build step, no dependencies, no framework — it deploys as-is
to Cloudflare Pages (or any static host).

## Structure

```
.
├── index.html        # page content — edit this first
├── styles.css        # design tokens, layout, responsive rules
├── script.js         # theme toggle, mobile menu, scrollspy, reveal animations
├── 404.html          # not-found page
├── _headers          # Cloudflare Pages security + cache headers
├── robots.txt
├── sitemap.xml
└── assets/
    ├── favicon.svg
    └── og.svg        # social share image (1200×630)
```

## Before you publish

Search and replace these placeholders:

| Placeholder | Where |
| --- | --- |
| `Your Name` | `index.html`, `404.html`, `assets/og.svg`, this README |
| `YN` monogram | `index.html` brand mark, `assets/favicon.svg` |
| `hello@example.com` | `index.html` (hero, about, contact, footer) |
| `Somewhere, Earth` / `UTC+1` | `index.html` hero + about |
| Project titles, descriptions, tags | `index.html` `#work` |
| Writing entries | `index.html` `#writing` |
| Social links (`github.com`, `linkedin.com`, `x.com`) | `index.html` footer |
| `your-domain` | `sitemap.xml`, `index.html` `<meta property="og:*">` |

A quick sweep:

```sh
grep -rn "Your Name\|hello@example.com\|example.com" .
```

## Preview locally

```sh
python3 -m http.server 4321
# open http://localhost:4321
```

## Publish to GitHub

```sh
git init -b main
git add .
git commit -m "feat: add portfolio site"
gh repo create portfolio --public --source=. --remote=origin --push
```

## Connect to Cloudflare later

### Option A — Pages with Git integration (recommended)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorise GitHub and pick the `portfolio` repository.
3. Build settings:
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
4. **Save and Deploy.** The site goes live at `portfolio.pages.dev`.
5. Every push to `main` redeploys; other branches get preview URLs.
6. Add a custom domain under **Custom domains**, then update `sitemap.xml` and the
   `og:image` / `og:url` meta tags to the real domain.

### Option B — direct upload from the CLI

```sh
npx wrangler pages deploy . --project-name portfolio
```

### Option C — Workers static assets

If you'd rather serve it from a Worker:

```sh
npx wrangler deploy --assets . --name portfolio
```

Notes:

- `_headers` is honoured by Pages (and Workers static assets) — no extra config needed.
- The `fonts.googleapis.com` request in `index.html` is the only third-party call.
  Remove it and switch `--font-display` / `--font-sans` / `--font-mono` in
  `styles.css` to system font stacks for a fully self-contained page.
- Everything is static, so there is no runtime, no cold start, and no monthly cost.

## Editing guide

- **Colours and type** live in `:root` at the top of `styles.css`. The dark palette is
  the `[data-theme="dark"]` block immediately below it.
- **Adding a project**: copy one `<li class="project" data-reveal>` block in `#work`.
  The list is a single-column ledger, so no grid tweaks are required.
- **Adding a post**: copy one `<li>` in `#writing`.
- The theme choice is stored in `localStorage` under the key `theme`; until a visitor
  picks one, the page follows `prefers-color-scheme`.

## Licence

Content is yours. Code is MIT.
