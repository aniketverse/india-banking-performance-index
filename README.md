# India Banking Performance Index 2026 (IBPI)

Static GitHub Pages dashboard built with HTML, CSS and vanilla JavaScript.

## Deploy to GitHub Pages
1. Create a public repository, suggested name: `india-banking-performance-index`.
2. Upload `index.html`, the `data/` folder and this `README.md` to the repository root.
3. In **Settings → Pages**, select **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then Save.
5. Open `https://aniketverse.github.io/india-banking-performance-index/` after Pages finishes deployment.

## Files
- `index.html` – responsive dashboard and visualisations.
- `data/banks.json` – bank-level data, profiles, methodology and source register.

## Data status
This is a research prototype populated with the partial FY26 dataset transcribed from the preceding research conversation. It deliberately does **not** publish an overall Top 50 ranking or composite scores. Several values and market-cap figures require independent reconciliation against the linked annual reports, RBI/DFS datasets and NSE/BSE historical data. Do not use the current market snapshot for investment decisions.

## Updating data
Edit `data/banks.json`. Keep the JSON valid. Do not replace missing values with zero. Add a source URL and precise report/table/page reference for every newly verified metric. For a certified ranking, reconcile all eligible scheduled commercial banks across FY22–FY26, adjust mergers, standardise standalone Indian operations, and document missing-data treatment.
