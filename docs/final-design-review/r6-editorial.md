# r6 — Editorial typography and spacing (independent review)

Category: **Editorial typography and spacing** (type hierarchy; line measure and rhythm; microspacing and wrapping; macro composition and whitespace; responsive/document consistency).

Reviewer stance: fresh independent specialist. No earlier reports, scores, progress/remediation notes, peer findings or IMPLEMENTATION.md were read. Score is candid; no target was supplied.

## Candidate identity

Frozen candidate at `http://127.0.0.1:4321/handrail-proposal/`, verified against `qa-artifacts/final-design/candidate-v6/identity.json` before and after the review (all SHA-256 matched both times):

| Route | SHA-256 |
| --- | --- |
| `index.html` | `4bbf53ca026403ff3fdfec570aa056f91990c4840558d842611a4a85fb53197c` |
| `agreement/index.html` | `fc32e8eb880cd1f6624d854ba36ae2900baac992fe6453d83c8f87b4f9eea191` |
| `resume/index.html` | `fdcd1469515ecc557a1d66939fa3c1062c834ff7870347983ebf846ad4e2c604` |
| `handrail-proposed-agreement.pdf` | `0359ca90abb01f66e96943bf33053ac6d026325a68c8168993092ea41f9c890a` |
| `brent-showalter-handrail-resume.pdf` | `7f4c8c37d752048352f8a67726b2cd314c9e8d1b91fee72d6f4ef97ae55d1e13` |
| `handrail-logo.png` | `1e024d51ef5f28a6bcedfa90ff58c5f0481a81db81cbcd5efede50594766bb3a` |

## Scope and method

Own evidence only, produced by `qa-artifacts/final-design/r6/editorial/collect.mjs` (headed Chromium via the neutral `review-tools/browser.mjs` helper; phone/small viewports at 3× device scale, desktop/tablet at 1×).

- **Tour, every chapter, all five core viewports** (1440×1000, 390×844, 320×740, 390×664, 768×1024): screenshot per settled chapter plus a projected text-metrics pass for every text-bearing element in the active reading group (authored px, projected scale, on-screen px, line count, characters per line, line pitch, and whether any line box leaves the measured header/control safe area).
- **Ordinary reading mode, Proposal notes and Resume web** at 1440, 768, 390 and 320: full-page captures, cropped segments, document metrics (measure in characters per line, effective sizes, horizontal overflow).
- **WCAG 2.2 text-spacing resilience** (line-height 1.5, letter 0.12em, word 0.16em, paragraph 2em) in tour, reading and notes at 390 and 1440.
- **Mid-scroll frames**, forward and reverse, between chapters 1→2 at 1440 and 390, to check text stays crisp during reading travel.
- **Both PDFs, every page**, rendered with Poppler at 110 dpi (full pages) and 220 dpi crops (notes table, notes head, resume experience, resume contributions), plus `pdffonts` and layout-preserving text extraction.

Safe-area check result: **no text line of any active reading group left the header/control safe area at any of the five viewports** (0 violations across 6 desktop-class and 7 phone-class scenes per viewport).

## Effective reading sizes (on-screen, settled chapters)

| Group | 1440×1000 | 768×1024 | 390×844 | 390×664 | 320×740 |
| --- | --- | --- | --- | --- | --- |
| Cover description (body) | 23.6 px | 20.7 px | 19.6 px | 19.6 px | 17.5 px |
| Cash panel detail lines | 21.8 px | 18.0 px | 17.1 px | 16.0 px | 16.1 px |
| Rate scope / reason | 19.8 px | **15.6 px** | 17.5 px | 17.4 px | 17.5 px |
| Window step bodies | 19.8 px | **15.6 px** | 17.1 px | 17.1 px | 16.7 px |
| Closing paragraphs | 22.5 px | 21.9 px | 17.1 px | 17.1 px | 16.1 px |

Measures: desktop body 44–66 characters per line; notes body 70 cpl at 18 px/1.65; phone tour 23–33 cpl at 16–19.6 px; resume web 60–75 cpl at 15–17 px. Display sizes (headline 111 px desktop, 55 px phone; rates 95/61 px; $10,000 at 73/35 px) are purposeful specimen scale and are judged separately from body ergonomics.

