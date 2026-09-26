# Outputs and evidence audit — 2026-09-26

## Remaining-audit findings — 2026-09-26

The follow-up audit is recorded in [citation-audit-findings.md](citation-audit-findings.md). It separates verified source values, calculator assumptions, source/scope mismatches, and values whose provenance could not be established. This completes the review pass, **not** the citation acceptance gate: unresolved findings require remediation. Calculations have not been changed. Findings below from the earlier pass are historical; the follow-up supersedes their unresolved-link status where indicated.

## Implemented and verified

The report uses the same calculation helpers as the page for text/media AI totals, individual media entries, project sessions, digital activities, router, company scenario, and selected-session one-day breakdown. It retains gaming endpoints and media point-versus-range distinctions. Project values are never annualized. Current visible source/limitation paragraphs and methodology are included in the exported HTML, along with activity source notes. Internal evidence links are made absolute in the standalone report.

Browser checks opened the actual report popup with text, image, video, coding, gaming, and router data; checked copied source links; and confirmed no document overflow at 1440px and 375px. The automated suite has 22 passing tests, including mixed-media report totals and project separation. The production build passes. User verification is still open.

## Attribution corrections (calculations unchanged)

- Video: the paper's section 4.4 labels the 19.8–43.4 Wh range and 30.8 Wh mean as **Veo 3**, not Veo 3.1. The interface now follows that wording. Source: https://arxiv.org/html/2607.04553v1
- Water: the 0.47 gal/kWh factor is a historical U.S. thermoelectric value in NREL's 2003 *Consumptive Water Use for U.S. Power Production* (1995 data), not a universal contemporary factor. Correct source: https://www.nlr.gov/docs/fy04osti/33905.pdf
- Gaming: the current paper supports a 305.1 W weighted PC figure. The retained 160 W console endpoint is now labeled a calculator scenario instead of attributing the entire range to the paper. Source: https://arxiv.org/html/2608.19040v2
- Router: replaced the unavailable E3P link with the official version 9.0 record, https://publications.jrc.ec.europa.eu/repository/handle/JRC136991. The 6.5 W value remains an allowance-based scenario, not a field measurement.
- Paper water: replaced a 404 Report64 URL with the already-linked Report46 paper-water resource. The 5-gallon book value remains a rough calculator scenario; this link alone does not independently validate it.
- Removed obsolete golf methodology. Qualified claims that all water comparisons have identical accounting boundaries; they do not. Marked coding ratios and fixed everyday scenarios as calculator assumptions.

## Still unresolved — do not mark the full citation gate complete

- Greenspector's original social-media page returns 404. Follow-up located working secondary reproductions supporting 15.81 mAh/min (see below). The user approved retaining this figure with a source-provenance note; the primary-page limitation remains disclosed.
- Sony's legacy ecodesign link did not load; the appliance utility page and ACS tobacco source blocked automated requests. Wiley and IEA blocked direct requests but were readable through the web tool. GitHub returned 200 initially and 429 on a later check.
- Link availability does **not** prove every legacy number is supported. The retained product/water approximations, grid factors, router component sum, and embedded EcoLogits records still need a complete claim-by-claim reconciliation before the broad “every numerical or factual claim” gate can be checked.
- These findings correct source attribution, not user approval. The specification's previous Veo 3.1 and gaming-source wording is superseded by these review findings pending the user's review; approved calculation constants remain unchanged.

## Direct link checks

HTTP results describe this audit run; 403/429 can indicate access restrictions rather than a dead page.

