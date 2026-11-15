# My Marathon Journey

A [Slidev](https://sli.dev) deck covering 100 marathons: finish times, paces, locations, personal bests, and a stats overview across the full journey.

## Usage

```bash
pnpm install
pnpm dev       # dev server → http://localhost:3030
pnpm build     # static site → dist/
pnpm export    # PDF → exports/marathon-journey.pdf
```

## Layout

```
slides.md          the deck
data/              race data: marathon<N>.json (one per race) and quotes.json
public/marathon/   photos (img/), served at /marathon/img/
theme/             local theme: layouts, components, styles, races.ts, setup/preparser.ts
```

## Adding or removing races

The race list is driven entirely by `data/marathon<N>.json`; nothing else holds a count.

- **Slides:** `slides.md` has one placeholder slide whose frontmatter is `marathon: races`. The preparser in `theme/setup/preparser.ts` expands it into the race-log table pages (10 races per page) and one `layout: marathon` slide per data file, ordered by `id`.
- **Theme:** `theme/races.ts` bundles every data file with `import.meta.glob`, and the stats, table, navigator and progress bar all read from it.

To add a race, drop in `data/marathon<N>.json` (with `"id": N`) and, if it has its own photo, `public/marathon/img/<picture>`. In `pnpm dev`, restart the server after adding or removing a file so the slide list is regenerated.

## Dependency pin

`markdown-it` is held at ^14: Slidev 53 imports `markdown-it/lib/*`, which v15 no longer exports, so builds fail with `ERR_PACKAGE_PATH_NOT_EXPORTED` on 15.

## Deployment

`.github/workflows/deploy.yml` builds with `--base /<repo>/` and deploys to GitHub Pages on every push to `main`/`master`. Enable Pages with source "GitHub Actions" in the repo settings.
