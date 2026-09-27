# Curated final-pass remediation

## Baseline and scope

Baseline application `33f64ef`, source checkpoint `a499369`. The independent first team scored copy 94, editorial 91, motion 98, art 94, interaction 90 and rendering 99. Reports preserve their exact deductions; the integration owner does not edit reviewers' scores. The second team receives only the neutral brief and a frozen rendered candidate.

## Corrections in the candidate

1. **COPY-01 / ED-02 — hidden hire-first scope.** Removed mobile ordinary-reading suppression of the canonical future-credit sentence. The new visibility regression failed at 320/390px before the fix and now passes; desktop also passes.
2. **ED-01 / COPY-03 / ART-02 — lower print inset.** Physical height now includes visible flex children, margins, padding and borders. The final printed section retains a deliberate stock margin. New four-viewport edge tests reproduce the old defect and pass the new layout. The high-DPR surface budget remains unchanged.
3. **ED-03 / ED-04 — compact financial typography and orphan.** Shortened redundant comparison copy, retained exact rates/amounts, 12 equal payments, collection-before-commission order and the before-all-costs/illustrative qualification. Adjusted the small-phone table gutter and type, plus the window explanation, to at least 14 effective pixels. All terms remain in canonical notes/PDF. Both small-phone regression sizes pass.
4. **COPY-02 — initial contribution.** The cover now names new business as the starting point, with room for the relationship to develop. Client-first text is shorter while preserving the qualifying-client condition and future credited sales.
5. **ART-01 / ART-03 — composition.** Kept the original 38-degree reading fold after experimental higher folds increased noise or occluded content. The desktop cover has more deliberate framing and separation from the closing section. Mobile rate columns have independent intrinsic heights, slight horizontal offsets and bounded vertical framing. The window has more air above and below its complete text. Ink remains stable throughout travel.
6. **R1-INT-01 / R1-INT-02 — text settings.** Added an event-driven typography contract. User changes to font size, line/letter/word spacing or paragraph spacing select the complete ordinary document, preserve semantic position/focus and keep user CSS intact. Tour entry remains disabled while incompatible; removing overrides restores the option. Ordinary headings allow emergency wrapping. Before/after-startup and independent metric changes pass.
7. **R1-INT-03 / R1-INT-04 — phone navigation.** Replaced anonymous dots with named scrollable chapter buttons, retaining 44px targets and keyboard operation. Added direct proposal-notes access beside compact resume/GitHub links. Accessible portfolio names remain stable.
8. **R1-INT-05 — return intent.** History stores the semantic reading group as well as scroll. Browser Back and tour re-entry restore the closing group; subsequent deliberate reading gestures supersede it.
9. **Motion refinement.** Only longer chapter jumps gain a restrained 1.1-second maximum. Native scroll, settling interruption and reversal behavior are unchanged.
10. **R1-REN-01 — progress indicator.** The marker uses a fixed height and transform scale rather than animated height.

## Evidence-backed disposition

**COPY-04 — PDF section 7 spacing:** not sustained. The editorial reviewer, an additional independent document inspection and root's regenerated-PDF inspection found a distinct readable heading. Baseline measured gaps were 8.970pt before sections 5/6 and 9.720pt before section 7. No gratuitous PDF typography change; canonical copy was regenerated and both final pages inspected.

## Verification and limits

The implementation adds behavior regressions for scope, physical stock margin, effective supporting type, named phone navigation, typography overrides/recovery and semantic history. Typecheck, unit checks, complete-group framing, opening reveal and unchanged high-DPR budget pass. Document content parity is verified. Full browser and WebKit results are recorded in the closeout once finished.

Independent reviews and local emulation are bounded evidence. Physical iPhone, manual VoiceOver and field performance remain untested. No credentialed Stagehand/Browserbase or universal design certification is claimed.

## Round 2 corrections

Fresh independent grades: copy 98, editorial 89, motion 98, art 96, interaction 98, rendering 97. The editorial tablet collision is material; release remains ineligible until corrected and independently reviewed.

- **ED2-01:** ordinary-flyer collection type selectors leaked into the notes component and overrode its intended numeric size. Scope those rules to the proposal sheet, retain the shared responsive table structure, and give tablet article content more room with a 180px sidebar/32px gutter. The 768/820px financial-column regression failed before the correction; 960/1024/1440px were already clear.
- **ED2-02 / art phone composition:** widen each printed mobile rate column from 420 to 440 units, increase supporting type slightly, allow a bounded 0.50 effective print scale, and reduce the downward offset. Height fitting still frames the complete group on short phones. Reduce surplus window/stock space modestly to preserve the declared paper budget.
- **Art desktop window:** move the window framing upward to remove the preceding clipped shared-rate line beneath the header. The complete window and physical lower inset remain required.
- **Copy:** the folded packet names new business; the $500 difference explicitly names commission. All numerical assumptions and qualifications remain canonical.
- **Interaction:** explain disabled reading controls visibly and give resume actions a valid group semantic.
- **Rendering load state:** provide a quiet opening status and an immediate semantic ordinary-reading link while enhancement initializes. Keep automatic timeout recovery.

