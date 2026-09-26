# Current grid fixture revision — 2026-09-26

The tables below record historical checks using the former grid factors. Their carbon expectations are superseded by the user-approved 2025 factors. Energy and water remain unchanged. Current US fixtures: video call18.8356g/hour; gaming61.504–117.242g/hour; default6.5W router59.9664g/day. EU27 router:0.156×209.897=32.743932g/day. Automated tests use the updated factors. Historical browser observations below are not new verification results.

# Calculation fixtures

> Foundation-checkpoint deliverable (plan.md). Format for the hand-checkable
> cases plan.md's Verification section calls for: one row per case, with the
> exact inputs, the formula from plan.md, the hand-computed expected value,
> and — once implemented — the value the running calculator actually shows.
> Fill in "Observed" as each checkpoint is built; a mismatch is a bug, not a
> rounding choice, unless the rounding rule itself is stated here.

## Format

| Feature | Inputs | Formula (plan.md) | Expected | Observed | Notes |
|---|---|---|---|---|---|

## Text-AI entries (existing feature, re-verified as the foundation baseline)

Model: GPT-5.5, size: chat, location: US (`G = 380` g CO2e/kWh). Source record
(`MODELS[gpt-5.5].sizes.chat`): `wh=2.6601` (min 1.7417, max 3.5784),
`emb=0.0692` (fixed, not grid-dependent), `ml=9.5929` (min 6.2811, max 12.9047).

| Feature | Inputs | Formula | Expected | Observed | Notes |
|---|---|---|---|---|---|
| Text-AI, 1 prompt, carbon | N=1, R=1, US grid | `(wh÷1000)×G + emb` | mean **1.080038 g**, range 0.731046–1.428992 g | 1.08 g (displayed, 3 sig figs via `fmtCarbon`) | `(2.6601/1000)*380+0.0692 = 1.080038`; min `(1.7417/1000)*380+0.0692=0.731046`; max `(3.5784/1000)*380+0.0692=1.428992` |
| Text-AI, 1 prompt, water | N=1, R=1 | `ml ÷ 1,000` | mean **9.5929 mL** (0.0095929 L), range 6.2811–12.9047 mL | 9.59 mL | Water is grid-independent |
| Text-AI, 15 prompts, carbon | N=15, R=1, US grid | `N × ((wh÷1000)×G + emb)` | mean **16.20057 g** | matches `aiDailyTriple` for the default GPT-5.5 row (15/day) | `15 × 1.080038` |

## Retries/regenerations multiplier (Feature 5 — implemented)

| Feature | Inputs | Formula | Expected | Observed | Notes |
|---|---|---|---|---|---|
| Text-AI, 15 prompts, retry=3, carbon | N=15, R=3, US grid | `N × R × ((wh÷1000)×G + emb)` | **48.60171 g** | **48.6 g CO₂e** (row meta, Playwright) | `15 × 3 × 1.080038 = 48.60171`; combined-total delta matched exactly (20.8→53.2 g) |
| Retry input, invalid value | typed `0`, blur | clamp to `[1, 1000]` | clamps to **1** | **1** (Playwright) | `clampInt` floor rejects sub-1 values, matching the "no retry below 1" requirement |
| Share-link round trip | retry=5 set, link copied, reloaded fresh | URL row field gains a 4th `-retry` segment; 3-segment legacy links default to 1 | retry **5** survives reload | **5** (Playwright) | Confirms old (pre-Project-2) saved links still parse via the length check on `a[3]` |

## Image generation (Feature 1 — implemented)

Locked constants: `E_image = 2.907 Wh/image` (Luccioni et al., published average
across 8 tested models). Carbon has no published average — derived as
`(energy ÷ 1,000) × G`.

| Feature | Inputs | Formula | Expected | Observed | Notes |
|---|---|---|---|---|---|
| Image, 1 image, US grid | N=1, R=1, US (`G=380`) | `energy = E_image`; `carbon = (energy÷1000)×G` | energy **2.907 Wh**; carbon **1.10466 g** | — | `2.907/1000*380 = 1.10466` |
| Image, 1 image, EU grid | N=1, R=1, EU (`G=215`) | same | energy **2.907 Wh**; carbon **0.625005 g** | — | `2.907/1000*215 = 0.625005` — carbon must change with location; energy must not |
| Image water | N=1, R=1 | `(energy÷1000)×W`, `W=1.779 L/kWh` | **0.005170 L** (5.170 mL) | — | `(2.907/1000)*1.779 = 0.0051702...` |

