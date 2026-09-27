# R1 — Commercial copy and information grouping

**Independent assessment: 94/100. One P2 finding requires correction or an evidence-backed disposition before release.**

Reviewed 27 September 2026 against the neutral final-review brief. I did not read another review, earlier score, or implementation commentary. No application, build, publication, or public-profile changes were made.

## Candidate and coverage

- Frozen local surface: `http://127.0.0.1:4321/handrail-proposal/`; integration owner supplied application baseline `33f64ef`.
- Observed page title: `A beginning together · A proposal for Handrail`; served script: `index.astro_astro_type_script_index_0_lang.Cq-k_JAy.js`. Receipt: `qa-artifacts/final-design/r1/copy/live-identity.json`.
- Headed installed Playwright Chromium, isolated contexts, DPR 1: desktop 1440×1000, phone 390×844, short phone 390×664. Independently captured and inspected the opening, every settled reading scene, normal reading, notes, and resume. Desktop native wheel input was exercised forward and in reverse, but motion quality is not scored here.
- Both PDFs were downloaded from the live local links, text-extracted, rendered with Poppler, and all four resulting pages visually inspected. Public GitHub profile entry was loaded live in headed Chromium and inspected for attribution and consistency.
- Focused phone ordinary-reading and no-JavaScript checks independently reproduce COPY-01. Evidence lives only under `qa-artifacts/final-design/r1/copy/`.
- Agentic UI lifecycle/QA guidance used with the repository's expressly approved local workflow. Credentialed Stagehand/Browserbase services remain omitted. The PDF skill was used for read-only inspection.

## Five scored criteria

| Criterion | Score | Exact deduction and assessment |
| --- | ---: | --- |
| Immediate proposition | **18/20** | −2, COPY-02: the first readable scene states how Brent is paid before concretely stating what he would initially do. The headline and supporting sentence repeat growth positioning; the direct new-business contribution arrives at the closing scene. The no-base/collected-revenue proposition itself is strong and unmistakable. |
| Compensation precision | **20/20** | No deduction. Visible figures correctly distinguish 15% build/5% recurring from 20%/5%; client first includes the qualifying client and future credited sales. The $10,000 collected-installment comparison, $500 difference, before-costs caveat, conditional $18,000/$24,000 totals, and $100 recurring example are correct. Benefits are requested, not silently included or guaranteed. The separate responsive omission is scored under consistency rather than charged twice here. |
| Concise persuasive language | **20/20** | No separate deduction. The terms use direct language and the notes reserve unresolved details for a short discussion list. The contribution narrative leaves room to grow without inventing a future position. Resume capability statements tie proposed work to prior experience and distinguish scoped contributions from ownership. The opening repetition is already charged under immediate proposition. |
| Hierarchy and related-copy spacing | **18/20** | −1, COPY-03: the phone 90-day ending is pressed against the sheet's bottom rule. −1, COPY-04: notes PDF section 7 has materially less preceding separation than other section headings. The rate labels, rationale, recurring component and shared terms otherwise form complete readable groups at the tested viewports. |
| Proposal/resume/notes consistency | **18/20** | −2, COPY-01: phone ordinary reading and no-JS hide hire-first's future-credited-sales qualification while showing it in the tour and desktop reading. No contradictory rate, graduation year, proposal status, or contribution claim was found across the other reviewed surfaces. |
| **Total** | **94/100** | No P0 or P1 found. One P2; three P3 refinements. This is a specialist design assessment, not release certification. |

## Findings

### COPY-01 — P2 material — Phone fallback removes hire-first sales scope

**Observed:** At 390×844, switch to “Read normally” and scroll to “Two ways to begin.” Hire first ends immediately after “Bring me on before I land the qualifying client.” Its sentence “The selected rate covers all my future credited sales” disappears. Client first still explicitly says its rate applies to that client and future credited sales. The same omission occurs with JavaScript disabled. Desktop ordinary reading and phone tour show the hire-first scope.

**User impact:** The fallback changes the commercial comparison. A reader can reasonably infer that the continuing-sales scope is a special benefit of the 20% path, or that the 15% path's account scope has been left undefined. A visual mode must not remove a compensation qualification.

**Evidence:** `phone-reading-rates.png`, `phone-nojs-rates.png`, `phone-reading-scope.json`, `phone-nojs-scope.json`, `phone-reading.txt`, `desktop-reading.txt`, and `phone-scene-3.png`. Both focused JSON receipts report `display: none` and a zero rectangle for the sentence. The matching rule is `src/styles/global.css:1386`; the content is mounted at `src/pages/index.astro:90`.

**Bounded correction:** Retain the hire-first scope in mobile ordinary reading, including no-JS. Prefer removing the presentation-specific hiding rule; do not invent another legal qualification or duplicate the text elsewhere.

**Recheck:** At 390×844 and 390×664, with JS enabled and disabled, read both rate groups in normal flow. Each must visibly preserve its credited-sales scope, build/recurring amounts, and shared benefits/no-base terms. Confirm desktop and tour still show one appropriate copy of each qualification. Add a targeted visible-content assertion so a future responsive rule cannot silently remove it.