| URL | Result |
|---|---|
| https://www.iea.org/commentaries/the-carbon-footprint-of-streaming-video-fact-checking-the-headlines | 403 |
| https://davidmytton.blog/zoom-video-conferencing-energy-and-emissions/ | 200 |
| https://arxiv.org/abs/2608.19040 | 200 |
| https://blog.greenspector.com/reseaux-sociaux-2021/ | 404 |
| https://publications.jrc.ec.europa.eu/repository/handle/JRC136991 | 200 |
| https://www.nlr.gov/docs/fy04osti/33905.pdf | 200 |
| https://ecologits.ai/ | 200 |
| https://huggingface.co/spaces/genai-impact/ecologits-calculator | 200 |
| https://github.com/genai-impact/ecologits/blob/main/ecologits/data/models.json | 429 |
| https://ecologits.ai/latest/ | 200 |
| https://ember-energy.org/latest-insights/global-electricity-review-2024/ | 200 |
| https://ourworldindata.org/grapher/carbon-intensity-electricity | 200 |
| https://simonpcouch.com/blog/2026-01-20-cc-impact/ | 200 |
| https://arxiv.org/abs/2311.16863 | 200 |
| https://arxiv.org/abs/2607.04553 | 200 |
| https://datacenters.google/efficiency/ | 200 |
| https://www.founderspledge.com/research/climate-and-lifestyle-report | 200 |
| https://iopscience.iop.org/article/10.1088/1748-9326/aa7541 | 200 |
| https://iopscience.iop.org/article/10.1088/1748-9326/ab8589 | 200 |
| https://howbadarebananas.com/ | 200 |
| https://www.epa.gov/sites/default/files/2018-02/documents/lca_tv.pdf | 200 |
| https://devera.ai/benchmarks/carbon-footprint-of-a-laptop | 200 |
| https://co2.myclimate.org/en/flight_calculators/new | 200 |
| https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle | 200 |
| https://www.cruisetricks.de/kreuzfahrt-co2-en/ | 200 |
| https://theconversation.com/coffee-heres-the-carbon-cost-of-your-daily-cup-and-how-to-make-it-climate-friendly-152629 | 200 |
| https://www.apple.com/environment/ | 200 |
| https://www.levistrauss.com/wp-content/uploads/2015/03/Full-LCA-Results-Deck-FINAL.pdf | 200 |
| https://www.weforum.org/stories/2019/03/hidden-water-in-your-cup-of-coffee/ | 200 |
| https://www.playstation.com/en-us/legal/ecodesign/ | apiRequestContext.get: Timeout 15000ms exceeded. |
| https://www.siliconvalleypower.com/residents/save-energy/appliance-energy-use-chart | 403 |
| https://www.epa.gov/watersense/showerheads | 200 |
| https://www.energystar.gov/products/dishwashers | 200 |
| https://www.energystar.gov/products/clothes_dryers | 200 |
| https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1530-9290.2011.00414.x | 403 |
| https://waterfootprint.org/resources/Report46-WaterFootprintPaper.pdf | 200 |
| https://www.compareandrecycle.co.uk/blog/world-water-week-how-much-water-does-your-smartphone-use | 200 |
| https://watercalculator.org/footprint/the-hidden-water-in-everyday-products/ | 200 |
| https://pacinst.org/wp-content/uploads/2013/02/bottled_water_and_energy3.pdf | 200 |
| https://pubs.acs.org/doi/10.1021/acs.est.8b01533 | 403 |
| https://www.waterfootprint.org/resources/Report45-WaterFootprint-Flowers-Kenya.pdf | 200 |
| https://www.waterfootprint.org/resources/Mekonnen-Hoekstra-2011-WaterFootprintCrops.pdf | 200 |
| https://www.epa.gov/watersense/landscaping-tips | 200 |
| https://www.eia.gov/tools/faqs/faq.php?id=97 | 200 |

## Follow-up: tracing the social-media coefficient

At the user's direction, recorded [Carbon Literacy, March 2023](https://carbonliteracy.com/the-carbon-cost-of-social-media/) as secondary evidence. It identifies Greenspector's Galaxy S7 study and reproduces TikTok's 2.63 g CO2e/min carbon result, but does not reproduce battery consumption. Its original Greenspector link also returns 404. This supports provenance, not independent replication.

The earliest explicit value located in the saved project transcripts is `build-2026-09-22_160000.md`, where the agent recommended 15.81 mAh/hr, attributing it to Greenspector. In `build-2026-09-25_205613.md` (lines 253–279), the agent reported reading a per-minute table and the user approved correcting the units. These transcript statements document the project's adoption of the number; they are not substitutes for the original measurement.

A subsequent exact-number search located secondary reproductions of the missing table:

