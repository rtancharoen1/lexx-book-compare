# Data

## Daily digest (source of truth for news + Fear & Greed)

Deki writes `/workspace/investment-dashboard/digests/YYYY-MM-DD.json`. Copy it to `data/digests/YYYY-MM-DD.json` without rewriting numbers or headlines. The site reads the latest dated file.

See `data/digests/README.md`.

## Book

`data/book.json` holds display names, optional thesis, private / TBD flags, and tickers. Leave `thesis` and `whatChanged` as `""` rather than inventing. SpaceX is quoted only when a public API returns ticker `SPCX`. K3 stays ticker TBD.

## Legacy rail files

`data/rails/*.json` are unused empty arrays kept so older copy steps do not break. New stories belong in the digest.