## Video generation (Feature 1 — implemented)

Reference: 19.8–43.4 Wh (mean 30.8 Wh) for an 8s/720p Veo 3.1 clip; `P=1.09` PUE.

| Feature | Inputs | Formula | Expected | Observed | Notes |
|---|---|---|---|---|---|
| Video, 1 clip, 8s, US grid | N=1, R=1, T=8, US | `energy=N×R×(T÷8)×[19.8,43.4]×P` | low **21.582 Wh**, high **47.306 Wh** | — | `19.8*1.09=21.582`; `43.4*1.09=47.306`; `T÷8=1` |
| Video, 1 clip, 16s (duration doubled) | N=1, R=1, T=16, US | same | low **43.164 Wh**, high **94.612 Wh** | — | Must be exactly double the 8s case — the acceptance check for linear duration scaling |
| Video carbon, 8s, US grid | from energy above | `carbon=(energy÷1000)×G` | low **8.201 g**, high **17.976 g** | — | `21.582/1000*380=8.20116`; `47.306/1000*380=17.97628` |

## Coding-project sessions (Feature 3 — implemented as a dedicated builder)

`estimated tokens = L × 10 ÷ 0.15`. Anchors: 1,500 lines ≈ 100,000 tokens (EcoLogits benchmark); 8,880 lines ≈ 592,000 tokens (Couch, n=1). Per-token basis = model's own `agent` bucket ÷ 100,000 tokens (linear). Point estimate only, no low/high range. Sessions are project-scope: they must never move the daily/annual "your AI use" totals. **2026-09-23: sessions carry no retry multiplier** (revised Feature 5 — see spec.md/plan.md); the retry=3 fixture below is retained only as a record of the math that was removed.

| Feature | Inputs | Formula | Expected | Observed | Notes |
|---|---|---|---|---|---|
| Lines → tokens, standard anchor | L=1,500 | `L×10÷0.15` | **100,000 tokens** | **100,000 tokens** (Playwright) | Matches existing `agent` size bucket exactly |
| Lines → tokens, heavy anchor | L=8,880 | `L×10÷0.15` | **592,000 tokens** | **592,000 tokens** (Playwright) | Matches Couch's figure exactly |
| Session, GPT-5.5, 1,500 lines, US grid, R=1 | tokens=100,000 | `wh=basis.wh×tokens`; `carbon=(wh/1000)×G+emb×tokens-scaled`; basis from `sizes.agent÷100000` | **644.17 Wh**, **257.7 g CO₂e**, **2.323 L** | **644 Wh, 258 g CO₂e, 2.32 L** (Playwright) | Exactly reproduces `sizes.agent` at its own reference token count — the basis-derivation sanity check |
| Session, GPT-5.5, 8,880 lines, US grid, R=1 | tokens=592,000 (5.92× reference) | same, linearly scaled | **3813.5 Wh**, **1525.8 g CO₂e**, **13.75 L** | **3.81 kWh, 1.53 kg CO₂e, 13.8 L** (Playwright) | Confirms linear per-token scaling beyond the single anchor point |
| ~~Session, GPT-5.5, 8,880 lines, R=3~~ (REMOVED 2026-09-23) | retry=3 | `R × (energy, carbon, water)` | 11440 Wh, 4577.4 g CO₂e, 41.26 L | was 11.4 kWh, 4.58 kg CO₂e, 41.3 L (Playwright) | Retry no longer exists for coding sessions; kept only as a record of the pre-revision math |
| Combined AI-use total, before/after adding/editing a session | 3 default chat rows, then + a coding session | daily/annual "your AI use" total must be unaffected by any coding session | headline **unchanged** | **confirmed unchanged** (Playwright, byte-identical headline text) | The core acceptance check: project total never enters daily/annual totals |
| Removing the only session | remove after add | project-total box clears; empty state returns | empty string; "No coding sessions yet." | confirmed (Playwright) | |

