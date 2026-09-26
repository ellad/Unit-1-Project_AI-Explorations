import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

// Exercise the actual inline client helpers without copying their implementation.
const source = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
const helpers = source.slice(source.indexOf('    function clampInt('), source.indexOf('    // ---- Formatting ----'));
function element() {
  return {
    value: '7', attributes: {}, events: {}, children: [],
    setAttribute(k, v) { this.attributes[k] = v; },
    removeAttribute(k) { delete this.attributes[k]; },
    addEventListener(k, fn) { this.events[k] = fn; },
    appendChild(child) { this.children.push(child); child.parentNode = this; },
    closest() { return this.parentElement; },
  };
}
function setup() {
  const context = vm.createContext({ document: { createElement: element } });
  vm.runInContext(helpers, context);
  return context;
}

test('whole strings, safe integers, and field bounds', () => {
  const { clampInt, clampFloat } = setup();
  for (const value of ['', ' ', '-5', '1.5', '1e3', '5abc', 'Infinity', '9007199254740992']) {
    assert.equal(clampInt(value, 0, 100000, null), null, value);
  }
  assert.equal(clampInt(' 42 ', 0, 100000, null), 42);
  assert.equal(clampInt('0', 0, 100000, null), 0);
  assert.equal(clampInt('0', 1, 1000, null), 1);
  assert.equal(clampInt('100001', 0, 100000, null), 100000);
  for (const value of ['', '-1.5', '1e3', '2hours', '1.', 'Infinity']) {
    assert.equal(clampFloat(value, 0, 24, null), null, value);
  }
  assert.equal(clampFloat(' 1.5 ', 0, 24, null), 1.5);
  assert.equal(clampFloat('.5', 0, 24, null), 0.5);
  assert.equal(clampFloat('25', 0, 24, null), 24);
});

test('unfinished and invalid edits preserve totals; blur and Enter commit', () => {
  const context = setup();
  const input = element();
  input.parentElement = element();
  let value = 7;
  context.bindIntegerInput(input, 0, 100, () => value, (n) => { value = n; });
  input.value = '';
  input.events.input();
  assert.equal(value, 7);
  input.events.blur();
  assert.equal(value, 7);
  assert.equal(input.attributes['aria-invalid'], 'true');
  assert.match(input.parentElement.children[0].textContent, /Still using 7/);
  input.value = ' 12 ';
  input.events.input();
  assert.equal(value, 7);
  input.events.keydown({ key: 'Enter', preventDefault() {} });
  assert.equal(value, 12);
  assert.equal(input.value, '12');
  assert.equal(input.attributes['aria-invalid'], undefined);
  assert.equal(input.parentElement.children[0].hidden, true);
  input.value = '101';
  input.events.blur();
  assert.equal(value, 100);
  assert.equal(input.value, '100');
});

test('shared links accept legacy rows and reject malformed numeric fields', () => {
  const context = setup();
  Object.assign(context, {
    URLSearchParams, location: { hash: '' }, state: { rows: [] }, uidSeq: 1,
    MODELS: [{ id: 'model' }], SIZES: [{ id: 'chat' }],
  });
  vm.runInContext(source.slice(source.indexOf('    function readURL()'), source.indexOf('    function setDefaultRows()')), context);
  for (const [encoded, count, retry] of [['0-0-12', 12, 1], ['0-0-12-3', 12, 3], ['0-0-100001-1001', 100000, 1000]]) {
    context.location.hash = '#r=' + encoded;
    context.readURL();
    assert.equal(context.state.rows[0].count, count);
    assert.equal(context.state.rows[0].retry, retry);
  }
  for (const encoded of ['0-0--5', '0-0-5-1.5', '0-0-1.5', '0-0-1e3', '0-0-5-NaN', '0-0-5-', '0-0-5-2-extra', '0-0-9007199254740992']) {
    context.state.rows = [];
    context.location.hash = '#r=' + encoded;
    context.readURL();
    assert.equal(context.state.rows.length, 0, encoded);
  }
});

