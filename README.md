# India Banking Performance Index 2026 — V4

Static GitHub Pages dashboard for bank-level performance research.

## V4 contents
- RBI-based bank-universe registry: 12 PSBs, 21 domestic private-sector banks, 11 SFBs, plus 44 foreign-bank operations as the RBI FY25 baseline count.
- Existing 12-bank PSB three-factor pilot score (FY26 net-profit scale 40%, CRAR 30%, FY26 net-profit growth 30%). This is a peer-group pilot, not the final IBPI.
- Seven-dimension fundamental scoring workbench. Upload a completed CSV based on `data/full-index-input-template.csv`; scores are calculated client-side within category cohorts.
- Bank profile comparison and source registry. Axis Bank five-year ratios and AU SFB FY26 ratios have been updated from their official FY26 investor-report sources.
- Export of the full-index input template, PSB pilot, historical profile data and universe registry.

## Important data status
The final Top 50 and investment index are not certified in V4. The complete FY22–FY26 audited dataset for all eligible banks, named foreign-bank India operations and same-date market/valuation series has not yet been reconciled. V4 does not fill gaps with estimates.

## Deploy
Upload these files to the root of the existing repository, preserving paths:
```text
index.html
README.md
data/banks.json
data/psb-pilot-scores.csv
data/full-index-input-template.csv
data/bank-universe.csv
js/scoring-engine.js
```
Then commit to `main`. GitHub Pages should deploy automatically.

## CSV schema for full-index scoring
Use `data/full-index-input-template.csv`. Category values must be consistent across peer records (for example: `Public Sector`, `Private Sector`, `Small Finance Bank`, `Foreign Bank`). FY22/FY26 endpoint values are used to derive 4-year CAGR. Source URL, page/table, accounting basis and scope basis should be completed.

The scoring workbench requires each bank to have at least one metric in every dimension and at least 15 of 25 indicator fields. A metric is normalised only when at least three banks in the same category provide that metric. Source URL, report page/table, accounting basis and scope basis are mandatory. Banks failing the gate receive no composite score or rank.

The optional investment score is calculated only when fundamental eligibility is met and at least three peers in the same category have P/B, P/E, 1-year total shareholder return and 3-year CAGR on the exact same market-data date. It uses 70% fundamental score, 15% valuation and 15% shareholder returns. Market capitalisation is a separate size ranking, not a score input.

## Official source register
- RBI, Report on Trend and Progress of Banking in India 2024-25: https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23639
- RBI, List of Scheduled Commercial Banks: https://systemhealth.rbi.org.in/Scripts/bs_viewcontent.aspx_Id%3D3657.html
- RBI, Agency bank list (4 August 2026): https://m.rbi.org.in/CommonPerson/english/scripts/content.aspx?id=2139
- DFS Banking Analytics: https://www.financialservices.gov.in/banking-analytics
- Axis Bank Integrated Annual Report FY26: https://www.axis.bank.in/annual-reports/2025-2026/index.html
- AU SFB Q4 FY26 investor presentation: https://www.au.bank.in/pdfs/quaterly-reports/year-25/investors-presentation/Q4FY26-PPT.pdf
- ICICI Bank FY26 Annual Report: https://www.icici.bank.in/about-us/annual/2026

## Data caution
This is analytical research, not investment advice. Ratios should be compared using consistent standalone India-operation basis, audited reporting period, regulatory definitions and merger-restated series. The existing market-cap snapshot dated 4 November 2026 remains revalidation-required and is not used to generate investment scores.
