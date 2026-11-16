# V5 change log

- Versioned the release as V5 and refreshed the source metadata to 15 November 2026.
- Added the official DFS Banking Analytics URL as the primary bank-wise FY25/FY26 PSB pilot source.
- Added the PIB FY26 PSB aggregate release as contextual source material, without substituting aggregate values for bank-wise observations.
- Added strict provenance and numeric-field validation to the full-index scoring engine.
- Added separate market-data validation so market issues withhold investment scores but do not suppress valid fundamental scores.
- Added automated tests for score eligibility, invalid data, missing provenance, investment gating and duplicate records.
- Added a PSB source-audit CSV.