## Scores

| Criterion | Score | Reasons and exact deductions |
| --- | --- | --- |
| Type hierarchy | **18 / 20** | Cover, cash panel, rates, window and closing carry a clear four-level scale (display → section → body → detail) with Playfair reserved for the single intro line; tabular numerals and weight 500 rules give the money table an unambiguous reading order. −2: on the phone rate scenes the context heading "Two ways to begin" (21 px, weight 500) is *smaller* than its child label "Hire first"/"Client first" (23 px, weight 500, same colour), inverting the section/sub-section relationship on the one scene where the two paths must be told apart (ED6-01). |
| Line measure and rhythm | **17 / 20** | Body measures are within comfortable ranges everywhere; notes at 70 cpl/1.65 and the resume at 60–75 cpl read as proper documents; phone line pitch (24 px on 17 px type) is even. −2: tablet 768×1024 is the smallest effective body size in the matrix (15.4–15.6 px for the rate qualifications, "Both paths" line and the window step bodies), below phone (17.4 px) and desktop (19.8 px) (ED6-02). −1: the three window step bodies at 1440 and 768 do not share a starting baseline because the third heading is one line while the others are two, so the "If neither happens" body sits one line higher than its neighbours (ED6-03). |
| Microspacing and wrapping | **16 / 20** | Rag is generally good; `text-wrap: balance` on the cover statement and `pretty` on the resume paragraphs pay off. −1: the qualifying row label wraps "Handrail keeps, before / costs" on the primary money table at 1440 tour, 768 tour, 768 reading and 768 notes, orphaning the word that carries the qualification (ED6-04). −1: at 320×740 the cash-panel column headers wrap inconsistently, "Hire first 15%" inline but "Client first" with "20%" dropped and indented below it, so the two rate labels no longer align (ED6-05). −1: on the phone cash panel the three closing statements (difference, rule, qualifier) are separated by only 5–6 px on 16–17 px type, roughly 0.3 em, so the qualifier reads as a continuation of the rule rather than as a separate fine-print qualification of the figures (ED6-06). −1: reading mode at 1440 wraps "I bring the qualifying client that enables the / hire." with a one-word orphan and knocks the two columns' follow-up paragraphs out of alignment; the resume headline "How I could contribute at / Handrail" leaves a one-word second line on both web and PDF (ED6-07). |
| Macro composition and whitespace | **18 / 20** | Desktop scenes frame each idea with generous paper around it; the top-aligned window and closing compositions are a deliberate choice that avoids stray fragments above the group and reads as the physical sheet edge; phone scenes keep consistent left margins and breathing room inside the safe area; the reading document and notes have well-proportioned section padding and rules. −2: at 768×1024 the "Two ways to begin" and "The beginning" scenes expose the next group's opening lines cut by the controls (a truncated "No client and no hire by" and a half-clipped "New business"), which is permitted peripheral cropping but is the one place where the frame reads as an accidental crop rather than a composed edge (ED6-08). |
| Responsive / document consistency | **18 / 20** | The same content hierarchy survives across tour, reading mode, notes, resume web and both PDFs; PDF fonts are embedded subsets, page footers and running heads are consistent, and the illustration figures are identical everywhere. Text-spacing overrides degrade gracefully: the tour hands over to reading mode and neither reading mode nor notes clips or overflows. Mid-scroll frames keep text crisp on angled panels in both directions. −1: tablet is the outlier on body ergonomics (ED6-02). −1: the "before / costs" orphan appears on desktop and tablet surfaces but not on phone, so the same table label wraps differently by surface (ED6-04). |
| **Total** | **87 / 100** | |

No P0, P1 or P2 defects were found in this category. Release eligibility is not blocked by editorial typography; the items below are bounded refinements.

## Findings

All severities are P3 (minor). Evidence paths are relative to `qa-artifacts/final-design/r6/editorial/evidence/`.