- [Digital Humanities Climate Coalition toolkit](https://sas-dhrh.github.io/dhcc-toolkit/toolkit/working-practices.html): explicitly labels the energy column “1 minute, in mAh” and gives TikTok 15.81, alongside 2.63 g CO2e and 96.23 MB. It cites the original Greenspector 2021 URL.
- [CWR, Tis The Season To Be Worried: Our Online Habits](https://cwrrr.org/resources/analysis-reviews/tis-the-season-to-be-worried-our-online-habits/): reproduces TikTok's 15.81 value and attributes its table to Greenspector's 2021 edition.

The number and per-minute unit therefore have secondary corroboration, beyond our own transcript. The primary page remains unavailable, and these are reproductions of the same study rather than independent measurements. Calculator code, constants, and approval gates are unchanged.

## User decision — 2026-09-26

The user reports that their own research points to the same figure and directed inclusion of a source note. Retained 15.81 mAh/min unchanged and added the DHCC/CWR reproduction links and primary-source limitation to the social-media explanation, which is also included in the cited report. This resolves the request for a transparent note; it does not represent independent replication or approval of unrelated audit items.

## User link verification — Silicon Valley Power

On 2026-09-26, the user confirmed that [Silicon Valley Power’s Appliance Energy Use Chart](https://www.siliconvalleypower.com/residents/save-energy/appliance-energy-use-chart) opens in their browser. Its earlier HTTP 403 is an automated-access limitation, not evidence of a broken public link. Link availability is resolved by the user's check. This confirmation does not yet establish that each appliance wattage or energy figure used by the calculator matches the chart; numerical support remains a separate check.

## User link verification — EcoLogits model data

On 2026-09-26, the user also reported being able to open http://github.com/mlco2/ecologits/blob/main/ecologits/data/models.json. Recorded as user-confirmed access to the supplied URL. The calculator currently cites https://github.com/genai-impact/ecologits/blob/main/ecologits/data/models.json; its automated checks previously returned 200 and then 429. The supplied URL uses a different repository owner, so this note does not assert that the two URLs resolve to identical content. Verifying the embedded calculator records against the intended EcoLogits version remains a separate task. No calculator citation or data was changed.

## User link verification — IEA streaming study

On 2026-09-26, the user confirmed that [IEA’s streaming-video fact check](https://www.iea.org/commentaries/the-carbon-footprint-of-streaming-video-fact-checking-the-headlines) opens in their browser. This agrees with the earlier successful web-tool read; the direct-request HTTP 403 was an automated-access limitation. Link availability is resolved. This user confirmation concerns access, not independent verification of the calculator’s 0.077 kWh/hour and 36 g CO2/hour coefficients. No calculations or citations changed.

## User-selected router reference range — 2026-09-26

At the user’s direction, displayed a rough 5–20 W guide alongside the existing editable router wattage. This is power, not watts per day; continuous operation gives 0.12–0.48 kWh/day. The cited Future Tech Insights article provides no measurement provenance and has erroneous annual cost calculations, so its range is explicitly a user-selected guide rather than verified population evidence. Inputs outside the guide remain allowed. The existing 6.5 W default and calculation formulas are unchanged; its component-provenance finding remains open.

## OWID grid-factor comparison — 2026-09-26

Downloaded [OWID energy CSV](https://raw.githubusercontent.com/owid/energy-data/master/owid-energy-data.csv). Field `carbon_intensity_elec` is lifecycle electricity-generation intensity in g CO2e/kWh, sourced from Ember according to the [codebook](https://github.com/owid/energy-data/blob/master/owid-energy-codebook.csv). Selected EU entity is European Union (27). Extract saved in `grid-factor-source-extract.csv`; 2025 is the latest common available year for these six entities. Included 2023 for comparison with the previously cited 2024 report, and 2024 as an intermediate year. This is today's revised dataset, not a reconstruction of the original report vintage.

Downloaded full CSV SHA-256: `266f2e2baad7975351bc9bb4aa061d22b1da9fe4c47d51d2ac6071e01e171f76`. Retrieval date plus hash identifies the reviewed download; master is mutable.

| Region | Calculator | OWID 2023 | OWID 2024 | OWID 2025 |
|---|---:|---:|---:|---:|
| United States | 380 | 392.890 | 383.780 | 384.400 |
| European Union (27) | 215 | 235.842 | 211.203 | 209.897 |
| United Kingdom | 125 | 235.630 | 216.500 | 217.410 |
| China | 580 | 583.040 | 555.400 | 525.340 |
| India | 700 | 713.360 | 705.400 | 670.130 |
| World | 480 | 483.180 | 471.080 | 458.290 |

The existing set is not verified as a consistent year of this dataset. UK125 is particularly discrepant (2025:217.41). Differences do not establish the original values were fabricated: year, source revision or emissions boundary may differ. Proposed replacement basis: all six 2025 lifecycle values, with explicit year and EU27 label. No calculator constants changed; adoption and methodology update remain pending.

## Approved grid update — 2026-09-26

User approved adopting OWID/Ember 2025 lifecycle electricity-generation intensities: US384.40, EU27 209.897, UK217.41, China525.34, India670.13, World458.29 g CO2e/kWh. Implemented in the shared grid factors, visible methodology and report citations. Source rows are saved in `grid-factor-source-extract.csv`; download provenance is in `evidence-audit.md`. This supersedes the grid-source remediation finding above. Fixed historical everyday comparison scenarios retain their separately disclosed assumptions. Other audit findings remain open.

## Upstream provenance comparison — 2026-09-26

Compared current code with https://andymasley.com/visuals/ai-prompt-footprint-source.txt supplied by the user. Parsed MODELS arrays are identical: all 72 model/size records are inherited unchanged. This resolves immediate code provenance, not independent EcoLogits reproduction.

Array differences confirm inherited appliance/product carbon figures, most lifestyle cuts, and clothing/phone/book/lawn water references. Project additions or alterations include router, digital-life inputs, beer/wine/bottle/tobacco/rose water references, workplace comparisons, cruise, and vegetarian substitution. Thus audit findings must distinguish inherited limitations from project-added assumptions. The source supplied today may differ from the original assignment snapshot.

Retained upstream estimates can be attributed explicitly to Masley with their limitations; they should not be described as independently reproduced. The broad all-claims acceptance gate remains distinct from assignment implementation completeness.

- 2026-09-26: Added user-requested Masley attribution identifying retained model records and carbon/water references separately from project additions. Reports inherit the methodology. Provenance does not imply independent reproduction; evidence limitations remain disclosed.

## User-directed evidence dispositions — 2026-09-26

Implemented: attribute the unverified 95% confidence-interval interpretation to Masley’s description of EcoLogits; label router6.5W as a chosen example (component-allowance claim removed); remove cruise, vegetarian, and fixed work-video-call comparisons; label the displayed commute-water0.15USgal as a back-of-the-envelope calculator assumption whose original inputs and boundary are undocumented. Adjustable video calls remain. Page methodology is included in reports. These dispositions supersede the corresponding remediation requests; they do not assert independent validation. Other water/source limitations remain open.

- 2026-09-26: User-directed cleanup: removed beer/wine rows and proxy methodology. Jeans now explicitly cites Masley for the displayed33kg and1321USgal (~5000L); removed conflicting10000L prose and disclosed unverified water boundary. Workplace figures are unchanged pending review of their derivations.

- 2026-09-26: User-approved source/scaling revision: explicitly attribute report printing, commute carbon, and coding record scaling to Masley, with formulas and limitations. AC now uses Integrity Services’ chosen2kW example for one hour (not an office average):2kWh × fixed2025US0.38440kg/kWh =0.7688kgCO2e;2×historicalNREL0.47=0.94USgal. Both AC reference bars and report methodology updated; earlier3kWh/1.14kg/1.4gal AC fixtures are superseded. Source: https://www.integrityacservice.com/about/blog/how-much-power-does-an-air-conditioner-really-use/

## Accepted closure — report consistency verified 2026-09-26

Outputs and evidence is complete under the user's approved provenance/assumption standard. Earlier unresolved lists document the audit history, not outstanding implementation requirements for accepted inherited estimates. Independent reproduction of those estimates remains outside this acceptance claim.

A real browser opened the generated report after adding image, video, coding, pie selection and gaming inputs. Verified complete current page methodology appears in the report; approved interval/router/commute disclosures, Masley scaling,2025 grid and revisedAC figures are present; alcohol/cruise/vegetarian/fixed-call comparisons are absent; source links are copied; no page JavaScript errors; no report overflow at1440px or375px. This pass checked citation inclusion, not fresh HTTP requests to every external destination. Previously recorded source-access limitations still apply.
