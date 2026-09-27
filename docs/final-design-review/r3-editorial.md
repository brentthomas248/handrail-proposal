# Fresh editorial typography and spacing review — candidate v3

Date: 27 September 2026. Category: **Editorial typography and spacing**. Independent review; no app edits, rebuild, commit or publication.

**Score: 96/100. One P2 finding requires correction or an evidence-backed disposition before release.** There is no P0/P1 editorial defect in the inspected evidence. The score is this reviewer's assessment against the brief, not certification.

## Candidate and evidence

Reviewed the frozen local site at `http://127.0.0.1:4321/handrail-proposal/`, ordinary reading, `/agreement/`, `/resume/`, and both linked PDFs. Live response hashes matched the assigned candidate:

- Main HTML: `944085d2bef0a4371beb0c148896c4490117223109c2e70ba6ca16eda6749786`.
- Notes PDF: `d9759900f5a67816fe24a4bea3a7118d8700630755befd04ce0e9726bf23c363`.
- Resume PDF: `c832d6895f0e51c19c52a042a8c202661ae2b8b9d5d0181e0ed771490fe4b649`.
- Notes and resume HTML also matched the candidate manifest; see [identity verification](../../qa-artifacts/final-design/r3/editorial/identity-verified.json).

Used the required project instructions, design brief and approved local workflow. Prior review reports, scores, remediation documents and peer findings were not used. USWDS's [typography guidance](https://designsystem.digital.gov/components/typography/) was checked directly as a reference for effective text size, hierarchy, measure and grouping. Its recommendations inform this assessment; they are not a blanket 16 px rule for every cinematic stage, a WCAG criterion, or a mandate to fill every empty area.

The approved local workflow permits this independent rendered review without credentialed Stagehand/Browserbase services. The lifecycle router selected `product-proof-or-visual-qa`; this report claims the assigned editorial review, not global lifecycle certification. `dev-doctor` passed after giving its login-shell check a normal terminal type; unrelated project-contract warnings remain outside scope.

## Scope and method

Own headed Chromium captures, DPR 1, with fonts loaded and chapter poses settled. The [capture script](../../qa-artifacts/final-design/r3/editorial/capture.mjs) and [focused recheck](../../qa-artifacts/final-design/r3/editorial/focused.mjs) preserve repeatable operations. There are 187 original PNGs, including Poppler renders of all four PDF pages; these were generated independently for this round. Original viewport images, not only full-page reductions, informed the findings.

| Coverage | Evidence |
| --- | --- |
| All tour reading stops and overview | 1440×1000, 390×844, 320×740, 390×664, 768×1024; supplementary 500×844, 600×900, 1024×900 |
| Complete reading, notes and resume routes | Full-page captures at all eight sizes; overlapping original viewport tiles at 1440, 390×844, 320 and 768; detailed complete document inspection at desktop and 390, with targeted small-phone/tablet inspection |
| Intervening responsive widths | 500 and 600 compositions, plus focused 759/760 px breakpoint checks of closing text and both comparison-table layouts |
| Printed documents | Both pages of both PDFs, rendered at 110 dpi and inspected individually |
| Motion sampling | Own forward/reverse wheel captures around opening and approach at desktop and 390; no choreography or performance grade inferred |

Ordinary-flow scroll widths equal viewport widths for all captured route/size combinations. This corroborates, but does not replace, visual inspection. Effective tour sizes below use computed font size multiplied by rendered width/layout width at the facing chapter pose; measurements of tilted peripheral content are not used to grade readability. See [measurements](../../qa-artifacts/final-design/r3/editorial/measurements.json) and [focused measurements](../../qa-artifacts/final-design/r3/editorial/focused-measurements.json).

## Scores

| Criterion | Score | Exact deduction and assessment |
| --- | ---: | --- |
| Type hierarchy | **18/20** | **−2, E3-01:** at 320 px, the closing's substantive paragraphs and notes link fall to about 12.9 px, with the qualification at 12.2 px. Elsewhere, headline/statement/detail distinctions are clear; large figures receive appropriate emphasis. |
| Line measure and rhythm | **20/20** | No actionable deduction. Paragraphs have a stable rag and sufficient leading in normal reading, notes, resume and PDFs. Related headings stay close to their copy. Phone rate descriptions wrap into short columns but remain understandable and grouped with their percentages. |
| Microspacing and wrapping | **20/20** | No actionable deduction. Comparison values remain visibly separated; labels and values retain their association. No collision, clipped glyph, accidental numerical concatenation or harmful isolated word was found in the reviewed reading surfaces. |
| Macro composition and whitespace | **20/20** | No actionable deduction. The top-aligned window/closing scenes keep complete ideas intact. Large open areas are consistent with the printed-object brief. PDF page separation is deliberate and coherent; the lighter first notes page is not itself a defect. |
| Responsive/document consistency | **18/20** | **−2, E3-01:** the 320 px tour reduces supporting copy much further than adjacent rate scenes and the normal reading mode. The web documents and both PDFs otherwise retain consistent hierarchy, grouping and full content. |
| **Total** | **96/100** | **4 points deducted for one underlying issue affecting two criteria.** |