**ED6-01 — Phone rate scenes invert the heading hierarchy.** P3.
Impact: on "Hire first"/"Client first" the reader sees two near-identical stacked headings; the section context is not visually subordinate to the path label.
Evidence: `tour-390x844/03-hire-first.png`, `tour-390x844/04-client-first.png`, `tour-320x740/03-hire-first.png`; `tour-390x844/metrics.json` (`.rate-context` 21.2 px on screen vs `.deal-path-label` 23.0 px, both weight 500).
Fix (bounded): in the phone tour block, make `.rate-context` clearly secondary, e.g. `color: var(--muted)` and `font-size: calc(34 * var(--paper-unit))` with its existing margin, or raise `.deal-path-label` to `calc(56 * var(--paper-unit))`. Keep the phone scene inside the safe area.
Recheck: at 390×844, 390×664 and 320×740 the context heading is visibly subordinate (smaller and/or muted) and every line of both rate groups stays inside the measured safe area.

**ED6-02 — Tablet body text is the smallest in the matrix.** P3.
Impact: at 768×1024 the rate qualifications, "Both paths" line and window step bodies render at 15.4–15.6 px, below phone and desktop; readable, but the weakest reading ergonomics of the five viewports.
Evidence: `tour-768x1024/03-the-two-paths.png`, `tour-768x1024/04-the-window.png`, `tour-768x1024/metrics.json`.
Fix (bounded): let the tablet camera fit use a smaller horizontal margin for the two-column groups (the panel currently sits at 559 px wide inside 768 px), or apply the phone-style per-path scenes between 760 and 1023 px.
Recheck: measured on-screen size of `.rate-scope`, `.rate-reason`, `.rate-shared` and `.window-steps p` ≥ 16.5 px at 768×1024 with all lines inside the safe area.

**ED6-03 — Window step bodies do not share a baseline.** P3.
Impact: on desktop and tablet the third column's body starts one line above the others because its heading fits on one line; the three-step sequence reads slightly ragged.
Evidence: `tour-1440x1000/04-the-window.png` (bodies at y 363 / 363 / 334), `tour-768x1024/04-the-window.png`, `read-1440x1000/full.png`.
Fix (bounded): `.window-steps li { display: grid; grid-template-rows: subgrid; grid-row: span 2 }` with `.window-steps { grid-template-rows: auto auto }`, or a two-line `min-height` on the step `strong`. Phone uses `display: block` and is unaffected.
Recheck: the three step bodies share the same top y at 1440×1000 and 768×1024; phone stacking unchanged.

**ED6-04 — Money-table row label orphans "costs".** P3.
Impact: "Handrail keeps, before / costs" splits the qualification that stops the retained figure from reading as profit, on the primary collections scene.
Evidence: `tour-1440x1000/02-cash-flow.png`, `tour-768x1024/02-cash-flow.png`, `read-768x1024/full.png`, `notes-768x1024/crop-b.png`; `tour-1440x1000/metrics.json` (`collection-row-label` 2 lines, 14 cpl).
Fix (bounded): `text-wrap: balance` on `.collection-row-label` (yields "Handrail keeps, / before costs"), or a non-breaking space in "before costs" in `src/content/proposal.ts` so the qualification stays together everywhere.
Recheck: the label either fits one line or breaks after "keeps," at 1440 tour, 768 tour, 768 reading and 768 notes; PDF and phone unchanged.

**ED6-05 — 320 px cash-panel column headers wrap inconsistently.** P3.
Impact: "Hire first 15%" stays inline but "Client first" drops "20%" to an indented second line, so the two rate labels no longer align and the rate momentarily detaches from its label.
Evidence: `tour-320x740/02-cash-flow.png`; `tour-320x740/metrics.json` (Client-first `collection-rate` top 321 vs heading 299; Hire-first both 299).
Fix (bounded): in the `@media (max-width: 359px)` tour block set `.collection-rate { display: block; margin-left: 0 }` so both headers use the same two-line form, or reduce the phone `th` size by two paper units.
Recheck: both column headers occupy the same number of lines with aligned rules at 320×740, and the scene remains inside the safe area.

