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
theme/             local theme (layouts: cover, stats, table, marathon; components: MarathonNav, MarathonStats, MarathonTable)
public/marathon/   race data (data/marathonN.json, marathonsN.json table pages, quotes.json) and photos (img/)
```

Each race slide is `layout: marathon` with `n: <race number>`; the layout fetches `public/marathon/data/marathon<n>.json`. Table slides (`layout: table`, `page: <n>`) read `marathons<n>.json`.

## Dependency pin

`markdown-it` is held at ^14: Slidev 53 imports `markdown-it/lib/*`, which v15 no longer exports, so builds fail with `ERR_PACKAGE_PATH_NOT_EXPORTED` on 15.

## Deployment

`.github/workflows/deploy.yml` builds with `--base /<repo>/` and deploys to GitHub Pages on every push to `main`/`master`. Enable Pages with source "GitHub Actions" in the repo settings.