Minor edge antialiasing and the continuous cover-to-cash bridge remain bounded optical tradeoffs: stable printed ink, real intervening paper and full reading holds take precedence over hiding text during travel. The rendering investigation separately records raster evidence and whether a safe causal correction is supported. No reviewer deduction is removed from its original report.

## Round 3 finding under correction

Fresh editorial assessment is 96/100 but identifies **E3-01, P2**: closing body text at 320 px falls to 12.88 px and its qualification 12.16 px. The passing 12 px framing floor is insufficient for this substantive closing argument. A new three-viewport regression requires 16 effective pixels for closing paragraphs, proposal status and next-step link; all three fail against candidate-v3. Adjust the complete printed group and its spacing, preserving all-line framing and the surface budget. No release on score alone while this finding remains.

The art assessment is 99/100 with **ART-R3-01, P3**: mobile Proposal notes uses an inline override instead of its neighbors' flex alignment, putting text 4.75 px above the shared baseline. Restore equivalent flex alignment, without a positional patch.

## Round 3 corrections in candidate-v4

- E3-01: closing body, status and next step now use a 600-unit measure and 40-unit type, yielding 16.21 px at 320 and 17.2 px at both 390 px heights. Complete groups remain framed. Preserve the 340-unit separation from the cover after root's original-frame check caught a cropped later headline with a smaller gap. Three cover-isolation regressions protect this composition.
- ART-R3-01: the mobile notes link uses the same flex alignment as neighboring links. No top-offset patch.
- I3-01: small ordinary-reading currency values use 26 px type and the collected amount 48 px. User spacing remains intact. Original text-range regression fails for the 320 px ordinary view and passes for notes; both now pass a 12 px inter-column gutter and content-width constraint.
- I3-02: the main skip destination reserves a 114 px scroll margin. Four fresh-tour/ordinary desktop/phone landing regressions fail before the correction and now pass; keyboard still bypasses the header.
- Restoring physical print separation while enlarging the closing requires slightly smaller intrinsic high-density surfaces: paper unit 0.48 px instead of 0.5 px, with camera scale compensation preserving displayed type and layout. The existing 64 MiB/4096 device-pixel budget is unchanged. Fresh material and rendering review is required before release.

Round 3 grades remain copy 100, editorial 96, motion 100, art 99, interaction 97, rendering 98. Its material editorial finding prevented release despite meeting the numeric target. Raster readiness misses and real background-state/physical-device evidence limits remain disclosed in the original reports; no speculative renderer change was made.

## Fresh context after the agent-session limit

The final candidate receives two fresh Codex reviewers for copy/editorial and fresh Claude Companion sessions for the remaining four specialties after Codex rejected additional sessions at its task limit. Each receives the same neutral rubric and no prior grades or findings. CLI sessions use explicit fresh mode; no old reviewer is relabeled as fresh. This changes the reviewer implementation, not the acceptance criteria.


## Round 4 rejection and candidate-v5

Fresh grades100/99/89/87/94 reveal issues the previous panel missed. Original scores remain unchanged. The sixth rendering review of v4 was not commissioned after this five-person team already rejected the candidate; the next fresh panel will include rendering.

- M-R4-01: two-crease closing travel received the same scroll distance as one crease. New desktop/phone behavior tests both fail on v4. v5 allocates additional physical travel time and scroll distance, more on phones to match their longer adjacent leg. Chapter transitions scale with travel distance.
- M-R4-02/04: closing bridge height moves across the printed middle of the object; cover framing is acquired at wide scale before zooming, keeping the headline in frame during approach. Portrait opening uses a stronger diagonal composition while preserving the whole-object constraint.
- F3: view-fixed lighting now casts its approximate ambient footprint in the camera's space, instead of rotating a far offset shadow plane with the folded object. This removes the detached caster footprint without new filters or surfaces.
- F1: paper rules gain enough printed weight to reduce one-times raster dropout; density-related raster limits remain subject to fresh review, not claimed solved by a unit assertion.
- F4/ED-R4-01: proposal PDF gains the official small wordmark and rust status; narrow notes-table rate headers align on shared lines. Resting contents-link underlines make navigation visible.
- INT-R4-01/02/04/05: initial tour includes assistive guidance to complete reading; reduced-motion/text-setting state stays keyboard reachable with an accessible explanation and blocks activation; mobile chapter edges signal horizontal continuation; external links describe new tabs without changing their established names.
- M-R4-05: [native-screen investigation](fixed-chrome-disposition.md) captured26 actual Chrome frames on unchanged v4. Header crops are pixel-identical through both directions. This supports a desktop protocol-capture artifact, while precise Chromium mechanism and physical touch fling remain unverified.

