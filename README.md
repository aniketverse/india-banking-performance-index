# India Banking Performance Index 2026 (IBPI)

A static, responsive GitHub Pages dashboard for exploring available Indian bank financial data. The interface provides metric-based rankings, listed-bank market-cap snapshot, multi-bank historical comparison, individual profiles, methodology, source register and CSV/JSON exports.

## Deploy

1. Keep `index.html` and the `data/` folder at repository root.
2. In GitHub, open **Settings → Pages**.
3. Select **Deploy from a branch**, branch `main`, folder `/ (root)` and Save.

## Data status and important limitations

This is a research prototype using a partial dataset transcribed from a research exchange. It is **not** a completed or certified Top 50 ranking. No overall composite scores are calculated. Market-cap values and several bank-year observations require independent reconciliation to source documents before analytical or investment use. Missing values are not imputed as zero.

The current profile set is limited to banks for which historical observations were supplied. The rankings view ranks only available observations for the selected metric. Peer groups, merger restatements, standalone/consolidated basis and domestic/global reporting scope must be reconciled before cross-bank scoring.

## Files

- `index.html` — dashboard UI and client-side visualisations
- `data/banks.json` — current data extract, weights, caveats and source register

## Updating data

Edit `data/banks.json` while preserving valid JSON. Add exact source URLs and page/table references for each bank-year metric in the next data release. Do not publish a composite rank until the eligible universe has passed data completeness and reconciliation checks.

## Sources

See the dashboard's Sources & Data section for RBI, DFS and bank investor-relations repositories. This project is independent research and is not investment advice.
