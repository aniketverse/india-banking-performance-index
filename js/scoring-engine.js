/* IBPI 2026 V4 scoring engine. Browser and Node compatible. */
(function(root){
  'use strict';
  const DIMENSIONS=[
    {key:'scale',name:'Banking scale',weight:20,metrics:[['fy26_assets_crore','higher','log'],['fy26_deposits_crore','higher','log'],['fy26_advances_crore','higher','log']]},
    {key:'profitability',name:'Profitability',weight:20,metrics:[['fy26_net_profit_crore','higher','log'],['fy26_roa_pct','higher'],['fy26_roe_pct','higher'],['fy26_nim_pct','higher']]},
    {key:'growth',name:'Growth',weight:15,metrics:[['assets_cagr_5y_pct','higher'],['deposits_cagr_5y_pct','higher'],['advances_cagr_5y_pct','higher'],['profit_cagr_5y_pct','higher']]},
    {key:'assetQuality',name:'Asset quality',weight:15,metrics:[['fy26_gnpa_pct','lower'],['fy26_nnpa_pct','lower'],['fy26_pcr_pct','higher'],['fy26_slippage_pct','lower'],['fy26_credit_cost_pct','lower']]},
    {key:'capital',name:'Capital and liquidity',weight:10,metrics:[['fy26_crar_pct','higher'],['fy26_cet1_pct','higher'],['fy26_lcr_pct','higher']]},
    {key:'efficiency',name:'Operational efficiency',weight:10,metrics:[['fy26_cost_income_pct','lower'],['fy26_business_per_employee_crore','higher'],['fy26_profit_per_employee_lakh','higher']]},
    {key:'resilience',name:'Resilience',weight:10,metrics:[['profit_cv_5y_pct','lower'],['roa_volatility_5y_pct','lower'],['provision_buffer_pct','higher']]}
  ];
  const INPUT_METRICS=DIMENSIONS.flatMap(d=>d.metrics.map(m=>m[0]));
  function number(v){if(v===null||v===undefined||String(v).trim()==='')return null;let n=Number(String(v).replace(/,/g,''));return Number.isFinite(n)?n:null;}
  function cagr(start,end,years=4){if(!(start>0&&end>0&&years>0))return null;return (Math.pow(end/start,1/years)-1)*100;}
  function normaliseRow(row){const r={...row};
    for(const k of INPUT_METRICS)r[k]=number(r[k]);
    [['assets_cagr_5y_pct','fy22_assets_crore','fy26_assets_crore'],['deposits_cagr_5y_pct','fy22_deposits_crore','fy26_deposits_crore'],['advances_cagr_5y_pct','fy22_advances_crore','fy26_advances_crore'],['profit_cagr_5y_pct','fy22_net_profit_crore','fy26_net_profit_crore']].forEach(([out,a,b])=>{if(r[out]===null)r[out]=cagr(number(r[a]),number(r[b]));});
    r.bank_name=String(r.bank_name||r.bank||'').trim();r.category=String(r.category||'').trim();return r;
  }
  function percentile(value,values,direction){
    if(!Number.isFinite(value)||values.length<3)return null;
    const s=values.slice().sort((a,b)=>a-b);let first=s.findIndex(x=>x===value),last=s.lastIndexOf(value);let pct=((first+last)/2)/(s.length-1)*100;
    return direction==='lower'?100-pct:pct;
  }
  function scoreRows(input){
    const rows=input.map(normaliseRow).filter(r=>r.bank_name&&r.category);
    const seen=new Set();for(const r of rows){const id=(r.category+'|'+r.bank_name).toLowerCase();if(seen.has(id))throw new Error('Duplicate bank/category row: '+r.bank_name);seen.add(id);}
    const cohorts=new Map();rows.forEach(r=>{const k=r.category||'Unclassified';if(!cohorts.has(k))cohorts.set(k,[]);cohorts.get(k).push(r)});
    const results=[];
    for(const [category,cohort] of cohorts){
      const metricScores=new Map();
      for(const d of DIMENSIONS)for(const [metric,direction,transform] of d.metrics){
        const vals=cohort.map(r=>{const v=r[metric];if(!Number.isFinite(v))return null;if(transform==='log'&&v<0)return null;return transform==='log'?Math.log1p(v):v;}).filter(v=>v!==null);
        if(vals.length>=3){
          cohort.forEach(r=>{let raw=r[metric];if(!Number.isFinite(raw)|| (transform==='log'&&raw<0))return;let v=transform==='log'?Math.log1p(raw):raw;let p=percentile(v,vals,direction);if(p!==null){if(!metricScores.has(r.bank_name))metricScores.set(r.bank_name,{});metricScores.get(r.bank_name)[metric]=p;}});
        }
      }
      cohort.forEach(r=>{
        const ms=metricScores.get(r.bank_name)||{};let dims={},dimCount=0,metricCount=0;
        DIMENSIONS.forEach(d=>{const v=d.metrics.map(m=>ms[m[0]]).filter(Number.isFinite);if(v.length){dims[d.key]=v.reduce((a,b)=>a+b,0)/v.length;dimCount++;metricCount+=v.length;}else dims[d.key]=null;});
        const dataCompleteness=INPUT_METRICS.filter(k=>Number.isFinite(r[k])).length/INPUT_METRICS.length*100;
        const provenanceFields=['source_url','source_page_or_table','accounting_basis','scope_basis'];
        const missingProvenance=provenanceFields.filter(k=>!String(r[k]||'').trim());
        if(!/^https?:\/\//i.test(String(r.source_url||''))) { if(!missingProvenance.includes('source_url')) missingProvenance.push('source_url (must be http/https URL)'); }
        const eligible=dimCount===7&&metricCount>=15&&missingProvenance.length===0;
        const score=eligible?DIMENSIONS.reduce((s,d)=>s+(dims[d.key]*d.weight/100),0):null;
        let reason=eligible?'Meets 7-dimension, 15-metric and provenance gates':`Score withheld: ${dimCount}/7 dimensions, ${metricCount}/25 metrics`+(missingProvenance.length?`; missing provenance: ${missingProvenance.join(', ')}`:'');
        results.push({bank_name:r.bank_name,category,score,dimensions:dims,dimensionsCovered:dimCount,metricsScored:metricCount,dataCompleteness,eligible,reason});
      });
    }
    // Rank only eligible banks within category; no cross-category rank.
    for(const category of cohorts.keys()){
      const eligible=results.filter(r=>r.category===category&&r.eligible).sort((a,b)=>b.score-a.score||a.bank_name.localeCompare(b.bank_name));
      let lastScore=null,lastRank=0;eligible.forEach((r,i)=>{r.rank=lastScore!==null&&Math.abs(r.score-lastScore)<1e-9?lastRank:i+1;lastScore=r.score;lastRank=r.rank;});
      // Investment view: same category and exact same market-data date are mandatory.
      const dates=[...new Set(cohorts.get(category).map(r=>String(r.market_data_asof_date||'').trim()).filter(Boolean))];
      dates.forEach(date=>{
        const peers=cohorts.get(category).filter(r=>String(r.market_data_asof_date||'').trim()===date);
        const candidates=peers.map(r=>({input:r,result:results.find(x=>x.bank_name===r.bank_name&&x.category===category)})).filter(x=>x.result&&x.result.eligible&&number(x.input.pb_ratio)>0&&number(x.input.pe_ratio)>0&&number(x.input.shareholder_return_1y_pct)!==null&&number(x.input.shareholder_return_3y_cagr_pct)!==null);
        if(candidates.length<3)return;
        const pbVals=candidates.map(x=>number(x.input.pb_ratio)),peVals=candidates.map(x=>number(x.input.pe_ratio));
        const r1Vals=candidates.map(x=>number(x.input.shareholder_return_1y_pct)),r3Vals=candidates.map(x=>number(x.input.shareholder_return_3y_cagr_pct));
        const investRows=[];
        candidates.forEach(({input:r,result:base})=>{
          const pb=number(r.pb_ratio),pe=number(r.pe_ratio),r1=number(r.shareholder_return_1y_pct),r3=number(r.shareholder_return_3y_cagr_pct);
          const valuation=(percentile(pb,pbVals,'lower')+percentile(pe,peVals,'lower'))/2;
          const shareholder=(percentile(r1,r1Vals,'higher')+percentile(r3,r3Vals,'higher'))/2;
          base.investmentScore=base.score*.70+valuation*.15+shareholder*.15;
          base.valuationScore=valuation;base.shareholderReturnScore=shareholder;base.marketDataAsOf=date;
          investRows.push(base);
        });
        investRows.sort((a,b)=>b.investmentScore-a.investmentScore||a.bank_name.localeCompare(b.bank_name));
        let li=null,lr=0;investRows.forEach((r,i)=>{r.investmentRank=li!==null&&Math.abs(r.investmentScore-li)<1e-9?lr:i+1;li=r.investmentScore;lr=r.investmentRank;});
      });
    }
    return results.sort((a,b)=>a.category.localeCompare(b.category)||(a.eligible!==b.eligible?(a.eligible?-1:1):(a.rank||999)-(b.rank||999))||a.bank_name.localeCompare(b.bank_name));
  }
  function parseCSV(text){
    const rows=[];let row=[],field='',quoted=false;
    for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(quoted){if(c==='"'&&n==='"'){field+='"';i++;}else if(c==='"')quoted=false;else field+=c;}else{if(c==='"')quoted=true;else if(c===','){row.push(field);field='';}else if(c==='\n'){row.push(field);rows.push(row);row=[];field='';}else if(c!=='\r')field+=c;}}
    if(field.length||row.length){row.push(field);rows.push(row);}if(!rows.length)return [];
    const headers=rows.shift().map(h=>h.trim().replace(/^\uFEFF/,''));return rows.filter(r=>r.some(x=>String(x).trim()!=='')).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
  }
  root.IBPIScoring={DIMENSIONS,INPUT_METRICS,normaliseRow,percentile,scoreRows,parseCSV};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.IBPIScoring;
})(typeof window!=='undefined'?window:globalThis);