Top-aligned window/closing whitespace remains an authored choice: lowering the groups reveals unrelated text above, while enlarging them further weakens comparative type hierarchy. Both reviewers labeled this preference-adjacent. Fresh reviewers remain free to deduct for it. No previously experienced implementation worker is counted as a fresh v5 reviewer.

### Endpoint verification timing

The longer chapter travel exposed fixed 1100/1400ms sleeps in existing endpoint checks. Independent observation confirmed those samples were taken while native scroll and the camera were still moving: Cash flow was at 1892px at 1400ms and 1980px when settled. The test helper now observes camera/wing transforms and native scroll until stable for 200ms; it retains an 8-second failure timeout. Gesture/interruption timing assertions remain unchanged.

The five failing Chromium checks pass with unchanged thresholds. Settled desktop window margin is 113.41px against the 20px floor; closing body is 16.21px at 320×740 and 17.2px at 390×664/844 against the 16px floor. Height changes retain 1980px throughout. Supplementary WebKit again passes 29 holds; minimum text 14.06px against the unchanged 12px floor. The prior 8.48px sample was transient. Evidence is local `qa-artifacts/final-design/candidate-v5/settled-endpoints/`. No product change was made to conceal a failed assertion.


## Fifth panel corrections under verification

R5 copy: consistent “qualifying client”; explicit proposed hire-on-client commitment in the 90-day summary; plural rate scope; unambiguous before-client timing; “Download proposal notes.” Removed unused cash intro. Retained `DealPath.note` because the standalone component and Storybook actually render it; the review's suggested deletion would remove a supported component state.

R5 editorial: >=16px phone cash/window supporting type; recurring-rate row below the build rate; removed literal middle-dot separator; balanced cover/notes wrapping; larger document type, 22mm print margins, complete illustration on page one and Inter page footers; >=14px resume screen content with a measured watermark reserve. The rate-header rule extends through the mobile notes-table layout after a 390px user-spacing regression reproduced mismatched baselines.

R5 art: stronger camera-projected diffuse shadow footprint; decorative back ink resolves at grazing angles while essential front text remains fully inked; short-phone cover keeps its physical top edge below the header. A transparent-outline experiment produced no visible DPR1 edge improvement, so it was not added. Single-device-pixel edge rasterization remains a minor browser limitation. Start-aligned short scenes preserve complete context and avoid preceding paragraph fragments; the stronger ground shadow supplies visual weight. Blind review will reassess this composition rather than accepting a test-only claim.

R5 motion: consistent single-crease travel, continuous logarithmic cover approach with additional phone travel, longer sine-paced chapter navigation, 180px native-scroll tolerance before automatic completion, and sequential relaxation/folding across the middle plane. Focused v5 failures and isolated-v6 measurements are recorded in ignored `r6-before`, `r6-first` and `r6-second` evidence; final shared-source verification remains required.

R5 interaction: integrated a complete accessible tour transcript while preserving face-culling and mobile paper budgets, a one-visit escape override, section fragments, immediate keyboard chapter visibility, an honest opening indicator and comfortable secondary link targets. Focus centering runs only for keyboard-visible focus; moving the navigation strip during pointer-down was reproduced and corrected. The targeted inclusive and navigation checks pass11/11 and12/12. The duplicated panel-chrome source link is removed; prominent GitHub navigation and resume source links remain.

## Sixth candidate corrections

The partial sixth panel scored commercial copy 93 and editorial 87. All findings were P3, but the numeric gate was not met and four independent motion regressions had already rejected the candidate. The other four reviews were not commissioned on known-failing bytes; a complete fresh six-specialty panel follows integration.

