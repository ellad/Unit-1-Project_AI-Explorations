import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

const source = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
function calculator() {
  let script = source.match(/<script is:inline define:vars=\{\{\}\}>([\s\S]*?)<\/script>/)[1];
  script = script.replace("    document.addEventListener('astro:page-load', init);", `
    globalThis.calculator = { state, imageEntryValues, videoEntryValues, aiDailyTriple, aiDailyEnergy, perPromptTriple, getModel, usagePhrase };
    document.addEventListener('astro:page-load', init);`);
  const context = vm.createContext({ document: { readyState: 'loading', addEventListener() {} } });
  vm.runInContext(script, context);
  return context.calculator;
}
function close(actual, expected) { assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`); }

test('image uses a point estimate, selected grid, and exactly one retry multiplier', () => {
  const c = calculator(), entry = {count:1, retry:1};
  const v = c.imageEntryValues(entry);
  close(v.wh,2.907); close(v.carbon,1.1174507999999999); close(v.water,0.00517197026636136);
  c.state.images = [entry];
  assert.deepEqual([...c.aiDailyTriple('carbon')],[v.carbon,v.carbon,v.carbon]);
  c.state.loc = 'eu'; close(c.imageEntryValues(entry).carbon,0.6101705789999999);
  close(c.imageEntryValues(entry).water,v.water);
  entry.retry=3; close(c.imageEntryValues(entry).wh,8.721);
  entry.count=0; close(c.aiDailyEnergy(),0);
});

test('video range, published mean, single water value, duration and retries', () => {
  const c=calculator(), entry={count:1,duration:8,retry:1};
  const v=c.videoEntryValues(entry);
  close(v.whLow,21.582); close(v.wh,33.572); close(v.whHigh,47.306);
  close(v.carbonLow,8.296120799999999); close(v.carbonHigh,18.1844264); close(v.carbon,12.905076800000002);
  close(v.water,0.05972940687385056);
  c.state.videos=[entry];
  assert.deepEqual([...c.aiDailyTriple('water')],[v.water,v.water,v.water]);
  entry.duration=16;
  for(const key of Object.keys(v)) close(c.videoEntryValues(entry)[key],2*v[key]);
  entry.retry=3; entry.count=2;
  for(const key of Object.keys(v)) close(c.videoEntryValues(entry)[key],12*v[key]);
  entry.duration=0; close(c.aiDailyEnergy(),0); assert.equal(c.usagePhrase(),'');
});

test('mixed totals sum text and media while coding stays project-scope', () => {
  const c=calculator();
  const text={model:'gpt-5.5',size:'chat',count:2,retry:3};
  c.state.rows=[text]; c.state.images=[{count:1,retry:1}]; c.state.videos=[{count:1,duration:8,retry:1}];
  const ct=c.perPromptTriple(c.getModel(text.model),text.size,'carbon');
  const totals=c.aiDailyTriple('carbon');
  close(totals[0],6*ct[0]+1.1174507999999999+12.905076800000002);
  close(totals[1],6*ct[1]+1.1174507999999999+8.296120799999999);
  close(totals[2],6*ct[2]+1.1174507999999999+18.1844264);
  close(c.aiDailyEnergy(),6*c.getModel(text.model).sizes.chat.wh+36.479);
  c.state.codingSessions=[{model:'gpt-5.5',lines:8880}];
  assert.deepEqual([...c.aiDailyTriple('carbon')],[...totals]);
  assert.equal(c.usagePhrase(),'2 prompts and 1 image and 1 video clip');
});
