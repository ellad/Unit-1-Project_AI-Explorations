# Implementation Plan

> EDITING DIRECTIVE: USER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE USER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Turn the approved specification into ordered, updatable implementation and verification work.

## Instructions for the user

Preserve the approved requirements and verify the completed work. Direct priorities, scope, and meaningful checkpoints; judge technical choices, risks, and proposed changes; and approve results only after checking them against the specification rather than relying solely on the agent's report.

If the intended result changes, update the specification. If only the route changes, update this plan and record the revision.

## Instructions for the agent

Read AGENTS.md, brief.md, research.md, spec.md, and this file, then inspect the relevant project files. Begin with a concise orientation and one focused question.

Guide planning one stage at a time. Surface dependencies, risks, and verification needs without expanding scope or making decisions for the user. Draft concise, project-specific tasks and keep them current. Never mark approval gates or user-verification items complete on the user's behalf.

## Approach

Extend the existing single-page Astro calculator in small, verifiable checkpoints. First, consolidate the client-side state and calculation helpers so text, image, video, and coding-project entries can share validation, energy/carbon/water calculations, reset, and URL-sharing behavior (retry multipliers are shared by text, image, and video only — see the 2026-09-23 revision to Feature 5). Preserve the existing text-row behavior while adding the new entry types.

Build professional-AI features before digital-life comparisons: add retries, then image/video entries and their different point-versus-range displays, then the separate coding-project builder. Add digital-life hours and the always-on router baseline as separate comparison data; neither changes AI-use totals, and the router remains outside the digital-life combined activity total. Finish each feature's visible source, method, and limitation copy before treating it as complete.

Update all derived outputs together: summaries, comparison bars, generated report, methodology, reset/share state, and responsive/accessibility behavior. The optional carbon/water pie chart comes only after the five core features pass their checks; it must use a deliberately selected set of coding sessions without changing the separate project total.

Main risks: this calculator keeps markup, state, math, and rendering in one large Astro file, so state and serialization changes must be coordinated; point estimates for image, streaming, video-call, and social-media entries must never be presented as ranges, while video, text, and gaming retain their documented low–high ranges; and project-scope coding values must not be mistaken for daily values. Derived-water and lower-confidence figures must remain visibly labeled in plain language in both the calculator and exported report.

## Calculation formulas

Use watt-hours (Wh) internally for AI entries and kilowatt-hours (kWh) for electricity-based comparisons; carbon is grams of CO<sub>2</sub>e and water is liters. Apply a retry multiplier once at entry level, before adding an entry to any total. Display formatting and rounding must happen only after calculation.

Shared terms: `R` is the retry/regeneration multiplier (minimum 1); `G` is the selected location's grid factor in g CO<sub>2</sub>e/kWh; `W = 0.47 gal/kWh × 3.78541 L/gal = 1.779 L/kWh` is the NREL-derived water factor; and `Y = 365 days/year`. The current calculator's location factors are US `G=380`, EU `215`, UK `125`, China `580`, India `700`, and world `480`.

### Text-AI entries and retries

For a selected EcoLogits model/output-size record with electricity range `E[low, mean, high]` in Wh, embodied-carbon range `B[low, mean, high]` in g, and water range `A[low, mean, high]` in mL, and an entered prompt count `N`:

`energy[low, mean, high] = N × R × E[low, mean, high]`

`carbon[low, mean, high] = N × R × ((E[low, mean, high] ÷ 1,000) × G + B[low, mean, high])`

`water[low, mean, high] = N × R × (A[low, mean, high] ÷ 1,000)`

This preserves the existing EcoLogits water basis. For image, video, and coding entries, the same `R` multiplies their own resulting energy, carbon, and water values once only.

### Image generation

With image count `N`, `E_image = 2.907 Wh/image` is Luccioni et al.'s own published mean across their eight tested Stable-Diffusion-family models (Table 2: 2.907 kWh per 1,000 inferences). The paper does not publish an averaged carbon figure — only per-model extremes (stable-diffusion-xl-base-1.0, the most carbon-intensive model tested, at 1,594 g CO<sub>2</sub>e per 1,000 inferences under their own AWS us-west-2 grid assumption; the least carbon-intensive model at roughly 100 g per 1,000). Rather than pairing an averaged energy figure with one model's worst-case carbon figure, the calculator derives image carbon the same way it derives video carbon: from energy, using the selected location's grid factor `G`.

