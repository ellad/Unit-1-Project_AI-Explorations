import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

const source = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
function calculator() {
  let script = source.match(/<script is:inline define:vars=\{\{\}\}>([\s\S]*?)<\/script>/)[1];
  script = script.replace("    document.addEventListener('astro:page-load', init);", `
    globalThis.calculator = { state, activityValues, digitalLifeTotals, digitalComparisonRows, formatPair, aiDailyTriple, codingProjectTotals, reportHTML, buildSummaryText, buildShareURL, readURL, routerValues, routerComparisonRow, pieContributions, projectComparisonRows };
    document.addEventListener('astro:page-load', init);`);
  const context = vm.createContext({ URLSearchParams, location: { origin: 'https://example.test', pathname: '/', hash: '#k=carbon&l=eu&h=big&v=dhi&d=heavy&f=often&r=0-0-12-2' }, document: { readyState: 'loading', addEventListener() {} } });
  vm.runInContext(script, context);
  return context.calculator;
}
function close(actual, expected) { assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`); }
const copy = (value) => JSON.parse(JSON.stringify(value));

test('zero hours produce zero activity totals', () => {
  const c = calculator();
  assert.deepEqual(copy(c.digitalLifeTotals()), { kwh:[0,0], carbon:[0,0], water:[0,0] });
});

test('one-hour fixtures preserve streaming carbon and gaming endpoints', () => {
  const c = calculator();
  Object.assign(c.state.activities, {streaming:1,videoCall:1,gaming:1});
  for (const [id, kwh, carbon] of [['streaming',[0.077,0.077],[36,36]],['videoCall',[0.049,0.049],[18.8356,18.8356]],['gaming',[0.160,0.305],[61.504,117.242]]]) {
    const v = c.activityValues(id);
    for (let i=0;i<2;i++) {
      close(v.kwh[i],kwh[i]); close(v.carbon[i],carbon[i]);
      close(v.water[i],kwh[i]*1.77914353848);
    }
  }
  const total = c.digitalLifeTotals();
  close(total.kwh[0],0.286); close(total.kwh[1],0.431);
  close(total.carbon[0],116.3396); close(total.carbon[1],172.0776);
  const yearlyGaming = c.digitalComparisonRows(365).find(r=>r.label.startsWith('Gaming'));
  close(yearlyGaming.low,22448.96); close(yearlyGaming.high,42793.33);
  assert.equal(c.formatPair([1,1],String),'1');
  assert.equal(c.formatPair([1,2],String),'1–2');
});

test('location changes derived carbon only; fractional hours scale independently', () => {
  const c = calculator();
  Object.assign(c.state.activities,{streaming:1,videoCall:1,gaming:0.5});
  const streaming = copy(c.activityValues('streaming'));
  const water = copy(c.activityValues('videoCall').water);
  c.state.loc='eu';
  assert.deepEqual(copy(c.activityValues('streaming')),streaming);
  assert.deepEqual(copy(c.activityValues('videoCall').water),water);
  close(c.activityValues('videoCall').carbon[0],10.284953);
  close(c.activityValues('gaming').kwh[0],0.08);
  close(c.activityValues('gaming').kwh[1],0.1525);
  assert.equal(c.state.activities.streaming,1);
  assert.equal(c.state.activities.videoCall,1);
});

test('activity edits cannot alter AI or coding totals; router is excluded', () => {
  const c=calculator();
  c.state.rows=[{model:'gpt-5.5',size:'chat',count:2,retry:3}];
  c.state.images=[{count:1,retry:2}]; c.state.videos=[{count:1,retry:1,duration:8}];
  c.state.codingSessions=[{model:'gpt-5.5',lines:1500}];
  const ai=copy(c.aiDailyTriple('carbon')), project=copy(c.codingProjectTotals());
  c.state.activities.gaming=24; c.state.activities.streaming=1.5;
  assert.deepEqual(copy(c.aiDailyTriple('carbon')),ai);
  assert.deepEqual(copy(c.codingProjectTotals()),project);
  const digital=copy(c.digitalLifeTotals()); c.state.routerWatts=999;
  assert.deepEqual(copy(c.digitalLifeTotals()),digital);
});

test('social-media source minutes convert to hours before energy and grid calculations', () => {
  const c=calculator(); c.state.activities.social=1;
  const value=c.activityValues('social');
  close(value.kwh[0],0.00350982); close(value.kwh[1],0.00350982);
  close(value.carbon[0],1.349174808); close(value.water[0],0.0062444735742278736);
  const annual=c.digitalComparisonRows(365).find(r=>r.label.startsWith('Social media'));
  close(annual.low,492.44880492);
  c.state.loc='eu'; close(c.activityValues('social').carbon[0],0.7367006885399999);
  Object.assign(c.state.activities,{streaming:1,videoCall:1,gaming:1}); c.state.loc='us';
  const total=c.digitalLifeTotals();
  close(total.kwh[0],0.28950982); close(total.kwh[1],0.43450982);
  close(total.carbon[0],117.688774808); close(total.carbon[1],173.42677480799998);
  close(total.water[0],0.5150795255795079); close(total.water[1],0.773055338659108);
});


test('old profile links restore text/grid only; summaries and reports omit personal footprint', () => {
  const c=calculator(); c.readURL();
  assert.equal(c.state.loc,'eu'); assert.equal(c.state.rows[0].count,12);
  assert.equal(c.state.rows[0].retry,2);
  for(const key of ['home','drive','diet','fly']) assert.equal(key in c.state,false);
  const url=new URL(c.buildShareURL()); const hash=new URLSearchParams(url.hash.slice(1));
  for(const key of ['h','v','d','f']) assert.equal(hash.has(key),false);
  assert.equal(hash.get('l'),'eu');
  const report=c.reportHTML();
  assert.match(report,/My AI carbon/);
  assert.doesNotMatch(report,/of my daily blue-water footprint|built from:|Home \(/);
  const summary=c.buildSummaryText();
  assert.match(summary,/My daily AI carbon:/);
  assert.doesNotMatch(summary,/%|of my daily/);
});


test('router default, zero, scaling, and yearly comparison use 24 hours per day', () => {
  const c=calculator();
  assert.equal(c.state.routerWatts,6.5);
  const v=c.routerValues();
  close(v.kwh,0.156); close(v.carbon,59.9664);
  close(v.water,0.27754639200288);
  close(c.routerComparisonRow(365).v,21887.735999999997);
  close(v.kwh*365,56.94);
  c.state.routerWatts=13;
  for(const metric of ['kwh','carbon','water']) close(c.routerValues()[metric],v[metric]*2);
  c.state.routerWatts=0;
  assert.deepEqual(copy(c.routerValues()),{kwh:0,carbon:0,water:0});
  close(c.routerComparisonRow().v,0);
});

test('router responds to grid and wattage, independently of all usage totals', () => {
  const c=calculator();
  c.state.rows=[{model:'gpt-5.5',size:'chat',count:2,retry:1}];
  c.state.codingSessions=[{model:'gpt-5.5',lines:1500}];
  const router=copy(c.routerValues());
  Object.assign(c.state.activities,{streaming:2,videoCall:4,gaming:8,social:1});
  assert.deepEqual(copy(c.routerValues()),router);
  const ai=copy(c.aiDailyTriple('carbon')),digital=copy(c.digitalLifeTotals()),project=copy(c.codingProjectTotals());
  c.state.routerWatts=10.25;
  assert.deepEqual(copy(c.aiDailyTriple('carbon')),ai);
  assert.deepEqual(copy(c.digitalLifeTotals()),digital);
  assert.deepEqual(copy(c.codingProjectTotals()),project);
  close(c.routerValues().kwh,0.246);
  c.state.routerWatts=6.5; c.state.loc='eu';
  close(c.routerValues().carbon,32.743932);
  close(c.routerValues().water,router.water);
  close(c.routerValues().kwh,router.kwh);
  c.state.metric='water';close(c.routerComparisonRow(365).v,router.water*365);
});


test('pie endpoints sum daily inputs without inventing a gaming mean', () => {
  const c=calculator();
  c.state.rows=[{model:'gpt-5.5',size:'chat',count:2,retry:3}];
  c.state.images=[{count:2,retry:2}]; c.state.videos=[{count:1,retry:2,duration:16}];
  Object.assign(c.state.activities,{streaming:1,videoCall:2,gaming:1,social:0.5});
  for(const metric of ['carbon','water']) {
    c.state.metric=metric;
    for(const [bound,index] of [['low',0],['high',1]]) {
      c.state.pieBound=bound;
      const rows=c.pieContributions();
      assert.equal(rows.length,8);
      assert.equal(new Set(rows.map(r=>r.id)).size,8);
      close(rows.reduce((sum,row)=>sum+row.value,0),c.aiDailyTriple(metric)[index+1]+c.digitalLifeTotals()[metric][index]+c.routerValues()[metric]);
      close(rows.find(r=>r.id==='gaming').value,c.activityValues('gaming')[metric][index]);
    }
  }
});

test('pie selection includes each chosen session once without changing project or daily totals', () => {
  const c=calculator(); c.state.routerWatts=0;
  c.state.codingSessions=[{uid:1,model:'gpt-5.5',lines:1500},{uid:2,model:'gpt-5.5',lines:8880}];
  const project=copy(c.codingProjectTotals()),daily=copy(c.aiDailyTriple('carbon'));
  assert.equal(c.pieContributions().length,0);
  c.state.codingSessions[0].includeInPie=true;
  const once=copy(c.pieContributions()); assert.equal(once.length,1); assert.equal(once[0].id,'session-1');
  c.state.codingSessions[0].includeInPie=true;
  assert.deepEqual(copy(c.pieContributions()),once);
  c.state.codingSessions[1].includeInPie=true;
  close(c.pieContributions().reduce((sum,r)=>sum+r.value,0),project.carbon);
  assert.deepEqual(copy(c.codingProjectTotals()),project);assert.deepEqual(copy(c.aiDailyTriple('carbon')),daily);
  c.state.codingSessions[0].includeInPie=false;assert.equal(c.pieContributions().length,1);
  c.state.codingSessions.splice(1,1);assert.equal(c.pieContributions().length,0);
});

test('zero pie is empty and grid changes recompute contributions', () => {
  const c=calculator();c.state.routerWatts=0;
  assert.equal(c.pieContributions().length,0);
  c.state.activities.videoCall=1;
  close(c.pieContributions()[0].value,18.8356);
  c.state.loc='eu'; close(c.pieContributions()[0].value,10.284953);
  c.state.metric='water';close(c.pieContributions()[0].value,0.08717803338552);
});


test('project comparison uses all sessions once for each metric and clears on removal', () => {
  const c = calculator();
  assert.equal(c.projectComparisonRows().length, 0);
  c.state.rows = [{ model: 'gpt-5.5', size: 'chat', count: 2, retry: 1 }];
  const daily = copy(c.aiDailyTriple('carbon'));
  c.state.codingSessions = [
    { model: 'gpt-5.5', lines: 1500, includeInPie: true },
    { model: 'gpt-5.5', lines: 8880, includeInPie: false },
  ];
  for (const metric of ['carbon', 'water']) {
    c.state.metric = metric;
    const row = c.projectComparisonRows()[0];
    close(row.v, c.codingProjectTotals()[metric]);
    assert.match(row.label, /whole project/);
    assert.equal(row.project, true);
    c.state.codingSessions[0].includeInPie = false;
    close(c.projectComparisonRows()[0].v, row.v);
  }
  c.state.metric = 'carbon';
  const before = c.projectComparisonRows()[0].v;
  c.state.loc = 'eu';
  assert.ok(c.projectComparisonRows()[0].v < before);
  c.state.loc = 'us';
  assert.deepEqual(copy(c.aiDailyTriple('carbon')), daily);
  c.state.codingSessions[1].lines = 0;
  assert.ok(c.projectComparisonRows()[0].v < before);
  c.state.codingSessions = [];
  assert.equal(c.projectComparisonRows().length, 0);
});

test('report includes media in AI totals and keeps project/activity/router scopes separate', () => {
  const c = calculator();
  c.state.images = [{ count: 1, retry: 2 }];
  c.state.videos = [{ count: 1, retry: 3, duration: 16 }];
  c.state.codingSessions = [{ uid: 1, model: 'gpt-5.5', lines: 1500, includeInPie: true }];
  c.state.activities.gaming = 1;
  c.state.routerWatts = 8.5;
  const totals = copy(c.aiDailyTriple('carbon'));
  const report = c.reportHTML();
  for (const phrase of ['Image entry 1', '1 clips/day; 16 seconds/clip; 720p; ×3', 'Coding sessions — whole project', '100000', '160 Wh–305 Wh', '8.5 W', 'Included once in pie']) {
    assert.ok(report.includes(phrase), phrase);
  }
  assert.match(report, /79\.7 g CO₂e per day/);
  assert.match(report, /29\.1 kg CO₂e per year/);
  assert.match(report, /whole project \(once\)/);
  assert.match(report, /not a statistical confidence interval/);
  assert.deepEqual(copy(c.aiDailyTriple('carbon')), totals);
  c.state.codingSessions = [];
  assert.deepEqual(copy(c.aiDailyTriple('carbon')), totals);
  c.state.videos = [];
  const imageReport = c.reportHTML();
  assert.match(imageReport, /point estimate/);
  assert.doesNotMatch(imageReport, /range 2\.21 g to 2\.21 g/);
});
