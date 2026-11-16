# India Banking Performance Index 2026 — V5

Static GitHub Pages dashboard and local scoring workbench.

## What changed in V5
- Retains the 12-bank FY26 PSB three-factor pilot score (profit scale 40%, CRAR 30%, FY26 net-profit growth 30%). This is a calculated PSB-cohort pilot, **not** the full IBPI.
- Adds strict input validation to the seven-dimension scoring engine. Invalid numeric entries and missing/invalid source provenance block a fundamental score rather than being silently converted into eligible records.
- Market-data validation is separate: a malformed market date or market field withholds the investment score without invalidating an otherwise eligible fundamental score.
- Adds a reproducible Node.js test suite covering eligible scoring, missing provenance, invalid numeric values, investment-data gating and duplicate-bank detection.
- Preserves the RBI-based bank-universe registry, bank profiles, downloads and client-side CSV workbench.

## Current score status
The PSB pilot is calculated. The full fundamental and investment Top 50 are **not yet calculated or certified** because the complete, comparable FY22–FY26 bank-wise audited dataset and same-date market/valuation series are not yet reconciled. No missing value is treated as zero. The software will calculate scores when a completed CSV passes the published data gates.

## Deploy to GitHub Pages
Upload the contents of this package to the root of the existing repository, preserving this structure:

```text
index.html
README.md
data/banks.json
data/psb-pilot-scores.csv
data/full-index-input-template.csv
data/bank-universe.csv
js/scoring-engine.js
tests/scoring-engine.test.js
```

Commit to `main`; GitHub Pages should rebuild automatically. This package has not been pushed to GitHub by this workflow.

## Run tests locally
Requires Node.js:

```bash
node tests/scoring-engine.test.js
```

Expected output: `IBPI V5 scoring-engine tests: PASS`.

## Full-index input and gates
Use `data/full-index-input-template.csv`. Each row must represent one bank, one category and a consistent accounting/scope basis. Include a direct HTTP(S) source URL, source page/table, accounting basis and scope basis. Growth rates are derived from FY22 and FY26 endpoints where available. A fundamental score requires all seven dimensions, at least 15 of 25 scored indicators, and complete provenance. Each metric percentile requires at least three comparable banks in the same peer category.

An investment score additionally requires positive P/B and P/E, 1-year and 3-year shareholder returns, and a valid ISO market-data date (`YYYY-MM-DD`) shared by at least three eligible peers in the same category. Market cap is displayed as a separate size measure, not a score input.

## Primary official sources
- DFS Banking Analytics: https://www.financialservices.gov.in/banking-analytics
- PIB / Ministry of Finance, PSB FY26 performance (12 May 2026): https://www.pib.gov.in/PressReleasePage.aspx?PRID=2260203&lang=1&reg=3
- RBI, Report on Trend and Progress of Banking in India 2024-25: https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23639
- RBI, Statistical Tables Relating to Banks in India: https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Statistical%20Tables%20Relating%20to%20Banks%20in%20India

## Research cautions
- The FY25 RBI bank universe count is a baseline, not a claim that all 88 institutions are currently eligible for one combined ranking.
- Public-sector, private-sector, small-finance and foreign banks must be compared within appropriate peer groups; no cross-category overall rank is published by this engine.
- Merger discontinuities, standalone/consolidated differences, India/global scope and restatements require explicit reconciliation.
- The market-cap snapshot inherited from the research dataset is dated 4 November 2026 and remains flagged for revalidation; it is not used to generate investment scores.
- This is independent research, not investment advice.