`energy = N × R × E_image`

`carbon = (energy ÷ 1,000) × G`

`water = (energy ÷ 1,000) × W`

Carbon is therefore the calculator's own derivation (average energy × selected `G`), not a number Luccioni et al. publish directly — label it as derived, alongside the existing derived-water label.

### Video generation

With clip count `N` and entered duration `T` seconds, all clips use the fixed 720p reference resolution. The source range is 19.8–43.4 Wh for an 8-second clip; `P = 1.09` is Google's PUE and `E_mean = 30.8 Wh`.

`energy[low, high] = N × R × (T ÷ 8) × [19.8, 43.4] × P`

`carbon[low, high] = (energy[low, high] ÷ 1,000) × G`

`water = (N × R × (T ÷ 8) × E_mean × P ÷ 1,000) × W`

The `T ÷ 8` term is the calculator's linear-duration assumption, not a finding from the source paper. There is no resolution term or control.

### Coding-project sessions

For a session with `L` entered lines of code:

`estimated tokens = L × 10 ÷ 0.15`

Select or interpolate the existing EcoLogits per-token coding/agent basis as defined in the foundation checkpoint. No retry multiplier applies here (2026-09-23 revision to Feature 5 — see spec.md): a session's line count already describes one full run, and a repeated run rarely reproduces the same amount of code. If the resolved session basis is `E_session` Wh, `B_session` g embodied carbon, and `A_session` mL water:

`session energy = E_session`

`session carbon = (E_session ÷ 1,000) × G + B_session`

`session water = A_session ÷ 1,000`

`project total (each metric) = sum of all valid session values for that metric`

The project total never enters daily or annual AI totals. Its anchors are `100,000 × 0.15 ÷ 10 = 1,500` lines and `592,000 × 0.15 ÷ 10 = 8,880` lines (displayed as approximately 8,900).

### Digital-life activities and router

For an activity with daily hours `H` and energy factor `e` kWh/hour:

`daily energy = H × e`

`daily carbon = H × c` when the source publishes carbon directly (streaming only); otherwise `daily energy × G` (video calls, gaming, social media — the selected inputs use energy rather than a published carbon value, so carbon is derived from energy using the selected location's grid factor, the same treatment used for image and video carbon)

`daily water = daily energy × W`

`annual value (each metric) = daily value × Y`

Locked constants: `e_streaming = 0.077 kWh/hour`, `c_streaming = 36 g/hour` (IEA — the only digital-life activity with a directly published carbon figure); `e_video-call = 0.049 kWh/hour` (Mytton; carbon is grid-derived, since Mytton publishes energy only).

Gaming uses a low–high range rather than a single point, reflecting the "Hot Games" paper's console-versus-PC split rather than inventing a blended average: `P_game[low, high] = [160, 305]` watts (console to desktop PC; mobile gaming is excluded, matching the source's own exclusion). `e_gaming[low, high] = P_game[low, high] ÷ 1,000 kWh/hour`; `daily energy[low, high] = H × e_gaming[low, high]`; carbon and water are each grid-/NREL-derived from that same low/high energy pair.

