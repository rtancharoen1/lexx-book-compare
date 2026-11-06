# Lexx — The book

Personal study site for **Lexx (Rungroj Tancharoen)**. One calm screen to scan a watchlist, then open a single name. Built for later hosting on lxxt.life.

**Not investment advice.**

## What is live vs filed

- **Quotes and market caps** for public names come from live public APIs at request time (Yahoo Finance charts; Nasdaq for US capitalization; Naver + a live FX rate for SK Hynix). Fetches are cached for about 60 seconds. If a fetch fails, that field is shown empty — numbers are never invented.
- **Fear & Greed** and **news rails** come only from Deki’s latest file in `data/digests/YYYY-MM-DD.json`. The site does not scrape headlines or fetch a live Fear & Greed score that could contradict the digest.
- **SpaceX (SPCX)** is quoted only when a public API returns a real listing. **K3** stays “ticker TBD” with no fake symbol or price.

## Local

```bash
npm install
npm run dev
```

```bash
npm run build
```

No API keys. Vercel-ready Next.js App Router.

## Data for Deki

See `data/digests/README.md`. Copy `/workspace/investment-dashboard/digests/YYYY-MM-DD.json` into `data/digests/` without rewriting numbers or headlines.