## Digital-life activities (Feature 2 — implemented)

Locked constants: `e_streaming=0.077 kWh/hr`, `c_streaming=36 g/hr` (IEA, direct);
`e_video-call=0.049 kWh/hr` (Mytton, carbon grid-derived); gaming
`P_game=[160,305] W` (console–PC range, carbon grid-derived); social media
`M_social=15.81 mAh/min`, `V_social=3.7 V` (carbon grid-derived).

| Feature | Inputs | Formula | Expected | Observed | Notes |
|---|---|---|---|---|---|
| Streaming, 1 hr, US grid | H=1, US | `daily energy=H×e`; `daily carbon=H×c` (direct) | energy **0.077 kWh**; carbon **36 g** | 77.0 Wh; 36.0 g (browser) | Streaming is the one activity with a directly published carbon figure — must NOT be grid-derived |
| Video call, 1 hr, US grid | H=1, US | `daily energy=H×e`; `carbon=(energy)×G` | energy **0.049 kWh**; carbon **18.62 g** | 49.0 Wh; 18.6 g (browser) | `0.049*380=18.62` |
| Gaming, 1 hr, US grid (range) | H=1, US | `e[low,high]=P_game[low,high]÷1000`; `carbon=energy×G` | energy **0.160–0.305 kWh**; carbon **60.8–115.9 g** | 160–305 Wh; 60.8–116 g (browser) | `0.160*380=60.8`; `0.305*380=115.9` |
| Social media, 1 hr, US grid | H=1, US | `e=(15.81×60×3.7)÷1,000,000`; `carbon=energy×G` | energy **0.00350982 kWh** (3.50982 Wh); carbon **1.3337316 g** | 3.51 Wh; 1.33 g (browser) | `0.00350982*380=1.3337316` — corrected minutes-to-hours conversion, approved 2026-09-24 |

## Router baseline (Feature 4 — implemented)

Default `P_router = 6.5 W`, always 24 hr/day, independent of activity hours.

| Feature | Inputs | Formula | Expected | Observed | Notes |
|---|---|---|---|---|---|
| Router, default wattage, US grid | P=6.5W, US | `daily energy=P×24÷1000`; `carbon=energy×G` | energy **0.156 kWh**; carbon **59.28 g** | Browser: **156 Wh; 59.3 g** | `6.5*24/1000=0.156`; `0.156*380=59.28` |


## Media checkpoint verification — 2026-09-24

Calculations retain the existing full gallon conversion: `W = 0.47 × 3.785411784 = 1.77914353848 L/kWh`. Older fixture rows above used the rounded `1.779`; use the full factor for regression expectations.

| Feature | Inputs | Formula | Expected | Observed | Notes |
|---|---|---|---|---|---|
| Image, US | N=1, R=1 | 2.907 Wh; energy/1000 × G or W | 2.907 Wh; 1.10466 g; 0.005171970266 L | Browser: 2.91 Wh; 1.10 g; 5.17 mL | Point estimate; image-only headline has no range |
| Image, EU | N=1, R=1, G=215 | 2.907/1000 × 215 | 0.625005 g; unchanged energy/water | Calculation test passed | Location affects carbon only |
| Video, 8 seconds, US | N=1, R=1, T=8 | source energy × 1.09 | 21.582–47.306 Wh, mean 33.572 Wh; 8.20116–17.97628 g, mean 12.75736 g; 0.059729406874 L | Browser: 21.6–47.3 Wh, mean 33.6 Wh; 8.20–18.0 g, mean 12.8 g; 59.7 mL | Water is a single derived point |
| Video, 16 seconds, US | N=1, R=1, T=16 | 2 × 8-second values | 43.164–94.612 Wh; 16.40232–35.95256 g; 0.119458813748 L | Browser: 43.2–94.6 Wh; 16.4–36.0 g; 119 mL | All underlying values double (calculation test) |
| Video retries | N=1, R=3, T=8 | 3 × 8-second values | 64.746–141.918 Wh | Browser: 64.7–142 Wh | Multiplier applied once |
| Mixed daily total | 2 GPT-5.5 chat prompts, R=3; 1 image; 1 video, 8s | six per-prompt triples + image point + video triple | Mean carbon 20.342248 g; media energy contribution 36.479 Wh | Calculation test passed | Low/high each summed separately; coding excluded |
| Interaction and layout | Add/edit/remove, zero duration, invalid duration, metric switch, coding session, reset; desktop and 375px | Separate daily media and project scopes | Valid totals; single water point for media-only use; no overflow | Browser checks passed; no page errors | Invalid edits preserve last valid total. Zero-duration helper checked in calculation test. |

