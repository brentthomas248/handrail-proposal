# Round 1 — Art direction and material quality

**Score: 94/100. Two P2 findings require correction or an evidence-backed disposition before release. No P0 or P1 finding.** The Handrail identity and matte material treatment are convincing. The remaining weakness is the composition of settled reading scenes, particularly neighboring fragments and the phone paper's bottom margin.

## Candidate and scope

- Assigned frozen application: `33f64ef`; live URL: `http://127.0.0.1:4321/handrail-proposal/`.
- Repository HEAD observed: `a499369a8629c3007de53760b0345446b6e77476` (documentation checkpoint). Served script: `_astro/index.astro_astro_type_script_index_0_lang.Cq-k_JAy.js`.
- Own headed Chromium capture began `2026-09-27T14:43:37.033Z`. Desktop 1440×1000 at DPR 1; phone 390×844 and short phone 390×664 at DPR 3.
- Captured 49 original tour viewport frames: folded opening, three unfolding positions per viewport, every reading endpoint, inter-chapter wheel movement and selected immediate reversals. Also captured ordinary-reading full pages and independently inspected both phone reading-mode top viewports.
- Original viewport images were inspected individually, including initial/unfolding faces, desktop reading positions 1–5, phone reading positions 1–6, short-phone opening/cover/cash/rate/window positions, crease transitions and reverse frames. A contact sheet was not used as acceptance evidence.
- All capture scripts and evidence are confined to [the assigned art evidence directory](../../qa-artifacts/final-design/r1/art/). No application edit, build, publication or PR was performed. Capture completed without page errors.
- This is a bounded art review under the approved local workflow. Stagehand, Browserbase and credentialed services remain omitted. The lifecycle router selected the visual-QA route and allowed live QA; this report does not claim full global certification.

The approved Telescope/Igloo/Exat/Stripe Press principles in the brief and DESIGN.md are the reference basis: object continuity, deliberate overview-to-detail changes, display/reading contrast, believable matte stock and restrained interface. They are applied to Handrail's logo, palette and actual proposal rather than treated as a request to imitate another brand. External reference websites were not independently re-audited in this pass. A reference-URL search incidentally returned historical reference-observation rows; no prior candidate findings, scores or recommended fixes, and no peer reports, were used in this judgment.

## Scoring

| Criterion | Score | Reason and exact deduction |
| --- | ---: | --- |
| Identity and distinction | 20/20 | Official Handrail wordmark remains proportionate; cream/rust/ink is consistent through the packet, spread and reading view. The rust collections panel provides a specific commercial accent. No generic card grid or ornamental effect competes with the printed object. No deduction. |
| Paper/edge/crease realism | 20/20 | Fine quiet grain becomes apparent at close range without becoming a large repeating pattern. Thin stock edges and localized crease shading preserve a matte-paper reading. The fully opened and partially folded object remain visually coherent. No actionable material defect observed in the sampled orientations; no deduction. |
| Light and shadow coherence | 20/20 | Front/back tone changes and soft displaced ground shadows communicate orientation and separation. No glossy streak, fixed dark halo, bloom or unrelated decorative light was observed. The crease stays restrained next to the rust panel. No deduction. |
| Composition and visual hierarchy | 16/20 | Strong headline, numerical hierarchy and asymmetric spread. **−3 ART-01:** full-contrast neighboring fragments compete at settled reading poses. **−1 ART-03:** the window endpoint has an excessively top-heavy stage. These are composition deductions, not claims that primary reading text is missing. |
| Finish across viewport sizes | 18/20 | The folded object remains complete and clean at both phone heights; cash-flow and cover groups keep a coherent hierarchy. **−2 ART-02:** the final window paragraph almost touches the physical paper edge on both phone sizes, weakening the printed finish. |
| **Total** | **94/100** | **6 points deducted; no uncertainty penalty or unsupported device certification included.** |

## Findings

### ART-01 — P2 — Neighboring print competes with settled reading compositions

**Observed:** In the phone Hire first endpoint, the large “90 days to begin” heading is visible beneath the rate group while a sliver of Client first text is clipped at the right edge. Client first leaves a cropped “...s to begin.” fragment at the lower left. The short-phone Hire first frame exposes a wider full-contrast slice of the adjacent rate column. Desktop cover and cash-flow endpoints likewise keep sizeable partial neighboring paragraphs/rates visible at the screen edges.

**Impact:** The reader is asked to focus on one complete idea, but oversized incomplete words and another heading pull attention sideways and downward. This reads as a crop through a large canvas rather than a deliberately composed print detail. Some peripheral geometry is valuable; the defect is its high-contrast printed content and incomplete wording, not the existence of neighboring paper.