**Confidence:** High; rendered, computed-style, no-JS and source evidence agree.

### COPY-02 — P3 minor — Opening gives the economic mechanism before the contribution

**Observed:** The opening reading face says “A proposal for working together,” “Let’s grow Handrail,” “No base salary. Commission follows collected revenue,” and “A partnership built around Handrail’s growth.” None says what Brent would initially contribute. “I would start with new business, working with your team on discovery, scoping and pricing” appears in the final contribution scene.

**User impact:** An executive can identify a compensation proposal immediately, but must continue to reconstruct the practical offer. The final opening sentence spends scarce attention restating the headline instead of answering that first question.

**Evidence:** `desktop-scene-1.png`, `phone-scene-1.png`, `short-phone-scene-1.png`, contrasted with `phone-scene-6.png` and `desktop-reading.txt`. The repeated supporting line is `src/content/proposal.ts:19`.

**Bounded correction:** Replace the generic cover description with a short supported contribution sentence, for example “I would start with new business, with room for my contribution to grow.” Keep the existing headline, no-base/collections statement, closing detail, and the open-ended relationship. This is an editorial recommendation, not a factual inconsistency.

**Recheck:** A reader shown only the first reading scene can state who is proposing what initial work and how the initial compensation works. Refit and inspect all three tested viewports after the copy length changes.

**Confidence:** High observation; medium editorial judgment.

### COPY-03 — P3 minor — Window's last line lacks a bottom reading margin

**Observed:** On both phone heights, “the hiring commitment ends” sits immediately above the horizontal bottom edge of the paper. The three-step group is complete, but the last paragraph is visually pressed against the edge while a large empty stage remains below.

**User impact:** The most consequential condition in the 90-day scene appears close to being cut off and has less breathing room than the preceding steps. This weakens the sense that the three steps form an intentionally finished group; it is not an observed loss of words.

**Evidence:** `phone-scene-5.png` and `short-phone-scene-5.png`; desktop `desktop-scene-4.png` provides a comparison. The image shows roughly a few screen pixels between the last ink and the paper edge.

**Bounded correction:** Give the 90-day group a modest bottom inset on the intrinsic paper and remeasure the scene. Preserve the current restrained scale and three-step grouping; do not enlarge the paragraph to consume the empty stage.

**Recheck:** At 390×844 and 390×664, verify a clear paper margin after the final line, all three steps within the safe area, and no new clipping in neighboring rate or closing scenes.

**Confidence:** High observation; medium polish judgment.

### COPY-04 — P3 minor — Notes PDF compresses the transition into the discussion list

**Observed:** On notes PDF page 2, “7. For our next conversation” follows the last line of section 6 with approximately ordinary line spacing, while headings 5 and 6 have visibly stronger separation from the preceding paragraph. Section 7 is distinguishable by weight and numbering, but its grouping is noticeably tighter.

**User impact:** The open-items list is the decision-support endpoint of the document. The close transition makes it read as attached to the benefits/travel paragraph rather than as the distinct next-conversation section.

**Evidence:** `proposal-pdf-2.png` and `proposal-pdf.txt`. The downloaded original is `proposal.pdf`. Full page inspection found no clipped terms; this deduction concerns grouping, not missing content. The PDF has two pages, with substantially more unused space on page 1.

**Bounded correction:** Restore a consistent inter-section gap before section 7. Adjust print layout or pagination only as needed to preserve the complete endnote and two-page readability; do not shorten or drop the open items to make room.

**Recheck:** Re-render and inspect both complete PDF pages. Section 7 must read as a new section with a gap comparable to headings 5 and 6, and the endnote/footer must remain intact. Recheck complete PDF text against canonical content.

**Confidence:** High observation; medium polish judgment.

## Positive checks and limits

- The client-first statement explicitly includes the triggering client and future credited sales; the higher rate is not represented as applying only to the first deal.
- The $120,000/12-installment assumption is visible with the $10,000 example. “Handrail remaining before costs” is reinforced by delivery/benefits/other-cost language. Neither the table nor notes calls it profit or a forecast.
- The 90-day sequence allows hire first or client first and says the hiring commitment ends if neither happens. Notes preserve the unresolved qualifying-client criteria and in-progress-deal treatment instead of inventing them.
- Proposal status is clear in the notes, PDF, tour cover and closing. The final agreement is assigned to Handrail. There is no signature or assertion that terms have already been accepted.
- Resume web/PDF retain B.S. 2025, distinguish graduate coursework from a degree, and label proposed responsibilities “How I could contribute.” The public profile explicitly describes outside repository work as scoped contributions. No commercial inconsistency with that profile was found; underlying employment records and every linked PR were not independently audited.
- Original tour captures and all four PDF page images were inspected, not just text or a contact sheet. Poppler emitted Type 3 glyph bounding-box warnings; no corresponding visible text loss was found in the rendered pages.
- Small 320×740 and tablet 768×1024 were not captured in this specialty pass. Physical iPhone, WebKit, manual assistive technology, text-spacing overrides, browser zoom and measured motion/performance are untested here. No claim of those forms of certification is made. Reduced-motion was not separately exercised; ordinary reading and no-JS provide only the stated fallback evidence.