Social media uses `M_social = 15.81` mAh/minute (Greenspector's measured TikTok figure — one app, one 2021 Android device, not a social-media-wide average) and `V_social = 3.7` V (standard nominal Li-ion phone battery voltage): `e_social = (M_social × 60 × V_social) ÷ 1,000,000 kWh/hour` = `0.00350982 kWh/hour` (60 minutes per hour). Carbon and water are grid-/NREL-derived from that energy value, same as the other non-streaming activities.

For router wattage `P_router` (default 6.5 W):

`daily energy = P_router × 24 ÷ 1,000`

`daily carbon = daily energy × G`

`daily water = daily energy × W`

`annual value (each metric) = daily value × Y`

The combined digital-life activity total is the sum of streaming, video calls, gaming, and social media only; the router is always shown separately. Combined AI totals sum eligible text, image, and video entries only; coding sessions remain project-scope.

## Checklist

Replace or expand the implementation placeholders below with tasks specific to the approved specification.

### Approval gates

- [x] User has reviewed, verified, and approved the research claims and selected features
- [x] User has reviewed and approved the specification
- [x] User has reviewed and approved the implementation approach and task sequence

### Implementation

- [x] **Foundation:** Inspect the current row model, calculation helpers, render functions, URL hash format, reset flow, report generator, methodology, and styles. Define one backward-compatible state shape for typed entries and validation; preserve existing text rows and saved links where practical.
  - [x] Map the current text-row data flow from input through calculation, rendering, reset, report, and URL hash.
  - [x] Define shared entry fields, base units, min/max representation, and validation rules for all new input types.
  - [x] Add reusable numeric parsing and formatting helpers without changing existing text-row results.
  - [x] Establish a fixed calculation-fixture format for later hand checks.
- [x] **Shared retries:** Add a per-entry retry/regeneration multiplier, default 1 and constrained to values of 1 or more, to text, image, and video entries (coding entries excluded — 2026-09-23 revision to Feature 5). Apply it only to that entry's energy, carbon, and water before totals; add its no-average-evidence explanation.
  - [x] Add the multiplier to the shared entry state and defaults. (Text, image, and video entries default to `retry: 1`; coding sessions have no retry field.)
  - [x] Render a clearly labeled multiplier control for each applicable entry type. (Text, image, and video entries each expose a labeled multiplier.)
  - [x] Apply it once, at entry level, before the entry contributes to a subtotal or total. (Applied in text/media calculations before combined daily and annual totals; the existing text report includes text retries. Media report inclusion is complete.)
  - [x] Prevent values below 1 and document that values above 1 are user estimates, not a research average. (`clampInt` floors at 1; hint text under the usage rows states no research gives a typical retry rate.)
- [x] **Image and video generation:** Add image-output and video-output entries with clear units and incomplete/negative-input prevention. Implement the approved Stable-Diffusion-family proxy point estimate for image energy/carbon and derived water, plus the Veo 3.1 video min–max calculation for output count and duration, with a fixed 720p reference resolution. Render their contribution to combined AI totals without disguising image as a range or video as a point estimate.
  - [x] Add controls to create, edit, and remove image and video entries.
  - [x] Implement the image count calculation using the approved Luccioni proxy and NREL-derived water factor.
  - [x] Implement video min/max calculations using the Sustainable AI Group's Veo 3.1 8-second/720p reference range, multiplied by output count and `duration ÷ 8`, then Google's 1.09 PUE. Do not add a resolution control; use the NREL factor for visibly labeled derived water.
  - [x] Add row-level and combined-AI displays with unambiguous units and point-versus-range wording.
  - [x] Add plain-language source, proxy, derived-water, provider-representativeness, and peer-review limitation notes.
- [x] **Coding-project builder:** Replace the fixed coding/agent-session use case with addable, editable, removable lines-of-code session entries. Convert lines to tokens using the approved rough conversion, apply EcoLogits calculations without retries, render each session and a distinct project total, and show the two qualified reference anchors. Keep this project total outside daily/yearly AI totals.
  - [x] Add a dedicated project builder with create, edit, remove, and empty-state behavior for separate sessions. (Lives in its own "Coding agent — project sessions" section, moved out of the shared usage-row list entirely; `state.codingSessions` is a separate array from `state.rows`.)
  - [x] Convert lines of code to tokens with `lines × 10 ÷ 15%` and validate non-negative, complete entries. (`tokensForLines`; `clampInt` floors at 0, ceilings at 100,000 lines as an input-sanity bound.)
  - [x] Calculate each session with the existing EcoLogits per-token basis, without a retry multiplier. (`codingBasis` derives a linear rate from the model’s `agent` bucket ÷ 100,000 tokens; `codingSessionValues` scales by estimated tokens. The 1,500-line and 8,880-line fixtures retain observed results.)
  - [x] Render session-level energy, carbon, and water plus one distinct project total. (Per-session meta line + a `#aipf-project-total` callout summing all sessions.)
  - [x] Make the rough lines-to-token conversion and EcoLogits-only footprint basis inspectable in plain language; do not use Couch's separate energy method. (Hint text under the section spells out the conversion and explicitly disclaims Couch's own energy methodology.)
  - [x] Add the approximately 1,500-line fixed benchmark and approximately 8,900-line n=1 reference anchor with their required limitations. (Same hint text; both anchors labeled as non-typical.)
  - [x] Add clearly labeled project-scope carbon and water values to the comparison graph without converting them to activity hours or daily use. (2026-09-26: the daily comparison component includes “Coding — whole project (all sessions)” with a whole-project tag and scope explanation. It sums all sessions once, independently of pie selections, and is never annualized.)
  - URL-sharing for `codingSessions`, including pie selections, is complete (2026-09-26). Inclusion in the exported cited report is complete.
