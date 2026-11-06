# India Banking Performance Index 2026 (IBPI) – V3

V3 adds a calculated **PSB FY26 Three-Factor Pilot Score** for the 12 Indian public-sector banks. The score is a peer-relative research pilot, not the completed all-bank IBPI.

## Pilot score inputs and weights

- FY26 net profit (absolute earnings scale): 40%
- FY26 CRAR: 30%
- FY26 net-profit growth over FY25: 30%

Each input is converted into a percentile rank within the 12-bank PSB cohort. Highest value = 100; lowest = 0; ties receive average rank. Weighted contributions are summed to 100. Values and weights are stored in `data/banks.json`; the browser calculates the score from those observations.

## Crucial limitations

- This score covers **only 12 public-sector banks**. It must not be compared with private banks, small finance banks or foreign banks.
- Absolute net profit is an earnings-scale metric, not ROA/ROE or profitability efficiency.
- The pilot does not include asset quality, five-year growth, liquidity, cost-to-income, business per employee or resilience.
- The full seven-dimension fundamental IBPI and separate investment index are **not calculated**.
- Market-cap values in the existing dataset remain provisional and are excluded from the pilot.
- The pilot is relative to its cohort; changing cohort or weights changes scores.

## Sources

Primary source for FY25 and FY26 PSB net profit and CRAR: [Department of Financial Services – Banking Analytics](https://www.financialservices.gov.in/banking-analytics). The dashboard reproduces the published 12-bank table.

Sector context: [PIB, 12 May 2026 – PSBs FY26 performance](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2260203&lang=1&reg=6).

## Deploy to GitHub Pages

Keep `index.html` and the `data/` directory at repository root. Upload/replace `index.html`, `README.md`, and `data/banks.json`, then commit to `main`. GitHub Pages should redeploy automatically.

## Files

- `index.html` – responsive dashboard, including pilot scoring engine
- `data/banks.json` – source observations, methodology, existing research profiles and scoring configuration

This is independent research, not investment advice. The score is a limited pilot; do not treat it as a certified ranking of India's banks.