test('decimal-hour edits commit without truncation and reject invalid drafts', () => {
  const context=setup(), input=element();
  input.parentElement=element(); let hours=0;
  context.bindDecimalInput(input,0,24,()=>hours,(n)=>{hours=n;});
  input.value='1.5'; input.events.input(); assert.equal(hours,0);
  input.events.blur(); assert.equal(hours,1.5);
  for(const invalid of ['', '-1', '1.', '1e2', '2 hours']) {
    input.value=invalid; input.events.blur(); assert.equal(hours,1.5);
    assert.equal(input.attributes['aria-invalid'],'true');
  }
  input.value='25'; input.events.blur(); assert.equal(hours,24);
  input.value='0'; input.events.blur(); assert.equal(hours,0);
});

function shareSetup() {
  const context = setup();
  Object.assign(context, {
    URLSearchParams, location: { hash: '', origin: 'https://example.com', pathname: '/calculator/' },
    state: { rows: [], images: [], videos: [], codingSessions: [], activities: { streaming: 0, videoCall: 0, gaming: 0, social: 0 }, routerWatts: 6.5, pieBound: 'low', headcount: 300, metric: 'carbon', loc: 'us' },
    uidSeq: 1, MODELS: [{ id: 'model' }], SIZES: [{ id: 'chat' }], LOCATIONS: [{ id: 'us' }, { id: 'eu' }],
    MAX_SESSION_LINES: 100000, MAX_ROUTER_WATTS: 1000,
  });
  vm.runInContext(source.slice(source.indexOf('    function buildShareURL()'), source.indexOf('    function setDefaultRows()')), context);
  return context;
}

test('all input types and selected sessions round trip, including empty text rows', () => {
  const original = shareSetup();
  Object.assign(original.state, {
    images: [{ uid: 99, count: 7, retry: 3 }], videos: [{ uid: 100, count: 2, retry: 4, duration: 16 }],
    codingSessions: [{ uid: 101, model: 'model', lines: 1500, includeInPie: true }, { uid: 102, model: 'model', lines: 8880, includeInPie: false }],
    activities: { streaming: 1.5, videoCall: 2.25, gaming: 0.5, social: 0 }, routerWatts: 8.75, pieBound: 'high', headcount: 42, metric: 'water', loc: 'eu',
  });
  const restored = shareSetup();
  restored.state.rows = [{ model: 'model', size: 'chat', count: 10, retry: 1 }];
  restored.location.hash = new URL(original.buildShareURL()).hash;
  restored.readURL();
  const normalize = (value) => JSON.parse(JSON.stringify(value, (key, item) => key === 'uid' ? undefined : item));
  assert.deepEqual(normalize(restored.state), normalize(original.state));
  const entries = [...restored.state.images, ...restored.state.videos, ...restored.state.codingSessions];
  assert.equal(new Set(entries.map((entry) => entry.uid)).size, entries.length);
});

test('malformed extensions preserve defaults and valid independent entries', () => {
  for (const extension of ['{broken', 'null', '{"version":2}', '[]']) {
    const context = shareSetup();
    context.location.hash = '#r=0-0-12&x=' + encodeURIComponent(extension);
    context.readURL();
    assert.equal(context.state.rows[0].count, 12);
    assert.equal(context.state.routerWatts, 6.5);
  }
  const context = shareSetup();
  context.location.hash = '#x=' + encodeURIComponent(JSON.stringify({ version: 1,
    images: [null, { count: '-1', retry: 1 }, { count: 2, retry: 3 }],
    videos: [{ count: 1, retry: 1, duration: '8seconds' }],
    codingSessions: [{ model: 'unknown', lines: 10 }, { model: 'model', lines: 15, includeInPie: 'true' }],
    activities: { streaming: '1.', videoCall: 2.5, gaming: -2, social: null },
    routerWatts: -1, headcount: 'Infinity', pieBound: 'other',
  }));
  context.readURL();
  assert.equal(context.state.images.length, 1);
  assert.equal(context.state.videos.length, 0);
  assert.equal(context.state.codingSessions.length, 1);
  assert.equal(context.state.codingSessions[0].includeInPie, false);
  assert.deepEqual(JSON.parse(JSON.stringify(context.state.activities)), { streaming: 0, videoCall: 2.5, gaming: 0, social: 0 });
  assert.equal(context.state.routerWatts, 6.5);
  assert.equal(context.state.headcount, 300);
  assert.equal(context.state.pieBound, 'low');
});