- [x] **Digital-life activities:** Add independently adjustable daily-hour controls for streaming, video calls, gaming, and social media. Calculate each energy/carbon/derived-water subtotal and their combined digital-life total, with yearly framing; preserve the stated sources, 1:1 video-call assumption, and confidence limitations.
  - [x] Add four independent daily-hour inputs with zero as the empty-use baseline and non-negative validation.
  - [x] Implement the locked energy factors for streaming, video calls, gaming (160–305 W range), and the project-derived social-media estimate (15.81 mAh/minute × 60 minutes/hour × 3.7 V).
  - [x] Implement carbon: streaming uses IEA's directly published figure; video-call, gaming, and social-media carbon are each grid-derived from energy via the selected-location factor `G`.
  - [x] Derive water consistently with the approved NREL electricity-to-water factor.
  - [x] Render per-activity daily/yearly energy, carbon, and water values plus a combined digital-life activity total; gaming renders as a min–max range, the other three as single point estimates.
  - [x] Show all four activities alongside the existing comparison values while retaining their separate digital-life category and total.
  - [x] Add inspectable, plain-language sources and limitations, including streaming's dated baseline, the 1:1 video-call undercount, gaming hardware assumptions, and the social-media derivation.
  - URL inclusion and reset are complete. Report inclusion is complete.
- [x] **Router baseline:** Add the adjustable 6.5 W, 24-hours-per-day router/gateway baseline with daily/yearly energy, carbon, and derived water. Keep it separate from both AI-use and combined digital-life activity totals, with the current-EU-allowance limitation.
  - [x] Add the wattage control with a default of 6.5 W, clear units, and non-negative validation.
  - [x] Calculate electricity at 24 hours per day, then calculate carbon and derived water.
  - [x] Render distinct daily/yearly router values that do not respond to activity-hour changes.
  - [x] Add source rationale and plain-language notes that it is an always-on baseline, not an activity-specific cost or a U.S. field measurement.
  - Reset restores 6.5 W and URL sharing preserves wattage. Report inclusion is complete.
- [x] **Outputs and evidence:** Update comparison bars to include the new digital-life values and clearly labeled project-scope carbon/water values. Extend the generated report, visible methodology, citations, plain-language source explanations, proxy/derived labels, and uncertainty notes for every new feature.
  - [x] Implement comparison-bar grouping and labels for daily/annual AI, digital-life activities, and router infrastructure.
  - [x] Add clearly labeled project-scope comparison bars. The shared comparison component displays the whole-project value in either metric, with explicit scope wording; annual totals remain separate.
  - [x] Update on-page metric formatting and totals so energy, carbon, water, single estimates, and min–max ranges remain distinguishable. (Report parity is tracked separately below.)
  - [x] Add methodology explanations for media, digital-life activities, and router calculations, with source/limitation notes in their input sections.
  - [x] Finish the methodology review for all approved features, including current coding-project scope and retry explanations; reconcile remaining legacy wording. (2026-09-26: explicit coding assumptions, no coding retries, mixed-range limitations, water-boundary qualifications, and corrected source attributions; unresolved factual verification is tracked below.)
  - [x] Extend the personalized report with the same inputs, totals, citations, and limitations shown in the calculator. (All entry types, company scenario, project scope, activity/router periods, and selected-session breakdown; source notes copied from the page. Browser popup and 1440px/375px overflow checks passed.)
  - [x] Check every numerical or factual claim has a working citation or is labeled as the calculator's own derivation. (2026-09-26: completed under the user-approved attribution/assumption standard: Masley provenance and unverified interval disclosure, 2025 OWID grid values, chosen router example, explicit workplace derivations, AC source, and approved removals. Actual browser report/page methodology parity and 1440px/375px overflow checks passed. This does not claim independent reproduction of inherited research.)