## E3-01 — P2: narrow tour makes substantive supporting copy unnecessarily small

**Observed.** At 320×740, select “Grow together.” The two substantive paragraphs render at approximately **12.88 px** effective size; the proposal qualification at **12.16 px**; the notes link at **12.88 px**. The entire active group ends at y≈392, while controls begin at y=676. It is all present and correctly oriented, but the closing argument reads at caption scale. The 320 px cash-flow explanations are approximately 14.1 px, and the 90-day explanations approximately 14.3 px, while the adjacent rate scenes maintain 17.5–18.5 px. At 390 px, closing body rises only to 15.48 px. These are persistent settled poses, reproduced in a separate fresh context.

**User impact.** On the smallest supported phone composition, the reader must work harder to read the partnership argument and final next step immediately after larger rate copy. The alternative reading mode is clear, but requiring a mode change to obtain comfortable explanatory text weakens the tour's own editorial finish. This is a size/composition issue rather than clipping, lost content or a claim that every small label must be enlarged.

**Evidence.** [320 px settled closing original](../../qa-artifacts/final-design/r3/editorial/320x740-tour-6.png), [fresh-context closing recheck](../../qa-artifacts/final-design/r3/editorial/320x740-closing-recheck.png), [320 px cash flow](../../qa-artifacts/final-design/r3/editorial/320x740-tour-2.png), [320 px window](../../qa-artifacts/final-design/r3/editorial/320x740-tour-5.png), [320 px rate comparator](../../qa-artifacts/final-design/r3/editorial/320x740-tour-3.png), [390 px closing](../../qa-artifacts/final-design/r3/editorial/390x844-tour-6.png), and [measured positions/sizes](../../qa-artifacts/final-design/r3/editorial/focused-measurements.json). The mobile `.flyer-partnership` body/detail settings in `src/styles/global.css` and its fitted artboard width explain the result; computed authored sizes alone conceal the final scale.

**Bounded correction.** Adjust mobile print typography and, if necessary, the narrow-width measure for these complete reading groups so primary explanatory paragraphs and the closing action reach a comfortable effective size at 320 px (approximately 16 px is a reasonable recheck target). Use the available height; preserve the whole idea, existing safe areas and paper budgets. Do not solve this by creating isolated sentence closeups or simply zooming until lines clip. The closing is the priority; confirm the cash/window supporting text at the same width when making the bounded typography adjustment.

**Recheck condition.** Fresh headed originals at 320×740, 390×664 and 390×844 show every line of cash flow, 90-day and closing groups inside the actual header/control region, at a visibly comfortable scale consistent with their rate-scene neighbors. Re-measure facing-pose effective sizes and inspect original pixels. Recheck 759/760 px, both height variants, ordinary reading and existing renderer budgets so enlarging copy does not introduce new clipping, wrapping or growth defects.

## Specific passes and preference boundaries

- Numeric separation is sound. At 320 px, the first-row numeric ink gap is about **34 px in normal reading** and **49 px in notes**; at the 760 px breakpoint it is about **45 px** and **58 px**. Values do not merge into a single string. [320 reading comparison](../../qa-artifacts/final-design/r3/editorial/320x740-read-cash-recheck.png), [320 notes comparison](../../qa-artifacts/final-design/r3/editorial/320x740-notes-cash-recheck.png), [760 reading comparison](../../qa-artifacts/final-design/r3/editorial/760x900-read-cash-recheck.png), [760 notes comparison](../../qa-artifacts/final-design/r3/editorial/760x900-notes-cash-recheck.png).
- The 390 px normal reading sequence maintains distinct paragraph groups and spacious figures without detached terms. The phone resume turns the contribution rows into clear stacked groups; the desktop resume's contribution columns and three proof columns remain separated.
- Both PDFs have two intentional pages. Notes keep the compensation setup on page one and illustration/remaining topics on page two. Resume keeps demonstrated background and proposed contribution on separate sheets. No visible glyph loss, clipped footer, stranded heading or table collision was found. Poppler emitted Type 3 glyph bounding-box warnings while rendering; no corresponding visible defect was found in the four inspected page images.
- The use of Inter with a short italic introduction, the restrained rules, and the faint resume watermark follow the stated identity. Choosing a different typeface, centering short scenes vertically, removing all peripheral paper, or eliminating intentional PDF whitespace would be aesthetic preference, not an evidence-backed defect here.

## Limits

This is desktop Chromium emulation and local PDF rendering, not physical iPhone, Safari/WebKit, printed-paper, screen-reader, field-performance or accessibility certification. DPR-dependent rendering was not graded. Browser-chrome changes, text-spacing overrides, zoom, reduced-motion/no-JS, history and keyboard behavior belong to the separate interaction evidence and were not independently certified here. The public portfolio page and private claims/provenance were outside this specialty. Supplementary widths were sampled, not exhaustively swept. No source or PDF was changed, and no release decision beyond the editorial finding disposition is implied.