Retained checks: `node --test project_1_executables/tests/*.test.mjs`. Browser interaction checks used Playwright against the local Astro development server. User verification is still pending.

## Digital-life checkpoint verification — 2026-09-24

Social-media units were corrected with user approval after checking the [original Greenspector table](https://blog.greenspector.com/reseaux-sociaux-2021/). All fixtures use the full water factor `1.77914353848 L/kWh`.

| Feature | Inputs | Formula | Expected | Observed | Notes |
|---|---|---|---|---|---|
| Streaming water/year | 1 hour/day | 0.077 × W; daily × 365 | 0.136994052463 L/day; 28.105 kWh/year; 13.14 kg carbon/year | Browser: 137 mL/day; 28.1 kWh/year; 13.1 kg/year | Carbon remains 36 g/hour when location changes |
| Video-call water | 1 hour/day, US | 0.049 × W | 0.087178033386 L/day | Browser: 87.2 mL/day | EU carbon: 10.535 g/day (browser 10.5 g) |
| Gaming water | 1 hour/day | [0.160, 0.305] × W | 0.284662966157–0.542638779236 L/day | Browser: 285–543 mL/day | Annual energy: 58.4–111.325 kWh; both endpoints retained |
| Social media, corrected | 1 hour/day, US | 15.81 × 60 × 3.7 / 1e6; energy × W | 0.00350982 kWh/day; 0.006244473574 L/day; 486.812034 g carbon/year | Browser: 3.51 Wh/day; 6.24 mL/day; 487 g/year | Battery-only proxy; carbon/water derived |
| Combined activities | 1 hour/day of each, US | Sum low endpoints; sum high endpoints | 0.28950982–0.43450982 kWh/day; 116.7537316–171.8537316 g/day; 0.515079525580–0.773055338659 L/day | Calculation test passed; browser carbon 117–172 g/day | Router, AI, and coding projects excluded |
| Input independence | Streaming 1.5 hours; others 1 | Streaming 1.5 × 36 | Streaming 54 g/day; other hours unchanged | Browser passed | Invalid/blank/incomplete values preserve last committed value; 0–24 limits checked |
| Comparisons, scope, reset | Change hours, grid, metric; reset; 375px viewport | Activity results and daily/yearly bars update | Four tagged comparisons; gaming range; AI totals unchanged; reset hours to zero; no overflow | Browser passed, no page errors | User verification remains pending |

Run `node --test project_1_executables/tests/*.test.mjs` for the retained numeric, media, and digital-life regression checks.


## Router checkpoint verification — 2026-09-24

| Feature | Inputs | Formula | Expected | Observed | Notes |
|---|---|---|---|---|---|
| Default router, daily | 6.5 W, US | watts × 24 / 1000; kWh × grid or water factor | 0.156 kWh; 59.28 g CO₂e; 0.277546392003 L | Browser: 156 Wh; 59.3 g; 278 mL | Separate infrastructure baseline |
| Default router, yearly | 6.5 W, US | daily × 365 | 56.94 kWh; 21.6372 kg CO₂e; 101.304433081 L | Browser: 56.9 kWh; 21.6 kg; 101 L | Same daily wattage throughout year |
| Double wattage | 13 W, US | 2 × default | 0.312 kWh/day; 118.56 g/day; 0.555092784006 L/day | Calculation tests passed; browser: 312 Wh; 119 g | All values double once |
| Decimal wattage | 10.25 W | 10.25 × 24 / 1000 | 0.246 kWh/day | Browser: 246 Wh | No integer truncation |
| Grid change | 6.5 W, EU | 0.156 × 215 | 33.54 g/day; energy/water unchanged | Calculation tests passed; browser: 33.5 g | Water remains NREL-derived |
| Zero and validation | 0 W; then negative, blank, incomplete, malformed values | valid zero; invalid edits preserve previous committed state | Zero footprint or inline error | Browser passed | Decimal parser retains previous valid totals |
| Independence and reset | Edit activities, edit wattage, reset | Router independent of activity hours; excluded from AI/activity/project totals | Router unchanged on activity edit; other totals unchanged on wattage edit; reset to 6.5 W | Automated and browser checks passed | Daily/yearly infrastructure bars update; 375px layout has no overflow |

Retained router calculation checks are in `project_1_executables/tests/digital-life.test.mjs`. All 15 tests passed, as did the production build and browser checks with no page errors. User verification remains pending.


## Pie-chart verification — 2026-09-25

| Case | Expected | Observed |
|---|---|---|
| Lower/upper carbon and water | Sum the matching endpoints of text/image/video and activity values, plus router; never invent a gaming mean | Automated checks passed for both metrics and both endpoints |
| One image only, router off | One slice, 100% share | Browser passed |
| No daily inputs, no selected coding, router off | Empty state, no pie | Automated and browser checks passed |
| Coding selections | Each selected session appears once; selecting/unselecting leaves project and daily AI totals unchanged | Automated and browser checks passed |
| Session edit/removal | Selected session value updates on edit and disappears on removal | Browser passed |
| Metric and scenario controls | Page and chart metric controls synchronize; endpoint changes update values and slices | Browser passed |
| Reset | Clears selected sessions and media, resets activity hours and scenario; restores default text/router contributions | Browser passed |
| Accessibility/layout | Keyboard-operable controls, labeled value/share table, no horizontal overflow at 375px; light and dark themes | Browser checks passed; visual screenshots inspected |

The chart uses only entered usage and infrastructure, never fixed everyday-comparison reference bars. Coding selections are not annualized. Core tests plus chart coverage: `node --test project_1_executables/tests/*.test.mjs` (18 passed). User verification is pending.

## Report verification — 2026-09-26

| Case | Expected | Observed |
|---|---|---|
| Media-only US: 1 image ×2; 1 sixteen-second video ×3 | 78.75348 g/day; 28.7450202 kg/year; project excluded | Report: 78.8 g/day; 28.7 kg/year; regression passed |
| Project: 1,500 GPT-5.5 lines, selected in pie | 100,000 estimated tokens; project and one-day scope only | Browser report includes separate project and selected-session rows |
| Gaming 1 h/day | 160–305 Wh/day; full carbon/water endpoints | Browser report displays endpoints, not an invented mean |
| Export source notes | Media, coding, router, activity notes and current methodology | Browser checks found Luccioni, Couch, NREL, JRC links and retry explanations |
| Export layout | No horizontal document overflow at 1440px/375px | Browser passed |

22 regression tests and production build passed. Citation/claim gaps are recorded in `evidence-audit.md`; user verification remains open.

## State/interaction browser checkpoint — 2026-09-26

Real clipboard round trip used default text rows, one image, one video, an 8,880-line coding session selected in the pie, streaming 2.25 h/day, video calls 3 h/day, gaming 1.5 h/day, social media 0.75 h/day, router 8.5 W, EU grid, water metric, upper scenario, and 42 employees. Opening the copied URL in a fresh tab restored identical input values/checkboxes and AI, project, pie, activity, router, and daily-bar text.

Found and fixed a display bug: headcount calculations restored 42 while its input showed 300. Reset cleared sessions and restored activity/router defaults. A simulated clipboard denial produced selectable manual-copy text containing the exact share URL, rather than a false success message. No document overflow at 375px. All 22 regression tests and the production build passed.

- 2026-09-26: User-approved source/scaling revision: explicitly attribute report printing, commute carbon, and coding record scaling to Masley, with formulas and limitations. AC now uses Integrity Services’ chosen2kW example for one hour (not an office average):2kWh × fixed2025US0.38440kg/kWh =0.7688kgCO2e;2×historicalNREL0.47=0.94USgal. Both AC reference bars and report methodology updated; earlier3kWh/1.14kg/1.4gal AC fixtures are superseded. Source: https://www.integrityacservice.com/about/blog/how-much-power-does-an-air-conditioner-really-use/