- [x] **State and interaction completion:** Update reset, share links, input event handling, accessible labels/live updates, and responsive styles for all approved controls. Confirm removing or changing an entry affects only its associated totals.
  - [x] Extend URL hash read/write behavior for new fields and safely ignore malformed saved values. (2026-09-26: versioned additional state saves image/video entries, coding sessions with chart selection, activity hours, router wattage, chart bound, and headcount; legacy text/grid/metric fields remain compatible. Empty text lists restore correctly.)
  - [x] Extend reset behavior to restore every approved default without affecting unrelated existing controls.
  - [x] Connect input events to the smallest necessary re-render and total updates.
  - [x] Add accessible names, live-result announcements where appropriate, keyboard-safe controls, and responsive layouts.
  - [x] Check add, edit, remove, and reset interactions for implemented input types. (Recorded browser results in `calculation-fixtures.md`.)
  - [x] Check all-input share serialization, restoration, and malformed-value handling in regression tests. (20 tests passed on 2026-09-26.)
  - [x] Check the new all-input Copy link flow end to end in a browser. (Real clipboard → fresh tab compared every input and key totals; reset, clipboard-denied manual fallback, and 375px layout passed. Fixed restored headcount display.)
- [x] **Optional feature — pie chart:** After the core features pass verification, add an accessible chart that switches between carbon and water and includes only new AI entries, digital-life activities, router baseline, and explicitly selected coding sessions. Provide values and a text alternative; selected sessions count once for the chosen day and never alter the project total.
  - [x] Confirm the five core features have passed their calculation and interface checks before starting this task.
  - [x] Define the chart data from new inputs only, excluding legacy lifestyle-footprint controls.
  - [x] Add carbon/water switching and text values equivalent to every visual slice.
  - [x] Add controls to select and remove individual coding sessions from the one-day chart contribution.
  - [x] Verify selection changes only the chart and never the coding-project total or unselected-session state.
- [x] Implement in the checkpoints above, updating this plan and the specification only when the approved intended result changes.

### Verification

- [x] Run fixed, hand-checkable calculation cases for every entry type, multiplier, video duration scaling at the fixed 720p reference resolution, lines-to-token conversion, each digital-life activity, router wattage, daily/yearly totals, and project-total separation; retain the expected values and observed results.
- [x] Check validation: negative and incomplete values cannot enter totals; retry values below 1 are rejected; changing/removing one entry leaves unrelated entries unchanged.
- [x] Check implemented interface behavior at desktop and narrow widths: add/edit/remove, metric switching, source/limitation visibility, point-versus-range wording, project-total labels, and reset. (Recorded media, activity, router, and pie browser checks in `calculation-fixtures.md`.)
- [x] Check the new all-input share-link round trip in a browser and verify report/project-bar behavior. (Report popup checked earlier; fresh-tab test now matches project bars and all key totals.)
- [x] Run `npm run build` from `project_1_executables` and resolve build errors before requesting user verification.
- [x] User has checked feature behavior and calculations against the specification and sources independently of the agent
- [x] User has confirmed factual and numerical claims have working citations and communicate important limitations or uncertainty
- [x] User has confirmed the project runs locally, serves all three reference profiles, and matches the specification

### Delivery

- [x] Commit meaningful checkpoints and export the working chat transcripts
- [ ] Add the provided Project 2 debrief, complete it after verification, and export its transcript

## Revisions

