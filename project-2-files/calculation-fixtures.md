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

## Image generation (Feature 1 — pending implementation)

Locked constants: `E_image = 2.907 Wh/image` (Luccioni et al., published average
across 8 tested models). Carbon has no published average — derived as
`(energy ÷ 1,000) × G`.

| Feature | Inputs | Formula | Expected | Observed | Notes |
|---|---|---|---|---|---|
| Image, 1 image, US grid | N=1, R=1, US (`G=380`) | `energy = E_image`; `carbon = (energy÷1000)×G` | energy **2.907 Wh**; carbon **1.10466 g** | — | `2.907/1000*380 = 1.10466` |
| Image, 1 image, EU grid | N=1, R=1, EU (`G=215`) | same | energy **2.907 Wh**; carbon **0.625005 g** | — | `2.907/1000*215 = 0.625005` — carbon must change with location; energy must not |
| Image water | N=1, R=1 | `(energy÷1000)×W`, `W=1.779 L/kWh` | **0.005170 L** (5.170 mL) | — | `(2.907/1000)*1.779 = 0.0051702...` |

## Video generation (Feature 1 — pending implementation)

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

## Digital-life activities (Feature 2 — pending implementation)

Locked constants: `e_streaming=0.077 kWh/hr`, `c_streaming=36 g/hr` (IEA, direct);
`e_video-call=0.049 kWh/hr` (Mytton, carbon grid-derived); gaming
`P_game=[160,305] W` (console–PC range, carbon grid-derived); social media
`M_social=15.81 mAh/hr`, `V_social=3.7 V` (carbon grid-derived).

| Feature | Inputs | Formula | Expected | Observed | Notes |
|---|---|---|---|---|---|
| Streaming, 1 hr, US grid | H=1, US | `daily energy=H×e`; `daily carbon=H×c` (direct) | energy **0.077 kWh**; carbon **36 g** | — | Streaming is the one activity with a directly published carbon figure — must NOT be grid-derived |
| Video call, 1 hr, US grid | H=1, US | `daily energy=H×e`; `carbon=(energy)×G` | energy **0.049 kWh**; carbon **18.62 g** | — | `0.049*380=18.62` |
| Gaming, 1 hr, US grid (range) | H=1, US | `e[low,high]=P_game[low,high]÷1000`; `carbon=energy×G` | energy **0.160–0.305 kWh**; carbon **60.8–115.9 g** | — | `0.160*380=60.8`; `0.305*380=115.9` |
| Social media, 1 hr, US grid | H=1, US | `e=(15.81×3.7)÷1,000,000`; `carbon=energy×G` | energy **0.0000585 kWh** (0.0585 Wh); carbon **0.02223 g** | — | `0.000058497*380=0.0222289` |

## Router baseline (Feature 4 — existing default, pending implementation)

Default `P_router = 6.5 W`, always 24 hr/day, independent of activity hours.

| Feature | Inputs | Formula | Expected | Observed | Notes |
|---|---|---|---|---|---|
| Router, default wattage, US grid | P=6.5W, US | `daily energy=P×24÷1000`; `carbon=energy×G` | energy **0.156 kWh**; carbon **59.28 g** | — | `6.5*24/1000=0.156`; `0.156*380=59.28` |
