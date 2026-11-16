const assert = require('node:assert/strict');
const E = require('../js/scoring-engine.js');

function row(name, i) {
  const r = {
    bank_name: name, category: 'Public Sector',
    source_url: 'https://example.gov.in/annual-report.pdf',
    source_page_or_table: 'Standalone financial highlights, p. 10',
    accounting_basis: 'Standalone', scope_basis: 'India operations',
    fy22_assets_crore: 10000 + i * 1000, fy26_assets_crore: 15000 + i * 2000,
    fy22_deposits_crore: 8000 + i * 800, fy26_deposits_crore: 12000 + i * 1500,
    fy22_advances_crore: 7000 + i * 700, fy26_advances_crore: 11000 + i * 1200,
    fy22_net_profit_crore: 100 + i * 20, fy26_net_profit_crore: 200 + i * 40,
    fy26_roa_pct: 0.8 + i * 0.1, fy26_roe_pct: 12 + i,
    fy26_nim_pct: 2.5 + i * 0.1, fy26_gnpa_pct: 4 - i * 0.5,
    fy26_nnpa_pct: 1.2 - i * 0.1, fy26_pcr_pct: 80 + i * 2,
    fy26_crar_pct: 14 + i, fy26_cet1_pct: 10 + i * 0.5,
    fy26_lcr_pct: 110 + i * 5, fy26_cost_income_pct: 55 - i * 2,
    fy26_slippage_pct: 1.5 - i * 0.1, fy26_credit_cost_pct: 0.8 - i * 0.1,
    fy26_business_per_employee_crore: 18 + i, fy26_profit_per_employee_lakh: 8 + i,
    profit_cv_5y_pct: 25 - i * 2, roa_volatility_5y_pct: 0.3 - i * 0.02,
    provision_buffer_pct: 90 + i,
    market_data_asof_date: '2026-11-13', market_cap_crore: 50000 + i * 1000,
    pb_ratio: 1.2 + i * 0.1, pe_ratio: 8 + i,
    shareholder_return_1y_pct: 5 + i * 3, shareholder_return_3y_cagr_pct: 8 + i * 2
  };
  return r;
}

const rows = [row('Bank A', 0), row('Bank B', 1), row('Bank C', 2)];
const scored = E.scoreRows(rows);
assert.equal(scored.length, 3);
assert.ok(scored.every(x => x.eligible), 'complete rows should pass the fundamental gate');
assert.ok(scored.every(x => Number.isFinite(x.score)), 'eligible rows should have numeric scores');
assert.ok(scored.every(x => Number.isFinite(x.investmentScore)), 'same-date complete peers should have investment scores');

const missing = row('Missing Source', 0); missing.source_url = '';
const blocked = E.scoreRows([missing, row('Peer B', 1), row('Peer C', 2)]).find(x => x.bank_name === 'Missing Source');
assert.equal(blocked.eligible, false);
assert.ok(blocked.validationErrors.some(x => x.includes('source_url')));

const invalid = row('Invalid Numeric', 0); invalid.fy26_crar_pct = 'not-a-number';
const invalidResult = E.scoreRows([invalid, row('Peer D', 1), row('Peer E', 2)]).find(x => x.bank_name === 'Invalid Numeric');
assert.equal(invalidResult.eligible, false);
assert.ok(invalidResult.validationErrors.some(x => x.includes('fy26_crar_pct')));

const badMarket = [row('Market A', 0), row('Market B', 1), row('Market C', 2)];
badMarket[0].market_data_asof_date = '13-11-2026';
const badMarketResults = E.scoreRows(badMarket);
assert.ok(badMarketResults.every(x => x.eligible), 'bad market date must not invalidate fundamental score');
assert.equal(badMarketResults.find(x => x.bank_name === 'Market A').investmentScore, undefined);

assert.throws(() => E.scoreRows([row('Duplicate', 0), row('Duplicate', 1)]), /Duplicate bank/);
assert.equal(E.cagr, undefined, 'internal helpers are not exposed');
console.log('IBPI V5 scoring-engine tests: PASS');