**ED6-06 — Phone cash-panel closing statements run together.** P3.
Impact: difference claim, rule and qualifier are 5–6 px apart on 16–17 px type; the qualifier reads as a continuation of "Collect first. Pay commission second." rather than as fine print about the figures.
Evidence: `tour-390x844/02-cash-flow.png`, `tour-390x664/02-cash-flow.png`, `tour-320x740/02-cash-flow.png`; `tour-390x844/metrics.json` (rows at y 537–579, 585–627, 632–674).
Fix (bounded): raise the phone-tour `margin-top` of `.collection-rule` and `.collection-qualifier` to about `calc(22 * var(--paper-unit))`. The measured spare space below the qualifier is 106 px at 390×844, 46 px at 320×740 and 31 px at 390×664, so roughly 20 px of added spacing fits all three.
Recheck: paragraph gaps ≥ 0.6 em on the phone cash scene and the qualifier's last line stays above the controls at 390×664 and 320×740.

**ED6-07 — Orphans in reading mode and the resume headline.** P3.
Impact: reading mode at 1440 leaves "hire." alone on a line and misaligns the two path columns' follow-up paragraphs; the resume page-two headline ends with a one-word line ("Handrail") on web and PDF.
Evidence: `read-1440x1000/full.png`; `resume-1440x1000/full.png`; `../pdf/resume-2.png`.
Fix (bounded): `text-wrap: pretty` on `.deal-description` in reading mode; `text-wrap: balance` on `#contribution-title` (print and screen).
Recheck: no one-word final line in those two elements at 1440 and 768, and the resume PDF page 2 headline breaks as "How I could / contribute at Handrail" or fits on two balanced lines.

**ED6-08 — Tablet peripheral fragments read as accidental crops.** P3 (observation; permitted by DESIGN.md).
Impact: at 768×1024 the next group's first lines show beneath the active group and are cut by the controls ("No client and no hire by"; half of "New business").
Evidence: `tour-768x1024/03-the-two-paths.png`, `tour-768x1024/01-the-beginning.png`.
Fix (bounded): the same camera-fit adjustment as ED6-02 removes most of the exposed area; otherwise no change required.
Recheck: after ED6-02, no truncated sentence from the following group is visible above the controls at 768×1024.

## What passed without deduction

- Every reading-group text line stayed inside the measured header/control safe area at all five viewports, including the short 390×664 and small 320×740 phones.
- Reading mode, notes and resume web show no horizontal overflow at 320, 390, 768 or 1440.
- Text-spacing overrides: tour falls back to reading mode by design; reading mode and notes reflow with zero clipped elements at 390 and 1440.
- Text remains sharp during forward and reverse reading travel (mid-scroll frames at 1440 and 390).
- Notes PDF (A4, 2 pages) and resume PDF (Letter, 2 pages): embedded Inter subsets, consistent running heads/footers, aligned table columns, no widowed headings across page breaks, endnote and page numbers present.

## Untested limits

- Device emulation only; no physical iPhone, iPad or Android rendering, and no manual assistive-technology reading was performed or inferred.
- Chromium only for the tour; WebKit backface capture limitations documented elsewhere were not exercised here.
- Text-spacing was tested as a CSS injection, not via a user stylesheet or browser extension.
- Idle-settle, rapid-flick and resize choreography are outside this specialty and were not re-measured.

## Paths

- Report: `docs/final-design-review/r6-editorial.md`
- Collector: `qa-artifacts/final-design/r6/editorial/collect.mjs`
- Evidence: `qa-artifacts/final-design/r6/editorial/evidence/` (per-viewport `tour-*/`, `read-*/`, `notes-*/`, `resume-*/`, `textspacing-*/`, `midscroll-*/` with `metrics.json`, `errors.json` and screenshots; `summary.json` with hashes)
- PDF renders and crops: `qa-artifacts/final-design/r6/editorial/pdf/`

Candidate unchanged at end of review: all six hashes above re-verified after evidence collection. Browser processes launched by this review were closed by the collector; the only Chromium processes still present belong to a different workspace and were left untouched.
