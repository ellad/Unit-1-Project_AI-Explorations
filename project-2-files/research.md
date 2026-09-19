# Research

> EDITING DIRECTIVE: USER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE USER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Develop and record the evidence and decisions that will guide the technical specification.

## Instructions for the user

You are responsible for the ethics, accuracy, and fairness of the research. Direct the inquiry toward useful questions, judge sources and suggestions rather than accepting them at face value, and approve only results supported by verified evidence and audience needs. Seek evidence that challenges your assumptions, represent uncertainty honestly, and reject claims you cannot verify. See [UNESCO's Guidance for generative AI in education and research](https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research).

## Instructions for the agent

Read AGENTS.md, brief.md, and this file. Begin with a concise orientation and one focused question.

Guide the research one stage at a time. Help the user explore options, assess sources, and identify contrary evidence or uncertainty without making decisions for them. Draft concise updates for review, and never mark research or feature choices approved on the user's behalf.

## Reference employee profiles

- Alex — Los Angeles, 24, junior video editor: Uses text, image, and video-generation tools for production work. Streams reference media and uses social platforms across a phone, laptop, and television. Wants to understand impacts beyond text prompts and is particularly attentive to water use.
- Jordan — Austin, 38, creative technologist: Uses coding agents and generative tools in long, irregular sessions. Games on a desktop PC and participates in frequent video calls. Finds "prompts per day" too simplistic and wants assumptions, ranges, and project-level totals.
- Robin — Chicago, 56, operations manager: Uses text AI occasionally but spends substantial time in video meetings, streaming media, and social platforms. Is skeptical of the company's motives and needs plain-language explanations, visible sources, and honest indications of uncertainty.

These are fictional starting profiles, not evidence about demographic groups. Research the activities, circumstances, and needs they represent rather than making assumptions based on age or location.

## Audience needs

Baseline checked against Andy Masley's live calculator (`https://andymasley.com/visuals/ai-prompt-footprint/`) and its frozen source snapshot (commit `b77144e`, see project memory), used only as the starting point — not the Project 1 fork's later changes.

Confirmed gaps (verified directly in the source, not assumed):

- **No image/video generation coverage.** The source explicitly states it "Excludes training, image and video generation, and retries" — only text-prompt LLM output (ChatGPT/Claude/Gemini) is modeled. Directly affects **Alex** (video editor using image/video-gen tools daily as part of the job).
- **No broader digital-life activities.** The tool only compares AI use against physical-world lifestyle items (diet, driving, flights, home energy) and household objects (coffee, jeans, smartphone, dishwasher). No video calls, streaming, gaming, or social media anywhere. Affects **Jordan** (frequent video calls, gaming), **Robin** (video meetings, streaming, social platforms), and **Alex** (streaming, social platforms).

Already reasonably well-served by the existing calculator, so not treated as gaps needing a full feature slot:

- Per-model ranges with explicit uncertainty language (min/max, caveated Claude MoE assumption).
- Blue-water-only methodology with citations.

Confirmed gap 3 — **the "coding / agent session" size is a single fixed benchmark, not a range.** Verified directly with EcoLogits: it's one of eight standardized *content-length* benchmarks (tweet=50 tokens ... coding/agent session=100,000 ... novel-rewrite=500,000) — a fixed constant, not a measured usage distribution. Real usage data ([Couch, 2026](https://simonpcouch.com/blog/2026-01-20-cc-impact/), n=1 self-logged) shows a median real Claude Code session runs ~592,000 tokens, ~6x the fixed benchmark. Affects **Jordan** directly (long, irregular coding-agent sessions; explicitly finds a single number too simplistic).

Project-level/multi-session totals — Jordan's specific ask for totals across a project rather than only a "per day" snapshot — is now folded into Feature 3 as a project-builder mode (see Possible features).

The fifth feature ("the strongest remaining need") is **retries/regenerations exclusion**. The source explicitly excludes retries — one of the two confirmed gaps identified at the very start of this research, alongside image/video-gen coverage. No credible source gives a usable average retry count to use as a default (the closest leads — a 2024 survey on feedback-after-regeneration, a 2025 image-regeneration study — either measure a different thing or use a fixed experimental protocol rather than organic behavior), so it's built as a user-adjustable multiplier with no invented default rather than a sourced figure (see Possible features).

## Possible features

### 1. Image & video generation footprint

- **What it helps someone do:** Add image-gen and video-gen entries to the usage builder, alongside existing text-model rows, so professional AI use is represented beyond chat prompts.
- **Serves:** Alex directly (daily image/video-gen use); gives Jordan and Robin a fuller picture of what "AI use" covers.
- **Evidence/implementation challenge:** Public per-image/per-video energy and water data is much thinner than the token-based EcoLogits data already used for text. Video generation has a strong, methodologically-consistent source (see Source assessments); image generation does not have a published water figure at all and relies on older open-source models as a proxy for closed commercial tools.

### 2. Digital-life activity comparisons

- **What it helps someone do:** Adds a comparison category (streaming, video calls, gaming, social media) parallel to the calculator's existing "everyday things" comparisons, so AI use is set against other digital habits, not just physical-world lifestyle items.
- **Serves:** Jordan (video calls, gaming), Robin (video meetings, streaming, social platforms), Alex (streaming, social platforms).
- **Evidence/implementation challenge:** This space has a well-documented credibility problem — the widely-cited "streaming = driving X miles" claim traced to a 2019 Shift Project report (a Mbps/MBps unit error, an 8x overstatement) that was later corrected after IEA and others reviewed it. Sourcing quality varies sharply by activity (see Source assessments) — one candidate source for social media was found to reuse the same debunked methodology and was rejected outright.

### 3. Coding/agent session intensity range

- **What it helps someone do:** Replaces the single fixed "coding / agent session" size option with more than one grounded point (a "standard" tier at the existing EcoLogits benchmark, and a "heavy/extended" tier reflecting real long sessions), so professional coding-agent use isn't represented by one fixed number.
- **Serves:** Jordan directly (long, irregular coding-agent sessions; explicitly dissatisfied with "prompts per day" as too simplistic).
- **Evidence/implementation challenge:** Only two grounded data points exist, not a smooth range — EcoLogits' fixed 100,000-token benchmark (already used) and Couch's n=1 real-usage figure (~592,000 tokens/session). The two figures also come from different energy-per-token methodologies (EcoLogits vs. Couch's Epoch AI/Anthropic-pricing back-solve) — only the token-count figures are borrowed from Couch; the energy math stays on EcoLogits' existing per-token basis throughout to avoid mixing methods.
- **Locked design:** rather than presets or raw token entry, the input is a free-entry **lines-of-code** field — most professionals track this, not token counts. This reuses a conversion the calculator already has and already flags as a rough estimate: `tokens × 15% code-fraction ÷ 10 tokens/line` (Masley's own existing constants, `CODE_FRACTION` and `TOKENS_PER_LINE` in the source). Applying that same ratio to both sourced points gives reference anchors shown for context: a standard benchmark session ≈ **1,500 lines** (100,000 tokens), and one real heavy user's session averaged ≈ **8,900 lines** (592,000 tokens). "Number of files" was considered and rejected as the input unit — file size varies too widely (5 vs. 5,000 lines) to support a defensible token estimate without inventing a new, unsourced ratio.
- **Project-total mode (addresses Jordan's project-level-totals ask):** in addition to a single session entry, users can add multiple distinct session entries — each its own lines-of-code value, since a real project is a specific mix of session sizes over its duration, not identical repeated sessions — and see one summed project total (energy/carbon/water), separate from the calculator's existing per-day/per-year framing rather than forced through it. No new sourcing needed: each entry reuses the same lines-of-code-to-token conversion and EcoLogits per-token math already locked in above; this only changes how entries are combined for the coding/agent-session row specifically.

### 4. Home Wi-Fi/router baseline

- **What it helps someone do:** Adds "running your home Wi-Fi router/gateway for a day" as a comparison item alongside the calculator's existing household-object comparisons. Unlike Feature 2's per-activity items, this is a constant, always-on baseline — the infrastructure cost of being online at all, independent of what any specific activity (AI included) adds on top of it.
- **Serves:** All three profiles equally — everyone needs a home network connection to do anything digital, AI use included, so this doesn't hinge on any one profile's specific habits the way gaming or video calls do.
- **Evidence/implementation challenge:** None of the individual sources found (see below) are strong on their own — one is a 2013 field study, one is decade-old US certification data — but they triangulate: three independent sources/methods (a 2013 field study, 2013 US certification allowances, and current 2024/2025 EU regulatory data) all converge on the same 5-10W continuous-draw order of magnitude for a home router/gateway, which is meaningfully more corroborated than most other sources used in this document.

### 5. Retries/regenerations multiplier

- **What it helps someone do:** Adds a user-adjustable "how many retries/regenerations" multiplier to every row in the usage table (text, image, video, coding), addressing the source's explicit "excludes... retries" gap — one of the two confirmed gaps identified at the very start of this research.
- **Serves:** Alex directly (regenerating image/video outputs is normal creative-workflow behavior); also Jordan and anyone iterating on text or code drafts.
- **Evidence/implementation challenge:** No credible source gives a usable average retry count from organic usage — investigated earlier (a 2024 feedback-after-regeneration survey measures a different thing; a 2025 image-regeneration study used a fixed experimental protocol, not organic behavior). Rather than invent a default, the multiplier defaults to **1** (today's implicit no-retries assumption, unchanged unless the user says otherwise), with methodology notes stating plainly that any number above 1 is the user's own estimate of their habits, not a research-backed figure.

Rejected as the second digital-life feature:

- **AI prompt vs. web search comparison** — Google's AI Overviews now sit in front of most searches by default, so "a plain web search" no longer cleanly represents a non-AI baseline for most users. The comparison doesn't hold up on its own terms, independent of sourcing quality.
- **Personal device (laptop/desktop/TV) electricity baseline** — investigated first; looked promising (EPA Energy Star is a primary government source) but hit three dead ends: cloud/data-storage figures resembled the debunked 2019 Shift Project streaming methodology; EIA's residential survey doesn't publish "computers" as a standalone category; Energy Star's own computer spec states EPA has no standardized active-mode test methodology. See Source assessments for the full trail.

## Source assessments

### Feature 1: Image & video generation footprint

| Source | Claim used | Checked | Limitations | Decision |
|---|---|---|---|---|
| [EcoLogits Video Generation methodology](https://ecologits.ai/latest/blog/) (June 2026) | Per-video energy, carbon, water, and resource-depletion estimates from duration/resolution/model size | Confirmed via EcoLogits blog and methodology pages; same framework already used for text models in the current calculator | Built on a paper still in peer review (see next row) | Use |
| Sustainable AI Group, ["Lights, Camera, Carbon: Architectural Scaling Laws for Video Generation Energy Consumption"](https://arxiv.org/abs/2607.04553) | Underlying scaling-law methodology EcoLogits' video estimates are based on; validated to <3% error across 6 open models, 8.3B-27B params | Read abstract/HTML; confirmed integration with EcoLogits/e-footprint/BoaVizta | Currently under peer review, not yet finalized | Use, with a note that the underlying paper is pending peer review |
| Luccioni, Jernite & Strubell, ["Power Hungry Processing: Watts Driving the Cost of AI Deployment?"](https://arxiv.org/abs/2311.16863) (FAccT 2024) | Image generation energy (~2.9 Wh/image average) and carbon (e.g. ~1,594g CO2eq/1,000 images for Stable Diffusion XL) | Read full HTML paper; confirmed models tested (8 Stable Diffusion-family models), hardware (A100 GPUs), and grid assumption (Oregon, 297.6g CO2/kWh) | Tests only open-source SD variants (2023-era), not closed commercial tools (DALL-E, Midjourney, Gemini image) that a professional like Alex would actually use; authors explicitly did **not** measure water at all | Use with qualifications — energy/carbon only, flagged as a proxy for commercial tools, not a direct measurement |
| EcoLogits methodology page, Image Generation status | N/A — used to confirm absence of an official source | Confirmed directly: EcoLogits lists Image Generation as "upcoming," not yet implemented | — | Informational — explains why we fall back to Luccioni et al. and a derived water estimate |
| NREL, freshwater-per-kWh factor (~0.47 gal/kWh) — already cited in the existing calculator's methodology notes for appliance electricity | Basis for deriving an image-gen water estimate from Luccioni's energy figures, since no image-gen water figure exists anywhere | Confirmed the factor is already used elsewhere in the current calculator (kWh → water for personal-footprint appliance comparisons), so reusing it for image-gen keeps the document's methodology internally consistent | This is a derived estimate, not a measured figure, and must be visually/textually distinguished from directly-sourced numbers | Use, clearly labeled as derived, not measured |

### Feature 2: Digital-life activity comparisons

| Source | Claim used | Checked | Limitations | Decision |
|---|---|---|---|---|
| [IEA, "The carbon footprint of streaming video: fact-checking the headlines"](https://www.iea.org/commentaries/the-carbon-footprint-of-streaming-video-fact-checking-the-headlines) (Dec 2020) | ~0.077 kWh and 36g CO2 per hour of streaming (global average grid, 2019 baseline) | Read full article directly; confirmed it explicitly corrects the Shift Project's original 6.1 kWh/hr figure (traced to a Mbps/MBps conversion error, ~8x overstatement) | 2019/2020-dated baseline; may undercount today's higher-resolution (4K) streaming | Use — most credible figure found, and naming the correction matches the calculator's existing transparency style |
| David Mytton, ["Zoom, video conferencing, energy, and emissions"](https://davidmytton.blog/zoom-video-conferencing-energy-and-emissions/) | ~0.049 kWh/hr for a 1:1 HD 1080p video call (scales with participants/camera use) | Read full post directly; methodology (bandwidth × network energy intensity) is transparent | Explicitly excludes data-center and device energy (likely an undercount); author's own 2023 update cautions against using this method for present-day assessments | Use with qualifications — flag as a likely undercount |
| ["Assessing the Carbon Footprint of Virtual Meetings: A Quantitative Analysis of Camera Usage"](https://arxiv.org/abs/2601.06045) (IARIA GREEN 2025) | Considered as an alternative/supplement to Mytton for video calls | Read abstract; scope is mobile 4G only, and the paper was noted as requiring corrections before final publication | Too narrow (mobile-only) and not yet finalized | Reject for now — Mytton remains the primary source |
| ["Hot Games" (LOCO 2026 workshop paper)](https://arxiv.org/abs/2608.19040) | Device wattage basis for gaming estimate (~305W PC / ~160-200W console) × hours of use | Read full HTML paper; authors transparent about using a "piecemeal approach" and explicitly call their own numbers "crude estimates" | No standard "per hour" figure exists across hardware types; mobile gaming excluded entirely by the authors; no water data | Use with qualifications — clearly the lowest-confidence published source in this set |
| Batmunkh, ["Carbon Footprint of The Most Popular Social Media Platforms"](https://www.mdpi.com/2071-1050/14/4/2195) (MDPI Sustainability, 2022) | Considered as a source for social media energy/carbon | Checked directly: the paper reuses Shift Project-style methodology and produces implausible results (e.g. "Netflix = 1,682g CO2e/hour," ~46x IEA's corrected estimate) | Reproduces the exact debunked-methodology problem flagged for streaming | **Reject** — not used for any figure |
| Greenspector, 2021 mobile app energy study (mAh per hour, e.g. TikTok 15.81 mAh/hr) | Basis for our own device-power estimate for social media, since no credible published carbon/energy figure exists | Confirmed as a real device-measurement study (not a carbon-footprint claim itself) | Single study, single device (Android S7, 2021); mAh must be converted to Wh ourselves; this is our own back-of-envelope estimate, not a cited external claim | Use as input to our own estimate only — must be clearly labeled as our estimate, not a study finding |
| NREL freshwater-per-kWh factor (same as Feature 1) | Water estimate for all four digital-habit activities, since none have a published water figure | Same factor already used elsewhere in the calculator | Derived, not measured | Use, clearly labeled as derived |

### Feature 3: Coding/agent session intensity range

| Source | Claim used | Checked | Limitations | Decision |
|---|---|---|---|---|
| EcoLogits benchmark suite (blog/methodology pages) | The existing "coding / agent session" option (100,000 tokens) is one of eight fixed standardized *content-length* benchmarks (tweet=50 ... novel-rewrite=500,000), not a measured usage distribution | Confirmed directly via EcoLogits blog; this is the same benchmark already relied on in the current calculator | It's explicitly a standard task-length benchmark, not survey/log data of real sessions | Use — as the anchor for the "standard" tier (unchanged from today) |
| Simon P. Couch, ["Electricity use of AI coding agents"](https://simonpcouch.com/blog/2026-01-20-cc-impact/) (2026) | Real Claude Code session-length data: median session ~592,000 tokens (24 requests), heavy work-days reaching much higher | Read full post directly; methodology and caveats confirmed | Author's own logs only (n=1); author explicitly calls it "Sunday afternoon napkin math"; his per-token energy figure is back-solved from a different chain (Epoch AI + Anthropic pricing) than EcoLogits uses, so only the **token-count** figure is borrowed, not his energy number | Use with qualifications — token-count only, clearly flagged as a single self-reported data point, not a study or survey |

### Feature 4: Home Wi-Fi/router baseline

| Source | Claim used | Checked | Limitations | Decision |
|---|---|---|---|---|
| NRDC, ["Small Network Equipment Energy Consumption in U.S. Homes"](https://www.nrdc.org/sites/default/files/residential-network-IP.pdf) (June 2013) | Field-measured data: average home modem+router combination draws a constant ~5-9W, totaling ~94 kWh/year per household — "nearly the same as a new 32-inch Energy Star laptop" | Read the full report directly; real device measurements across multiple purchased/leased models, not modeled estimates | 2013 report, models tested introduced 2009-2012 — router/gateway hardware has changed since | Use as the field-measurement anchor, flagged as dated |
| EPA, ENERGY STAR Small Network Equipment Program Requirements v1.0 (2013) | Base power allowances: Router 3.1W, cable modem 5.7W, integrated gateway (cable) 6.1W | Read the actual spec PDF directly (Table 1) | 2013 certification allowances; a 2020 discussion guide only updated test methodology, not the wattage figures — no more recent US figure exists | Use as corroborating evidence, flagged as dated |
| EU Joint Research Centre, [Broadband Equipment Code of Conduct, Version 9.0](https://e3p.jrc.ec.europa.eu/en/publications/eu-code-conduct-energy-consumption-broadband-equipment-version-90-current-version) (2024, current 2024/2025 tiers) | Current regulatory on-state power allowances by component: e.g. a modern Wi-Fi 6 (802.11ax) gateway with Gigabit Ethernet WAN ≈ 6.5W on-state total (central function + connected interface + two Wi-Fi radios), built up directly from the document's own tables | Read the full document directly (Tables 10 and 11); genuinely current, still in effect | EU regulatory allowances, not US-specific field measurements; a built-up estimate (summed from component tables) rather than a single all-in-one published figure | Use as the primary current figure — corroborates the two older sources' order of magnitude |
| NREL freshwater-per-kWh factor (same as Features 1-3) | Water estimate for router electricity, since no published water figure exists for networking equipment specifically | Same factor already used elsewhere in the calculator | Derived, not measured | Use, clearly labeled as derived |

### Feature 5: Retries/regenerations multiplier

| Source | Claim considered | Checked | Limitations | Decision |
|---|---|---|---|---|
| Cooper & Zafiroglu, ["Constraining Participation: Affordances of Feedback Features in Interfaces to Large Language Models"](https://arxiv.org/abs/2408.15066) (2024, survey n=526) | Considered for a regeneration-frequency figure | Read directly | Measures *feedback submission after* regenerating, not how often people regenerate — a different metric; also dated to a much earlier (May 2023) ChatGPT era | Reject — doesn't measure the thing needed |
| ["A Picture is Worth a Thousand Prompts?"](https://arxiv.org/abs/2504.20340) (IJCAI 2025) | Considered for an image-regeneration iteration count | Read directly | Participants were told to do up to 10 iterations as a fixed experimental protocol — a study design parameter, not organic usage data | Reject — not real-world behavior |
| (No source) | N/A | Confirmed no credible source exists for organic retry-behavior counts, for any output type | — | No default used — multiplier defaults to 1, methodology notes state plainly that any higher number is the user's own estimate |

### Rejected candidates for the second digital-life feature

AI prompt vs. web search was rejected on its own terms (see Possible features) before sourcing quality became the deciding factor, so no source table is needed for it. Personal device electricity baseline:

| Source | Claim considered | Checked | Why rejected |
|---|---|---|---|
| Cloud/data storage figures (Stanford Magazine citing Carnegie Mellon/ACEEE) | ~3-7 kWh/GB stored | Read directly | Pattern strongly resembles the debunked 2019 Shift Project streaming methodology (outdated datacenter-efficiency assumptions); not independently verified before rejecting |
| EIA Residential Energy Consumption Survey (RECS) | Household-level "computers" electricity end use | Read directly (2015 and 2020 releases) | EIA explicitly does not publish "computers" as a standalone category — lumped into "not elsewhere classified" with smartphones and small kitchen appliances |
| EPA Energy Star Computer/TV specifications | Typical Energy Consumption (TEC) and/or active-mode wattage | Read the actual spec PDF directly | TEC is a certification-allowance ceiling based on an idle/sleep/off-dominated duty cycle, not real active-use data; the spec document itself states EPA has no standardized active-mode test methodology yet |
| Michael Bluejay, "How much electricity does my computer/TV use?" | Independently measured/compiled wattage: desktop 60-250W, laptop 15-60W, TV 80-400W | Read both pages directly | Real independent source (own measurements + manufacturer specs + CNET), but the TV size/technology breakdown table is from 2008-09 model years — set aside once the better-corroborated Wi-Fi/router option (Feature 4) was found |

## Selected features

1. **Image & video generation footprint** — APPROVED. Extends the existing model/output-type table with image-gen and video-gen rows. Serves Alex directly; broadens the picture for Jordan and Robin. Video generation uses EcoLogits (same methodology family as the rest of the calculator); image generation uses Luccioni et al. for energy/carbon with a clearly-flagged derived-estimate for water.
2. **Digital-life activity comparisons** — APPROVED. Adds streaming, video calls, gaming, and social media as a comparison category alongside existing "everyday things." Serves Jordan, Robin, and Alex. Sourcing confidence is tiered and must stay visible in the UI: streaming (high confidence, IEA), video calls and gaming (medium/lower confidence, published but caveated), social media (our own estimate, not an external citation).
3. **Coding/agent session intensity range** — APPROVED (expanded). Replaces the single fixed "coding / agent session" size with a free-entry lines-of-code input, converted via the calculator's own existing token/line ratio. Serves Jordan directly. Two sourced reference points shown for context: ~1,500 lines (EcoLogits' existing 100k-token benchmark, unchanged) and ~8,900 lines (Couch's n=1 real-usage data point, clearly flagged as a single self-reported figure). Energy math stays on EcoLogits' per-token methodology throughout. Now also includes a **project-total mode**: multiple distinct session entries (varying lines-of-code) summed into one project total, separate from the per-day/per-year framing — directly addresses Jordan's "project-level totals" ask, reusing the same sourcing and conversion, no new evidence needed.
4. **Home Wi-Fi/router baseline** — APPROVED. Adds "running your home Wi-Fi router/gateway for a day" as a comparison item — the always-on infrastructure cost of being online, distinct from Feature 2's per-activity comparisons. Serves all three profiles equally. Backed by three independently-sourced figures (2013 NRDC field measurements, 2013 US Energy Star allowances, current 2024/2025 EU regulatory data) that converge on the same 5-10W order of magnitude — the best-corroborated sourcing found for any digital-life feature in this document. Two rejected alternatives considered first: AI prompt vs. web search (no longer a clean non-AI baseline now that Google's AI Overviews sit in front of most searches) and a personal device electricity baseline (sourcing dead ends — see Source assessments).
5. **Retries/regenerations multiplier** — APPROVED. The fifth feature ("the strongest remaining need") — one of the two confirmed gaps identified at the start of this research, now addressed. User-adjustable multiplier on every usage-table row, defaulting to 1 (no invented default), since no credible source exists for real-world retry behavior. Serves Alex directly; relevant to Jordan and any iterative use.

All five features are identified and approved. Remaining work: a formal selection-rationale/alternatives-considered pass across all five, then moving to the technical specification.

User approval: Review the completed research directly. Confirm that sources exist and support the claims the project will use, correct the document as needed, and explicitly approve the selected features before developing the specification. The agent cannot complete this approval on the user's behalf.

## Commands

### Start research

User: Open the project repository as your workspace, start a fresh chat, and type `start research`.

### Save transcript

Agent: After the user approves the selected features, remind them that the transcript is a deliverable and ask them to say `save transcript`. Wait for that direction.

When the user directs the agent to save the transcript, the agent saves the entire conversation in the `transcripts/` directory as `research-YYYY-MM-DD_HHMMSS.md`, marks user and agent responses clearly, and confirms the saved relative path.