- 2026-09-26: Completed the state/interaction browser checkpoint. Fixed headcount input display after shared-link restoration and replaced false clipboard-success messages with a selectable manual-copy fallback for link/summary copying. Real clipboard sharing into a fresh tab restored every input and key totals, including project comparison bars. Reset, denied-clipboard handling, and 375px overflow checks passed. All 22 regression tests and build passed. Updated stale report-pending notes; citation audit and user verification remain open.

- 2026-09-26: Implemented complete report inputs/totals and shared evidence export, corrected coding/retry/range/water-scope methodology, and audited source links. Report browser checks, 22 regression tests, and build passed. Source review corrected Veo attribution to Veo 3 and the NREL citation to the historical 2003 report; gaming's console endpoint is explicitly a scenario. Constants unchanged. `evidence-audit.md` records corrections and unresolved claims; Outputs and evidence remains open only for full citation/claim verification. User approval gates unchanged.

- 2026-09-26: Added the whole coding-project total to the daily comparison-bar component with an explicit whole-project label, category tag, and explanation distinguishing its time scope. Session add/edit/model-change/remove, metric, grid, reset, and initial loading update the comparison. All sessions count once regardless of pie selection; no annual multiplier applies. Regression coverage checks both metrics, scope independence, grid changes, edits, and empty projects. All 21 tests and the production build passed; visual browser verification remains open.

- 2026-09-26: Audited checklist status against the current code, retained regression tests, and recorded browser/calculation fixtures. Checked completed foundation, on-page formatting, reset, event handling, accessibility/layout, calculation/validation, and build work. Split partially completed output and interaction checks into completed and remaining tasks. Corrected stale coding-retry and URL-sharing notes. Report parity, project-scope bars, full citation/methodology review, new browser share checks, delivery, and user verification remain open.

- 2026-09-26: Completed the URL-sharing portion of State and interaction completion. New links preserve all calculator inputs and chart selections, regenerate unique entry IDs on load, validate saved values with the existing input bounds, and ignore malformed or unsupported additional state. Existing text-only links remain supported. Updated visible sharing disclosures; report support remains pending. All 20 regression tests and `npm run build` passed. Browser round-trip checks and user verification remain open.

- 2026-09-25: At the user's direction, implemented the stretch pie chart in place of “What it writes,” after the five core features passed calculation and browser checks. The chart groups daily text/image/video use, shows the four activities and router, and includes only explicitly selected coding sessions (once per day, never changing project or daily AI totals). Carbon/water controls stay synchronized with the page. Lower/upper views use source endpoints without inventing a gaming average; the labeled table gives values, source ranges, and percentages. Removed obsolete word/read-time output helpers. Eighteen regression tests, browser interaction checks, light/dark mobile/desktop checks, and the build passed. URL/report inclusion remains deferred; user verification remains open.

- 2026-09-25: At the user's direction, styled all four add-entry controls as bordered, filled buttons with keyboard focus and hover states. Strengthened the AI heading hierarchy: semantic h2 “Your AI use,” larger accent-colored category headings, and smaller image/video subheadings. The parent subtitle now distinguishes daily use from project sessions. Calculation behavior is unchanged.

- 2026-09-24: Implemented the Home Wi-Fi/router baseline at the user's direction. Added a separate section after digital-life activities, a 6.5 W default with decimal validation (0–1,000 W input-sanity bounds), daily/yearly electricity and derived carbon/water, and independently tagged infrastructure bars. Uses a fixed 24 hours/day; excluded from AI, coding, and digital-activity totals. Reset restores the default. Added EU allowance/source limitations and methodology. Fifteen automated tests and desktop/mobile browser checks passed; user verification remains open. Report/share support stays deferred to the planned completion checkpoints.

- 2026-09-24: At the user's direction, replaced the location/home/driving/diet/flying lifestyle-profile section with the digital-life controls in the comparison column. Retained location solely as an electricity-grid setting. Removed personal-footprint state, calculations, percentage/proportion displays, and the report's profile breakdown. Headline and copied summary now show absolute AI totals. Fixed everyday comparison bars remain, since they do not depend on the removed profile. Old profile URL fields are ignored; text rows, metric, and grid still restore.