- F4: the notes now state why the additional five points are proposed: bringing the revenue that enables the hire and creates the partnership's starting point. No private finances or new commission terms are introduced. Redundant salary prose in section2 is removed; the cover, shared terms, introduction and section1 retain the explicit no-base structure.
- F5: the download attribute saves `handrail-proposal-notes.pdf`; the stable route and asset URL remain compatible.
- F3: recurring duration remains an explicit open question in the notes. Adding a legal qualification to every flyer rate would obscure the proposed business structure, so the existing disclosure is retained. No indefinite tail is promised.
- ED6-01/02/08: subordinate phone context headings, a larger tablet reading fit, and stronger isolation of the active tablet idea.
- ED6-03: desktop/tablet window steps share intrinsic heading/body rows using [CSS subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Subgrid), documented as cross-browser baseline since2023 and awaiting this project's rendered Chromium/WebKit verification. Phone stacking is retained.
- ED6-04/05/06: keep “before costs” together; align both320px comparison headers; separate the difference, collection rule and qualifier with deliberate paragraph gaps while retaining the16px floor.
- ED6-07: balanced resume contribution title and improved path-description wrapping. Regenerate and inspect both PDFs after integration.
- Motion regression: acquire cover framing at intermediate scale before readable zoom; allocate desktop double-crease distance proportional to its angular travel. Eight unchanged focused checks pass on the isolated fix.

The minor closed/open headline variation is intentional: the closed packet introduces new business, and the unfolded cover invites growth. Both reflect the same proposition. No score was modified to resolve a preference.

### Integration corrections before the seventh panel

The first v7 browser run passed171/175. One tablet scene exposed partial headings from the next reading group, and three short-phone cases revealed a headline's line rectangle extending above its CSS box. The tablet section gap now fully separates the next steps. Camera fitting measures text-line overhang once when building poses, adding no per-frame text measurement. All175checks pass on that geometry with unchanged margins and type-size floors.

Root then reproduced an ink-scope error missed by earlier journey sampling: the reverse-ink alpha declaration was on the shared front/back selector. Setting the decorative variable to .25 also faded the front title to .25. The declaration now belongs exclusively to `.panel-back`. The earlier R5 statement about stable essential front ink described intent, not the defective intermediate build; the new whole-journey regression verifies the corrected behavior. This source-only correction is awaiting the final built verification before the seventh panel.

The release hygiene audit checked all50 changed content/code/document files, extracted both PDFs, verified nine public portfolio destinations and three attributed merged contributions. Canonical Markdown and both PDFs pass; no private company figures, private client identifiers or credential material were found. Unchanged employment and education source evidence was not independently re-audited in this hygiene pass.

## Eighth candidate: current independent verification

Candidate-v8 remains byte-for-byte frozen. Copy 98, editorial 99 and art 98 each pass the numeric category threshold with only P3 observations; remaining specialties are pending. No earlier score is reused for this candidate.

The two editorial reviewers independently identified the same notes-PDF continuation break. It preserves a complete, accurate recurring example but places that paragraph at the top of page two. This is accepted as a minor document-continuity limit for the frozen candidate: the table and its qualifications remain together, the whole document remains two readable pages, and no term is lost. The findings and deductions remain unchanged.

Art identified low-density desktop ink softness. The physical paper uses bounded backing surfaces to preserve the established mobile rendering budget. The precise compositor cause of the remaining DPR1 finish difference is not proven. A broad resolution increase would trade against the prior mobile crash remediation without demonstrated benefit. The visible difference is retained as a P3 limitation; normal reading provides sharp responsive text. No physical-device or flawless-rasterization claim is made.

Current deterministic evidence: 185/185 Chromium; 29/29 unit; 3/3 component; 45-file typecheck without issues; complete canonical Markdown/PDF checks; 29 WebKit reading positions. The supplemental WebKit run passed 109/113 initially. Four new tests failed at wheel-input preconditions, before their product assertions. Sustained two-sample wheel input and explicit completion observation produce 4/4 scoped passes in both engines without changing application bytes or relaxing behavioral bounds. The first revised Chromium attempt captured native position before the second sample completed; that evidence is retained alongside the final explicit-displacement wait. Full hosted verification still follows release acceptance.

All original failures, captures and probes remain under `qa-artifacts/final-design/r8/`. Reported WebKit results combine the 109 unchanged passes with the four scoped rechecks; they are not described as one clean run. The three-category results above do not yet establish release acceptance.

## Eighth-panel local acceptance

All six fresh independent reports are complete: copy 98, editorial 99, art 98, motion 100, interaction 100 and rendering 99. The requested minimum 95 in every category is met, with no unresolved P0–P2 product finding. The two P3 visual/document limits above and the rendering evidence gap for true hidden-tab suspension remain explicit. No speculative source change is made for unavailable lifecycle evidence.

Isolated rendering recorded bounded paper surfaces (phone intrinsic estimate 62.89 MiB; 3180 device-pixel edge), no page errors and no failed requests. Rare compositor partial/checkerboard counters are disclosed in the report; these are not presented as flawless frame delivery or physical-phone proof. Lighthouse scored 99 mobile/100 desktop performance, zero TBT, and 100 in its other three categories. Publication and hosted verification are the remaining release steps.