**Evidence:** [phone Hire first](../../qa-artifacts/final-design/r1/art/phone-read-3.png), [phone Client first](../../qa-artifacts/final-design/r1/art/phone-read-4.png), [short-phone Hire first](../../qa-artifacts/final-design/r1/art/short-phone-read-3.png), [desktop beginning](../../qa-artifacts/final-design/r1/art/desktop-read-1.png), [desktop cash flow](../../qa-artifacts/final-design/r1/art/desktop-read-2.png). These are settled endpoints after 1,250ms, not incidental transition crops.

**Bounded correction:** Adjust authored inter-group gutters and the endpoint framing so the adjacent sheet/crease can provide spatial context without intersecting large unrelated text. Prioritize the two mobile rate stops. Retain stable ink, the existing complete groups and local hinge travel; do not solve this with time-dependent dimming or hiding essential content.

**Recheck:** Inspect complete original viewport frames at the three reviewed sizes plus 320×740. At every settled stop, the active idea must fit with its qualifications, and any peripheral heading must be either complete and visibly subordinate or beyond the frame. Re-run reading-group/safe-area checks after the framing change. Confidence: high in observation; medium-high in aesthetic severity.

### ART-02 — P2 — Phone window text nearly reaches the physical cut edge

**Observed:** The final line of “No client and no hire by day 90: the hiring commitment ends.” sits only about **1.75 CSS px above the actual panel bottom**, at both 390×844 and 390×664. It is not clipped by the browser controls; the paper itself ends immediately below the type.

**Impact:** The bottom of the proposal looks insufficiently trimmed/padded, inconsistent with the generous inset and quiet stock elsewhere. This is especially visible because a large empty ground area follows the abrupt edge.

**Evidence:** [phone window](../../qa-artifacts/final-design/r1/art/phone-read-5.png), [short-phone window](../../qa-artifacts/final-design/r1/art/short-phone-read-5.png), [live edge measurements](../../qa-artifacts/final-design/r1/art/edge-measurement.json). At 844px height: final text Range bottom `428.4274`, panel bottom `430.1737`; at 664px: `428.4203` versus `430.1666`.

**Bounded correction:** Include a deliberate bottom stock margin in the intrinsic right-panel/artboard height calculation, after mobile wrapping and footer visibility are resolved. A margin optically comparable to the section's side inset, or at least a clear line of breathing room, is appropriate. Preserve equal connected panel heights and the existing surface/edge budgets.

**Recheck:** Repeat the live Range-to-panel measurement and original-frame inspection at 390×844, 390×664 and 320×740. Require visible stock below the final line, no clipped content, unchanged complete-group framing, and a passing 64MiB/4096-device-pixel budget. Confidence: high.

### ART-03 — P3 — Window endpoint loses stage balance

**Observed:** At desktop 1440×1000, the window paper ends at approximately y=459; the controls begin near y=924. Almost half the viewport is empty ground below a compact strip of print attached to the header. The phone window has the same pronounced top weighting. The closing is also top-aligned, but its longer body makes the imbalance less severe.

**Impact:** The journey abruptly changes from an immersive, almost full-height printed object to a small upper strip. The pause feels less authored than the opening and main comparison compositions. This is a minor aesthetic weakness, not a lost-content or navigation failure.

**Evidence:** [desktop window](../../qa-artifacts/final-design/r1/art/desktop-read-4.png), [phone window](../../qa-artifacts/final-design/r1/art/phone-read-5.png).

**Bounded correction:** Refine the window endpoint's vertical composition after ART-02: retain its restrained reading scale and start alignment, but provide more air above the idea and a less abrupt bottom-stock termination. Avoid enlarging the paragraph into a macro shot or bringing clipped prior copy back into view.

**Recheck:** Compare the window endpoint with the neighboring rate and closing scenes at desktop and both phone heights. The reader should see a deliberate short print composition with balanced surrounding ground, complete copy and no stray earlier paragraph. An evidence-backed decision to retain the current top weighting is a valid P3 disposition. Confidence: high in observation; medium in preference.

## Evidence commands and limits

Executed successfully:

```text
node qa-artifacts/final-design/r1/art/capture.mjs
node qa-artifacts/final-design/r1/art/measure.mjs
```

[Capture receipt](../../qa-artifacts/final-design/r1/art/capture.json) records viewport/DPR, labels, scroll positions, transforms and the served script. [Capture implementation](../../qa-artifacts/final-design/r1/art/capture.mjs) shows `headless: false` and actual wheel input. Reverse screenshots establish sampled spatial consistency; they are not a frame-delivery or complete motion-performance certification.

Not reviewed here: tablet 768×1024, small phone 320×740, physical iPhone/browser chrome, WebKit, manual VoiceOver, field INP, full keyboard/reflow paths, proposal notes, resume, PDFs or external portfolio. Ordinary-reading top frames confirm consistent identity but are not a full reading-mode usability audit. No score adjustment is made to imply that omitted surfaces passed.

The material direction should be retained. ART-01 and ART-02 need correction or explicit evidence-backed disposition; ART-03 is a bounded polish opportunity. This specialty score does not independently authorize publication.
