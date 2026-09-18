# Daily digest (Deki)

Deki drops a dated file each day:

```
/workspace/investment-dashboard/digests/YYYY-MM-DD.json
```

**Copy that file here without rewriting numbers or headlines:**

```
data/digests/YYYY-MM-DD.json
```

The site reads the latest `data/digests/YYYY-MM-DD.json` by filename date. It does not scrape news or fetch a live Fear & Greed score. If a file is missing or a field is empty, the UI shows an empty state.

## Shape

```json
{
  "date": "2026-08-23",
  "asOfIct": "…",
  "fearGreed": {
    "value": 55.17,
    "label": "Neutral",
    "source": "…",
    "read": "…"
  },
  "nbis": [{ "headline": "", "why": "", "source": "", "url": "" }],
  "aiInfra": [{ "headline": "", "why": "", "source": "", "url": "", "ticker": "NVDA" }],
  "macro": [{ "headline": "", "why": "", "source": "", "url": "" }],
  "soWhat": ["", "", "", ""]
}
```

| Field | Use |
| --- | --- |
| `fearGreed.value` + `label` | Meter needle and classification. Never invent. Weekend reprints stay as written. |
| `fearGreed.source` + `read` | Meter caption. |
| `nbis` / `aiInfra` / `macro` | The three rails. Show headline, why, source, link. Skip items missing headline or url. |
| `aiInfra[].ticker` | Optional name tag on an AI-infrastructure story. |
| `soWhat` | Optional four-line strip on the book. |

## Copy step

```bash
cp /workspace/investment-dashboard/digests/YYYY-MM-DD.json data/digests/YYYY-MM-DD.json
```

Do not change `value`, headlines, or URLs while copying.

## 2026-08-23

Weekend reprint. Fear & Greed is **55.17 Neutral** from Friday 21 August; the CNN page had no live weekend number. The file in this tree is Deki’s original: 4 NBIS, 6 AI-infra, 4 macro, 4 soWhat. Do not rewrite numbers or headlines.