- 2026-09-24: Implemented the Digital-life activities checkpoint with four independent 0–24-hour decimal inputs (zero defaults), daily/yearly energy/carbon/derived-water results, and a separate combined activity total. Added tagged activity entries to daily and annual-add comparison bars; patterned ends show gaming's low/high range without inventing a mean. Digital-life values do not alter AI, coding-project, or lifestyle-baseline totals and exclude router wattage. Added source disclosures, methodology, reset, tests, and observed fixtures. Twelve automated checks, desktop/mobile browser checks, and the production build passed; user verification remains open.

- 2026-09-24: The user approved correcting the social-media source units after checking [Greenspector's original table](https://blog.greenspector.com/reseaux-sociaux-2021/): 15.81 mAh is per minute, not per hour. The 3.7 V assumption now gives `15.81 × 60 × 3.7 / 1,000,000 = 0.00350982 kWh/hour`, 60 times the previous estimate. The one-app/one-device proxy and derived carbon/water limitations remain.

- 2026-09-24: At the user's direction, implemented image/video generation in a Media generation section after coding sessions. Added count, retry, and whole-second duration controls; image point estimates; video energy/carbon ranges using the published mean for point totals; derived water; daily/annual/company totals; media-only empty-state handling; reset; source notes; and responsive styles. Report and URL inclusion remain deferred to Outputs and evidence / State and interaction completion, as in the reviewed draft, with a visible disclosure beside media inputs. Calculation tests and browser checks passed; user verification remains open.

- 2026-09-24: With user approval, tightened numeric validation before the media checkpoint. Whole-number fields now validate complete strings and commit on blur or Enter; invalid edits preserve the last valid calculation and show inline feedback. Decimal parsing rejects malformed values, and shared-link parsing applies the same integer validation while retaining legacy three-field rows. Added focused regression checks for parsing, edit/commit behavior, and saved links.

Record material changes to the approach, sequence, or checklist and explain why they were made.

- 2026-09-21: The user directed that the stretch pie chart be retained as an optional feature. It is sequenced after core-feature verification so it cannot obscure or delay the approved scope.
- 2026-09-22: Feature 1 is updated to remove video-resolution controls. The implementation will accept duration only and scale the 8-second Veo 3.1 reference estimate linearly, with that unsupported extrapolation labeled as the calculator's assumption. This replaces the obsolete EcoLogits/WUE/duration-and-resolution task wording.
- 2026-09-22: Locked the previously open calculation constants flagged in this plan. Verified directly against the Luccioni et al. paper that its 2.907 Wh/image figure is a genuine published average, but its 1,594 g CO2eq/1,000-inference figure is the single most carbon-intensive tested model, not an average — image carbon is now derived from average energy via the selected-location grid factor `G` (matching video/text treatment) instead of using that non-representative number. Video-call carbon is now explicitly grid-derived (Mytton publishes energy only). Gaming now uses a 160–305 W console-to-PC range instead of an unstated single wattage. Social media now uses Greenspector's measured TikTok figure (15.81 mAh/hour) with a standard 3.7 V nominal Li-ion voltage.
- 2026-09-23: At the user's direction, split the single usage-row list into labeled sub-sections instead of mixing every entry type in one table: "Chatbot & text" (existing text rows, now excluding the agent/coding size) and "Coding agent" (rows fixed to the agent benchmark, with a model picker but no output-length dropdown since there is only one). Both still read/write the same `state.rows` array, routed by the existing `isCodeRow()` check, so URL links, retries, and totals are unaffected. A third "Media generation" section will be added when Feature 1 (image/video) is built next. Interface/route change only — no calculation or requirement changes.
- 2026-09-23: At the user's direction, built the Coding-project builder (Feature 3) into the "Coding agent" section immediately after the reorg above, ahead of Feature 1 (image/video) in the plan's stated build order. Coding entries moved out of `state.rows` entirely into a new `state.codingSessions` array (`{uid, model, lines, retry}`), since a lines-of-code session is fundamentally not the same shape as a daily prompt count. `isCodeRow`, `linesForSize`, and `dailyCodeLines` were removed as dead code once no `state.rows` entry can be agent-sized anymore. Deferred to later checkpoints: URL-sharing for coding sessions and their inclusion in the exported report (see the Coding-project-builder checklist above for why).
- 2026-09-23: At the user's direction, removed the retry multiplier from coding-project sessions (`codingSessions` entries no longer carry a `retry` field or control). Rationale: a session's lines-of-code figure already describes one full run, and re-running an entire agent session rarely reproduces the same amount of code — unlike regenerating a short text, image, or video output, where the retry multiplier still applies. An employee who re-ran a whole session represents that as its own separate session instead. This revises the approved Feature 5 spec (see spec.md's 2026-09-23 entry); **Feature 5 needs updated user approval.**
- 2026-09-24: The user approved the revised Feature 5 (see spec.md's 2026-09-24 entry).

## Commands

### Start planning

User: Open the project repository as your workspace, start a fresh chat, and type `start planning`.

### Start implementation

User: After approving the plan, open the project repository in a fresh chat and type `start implementation`.

Agent: Read AGENTS.md, brief.md, spec.md, and this file, then inspect only the project files relevant to the approved work. Follow AGENTS.md and the approved plan. Do not begin implementation if the plan has not been approved. Keep the plan current, but never mark approval gates or user-verification items complete on the user's behalf.

### Save transcript

Agent: At the end of planning, remind the user that the transcript is a deliverable and ask them to say `save transcript`. Wait for that direction. When directed, save the entire conversation in the `transcripts/` directory as `plan-YYYY-MM-DD_HHMMSS.md`, mark user and agent responses clearly, and confirm the saved relative path.

Agent: At the end of every implementation chat, remind the user to say `save transcript`. When directed, save the entire conversation as `build-YYYY-MM-DD_HHMMSS.md` using the same location and formatting.

## Approved grid update — 2026-09-26

User approved adopting OWID/Ember 2025 lifecycle electricity-generation intensities: US384.40, EU27 209.897, UK217.41, China525.34, India670.13, World458.29 g CO2e/kWh. Implemented in the shared grid factors, visible methodology and report citations. Source rows are saved in `grid-factor-source-extract.csv`; download provenance is in `evidence-audit.md`. This supersedes the grid-source remediation finding above. Fixed historical everyday comparison scenarios retain their separately disclosed assumptions. Other audit findings remain open.

- 2026-09-26: Added user-requested Masley attribution identifying retained model records and carbon/water references separately from project additions. Reports inherit the methodology. Provenance does not imply independent reproduction; evidence limitations remain disclosed.

## User-directed evidence dispositions — 2026-09-26

Implemented: attribute the unverified 95% confidence-interval interpretation to Masley’s description of EcoLogits; label router6.5W as a chosen example (component-allowance claim removed); remove cruise, vegetarian, and fixed work-video-call comparisons; label the displayed commute-water0.15USgal as a back-of-the-envelope calculator assumption whose original inputs and boundary are undocumented. Adjustable video calls remain. Page methodology is included in reports. These dispositions supersede the corresponding remediation requests; they do not assert independent validation. Other water/source limitations remain open.

- 2026-09-26: User-directed cleanup: removed beer/wine rows and proxy methodology. Jeans now explicitly cites Masley for the displayed33kg and1321USgal (~5000L); removed conflicting10000L prose and disclosed unverified water boundary. Workplace figures are unchanged pending review of their derivations.

- 2026-09-26: User-approved source/scaling revision: explicitly attribute report printing, commute carbon, and coding record scaling to Masley, with formulas and limitations. AC now uses Integrity Services’ chosen2kW example for one hour (not an office average):2kWh × fixed2025US0.38440kg/kWh =0.7688kgCO2e;2×historicalNREL0.47=0.94USgal. Both AC reference bars and report methodology updated; earlier3kWh/1.14kg/1.4gal AC fixtures are superseded. Source: https://www.integrityacservice.com/about/blog/how-much-power-does-an-air-conditioner-really-use/

- 2026-09-26: User explicitly confirmed independent behavior/calculation/source verification and local operation with all three reference profiles. Checked all three user-verification gates and the completed implementation checkpoint. Delivery tasks for commits/transcript export and the Project 2 debrief remain open until completed.
