# Round 5 independent review: commercial copy and information grouping

Reviewer: fresh independent design specialist (copy and information grouping). Reviewed 27 September 2026 without reading earlier reports, scores, remediation notes or IMPLEMENTATION.md.

## Candidate identity

Frozen candidate served at `http://127.0.0.1:4321/handrail-proposal/`. All served hashes were verified against `qa-artifacts/final-design/candidate-v5/identity.json` at the start and again at the end of the review, and were unchanged:

| File | SHA-256 |
| --- | --- |
| `index.html` | `d6b4ceb93590828d53a4b5c757b0f54db73a9ed29338c0879f6654405c9726e5` |
| `agreement/index.html` | `1881818c1dc31bd916d6f17f57ffc81bd74b9383d0aedabbe7144350418f9999` |
| `resume/index.html` | `4ac85866c9214732e6cafd1b2ce5ba98eb7a4503972cbcbd77ac9315c1e4b308` |
| `handrail-proposed-agreement.pdf` | `223d9b61eacacc2fa53b31f8c7969e6fcb7c1c183894720bbd79bab8a8d2cf55` |
| `brent-showalter-handrail-resume.pdf` | `c832d6895f0e51c19c52a042a8c202661ae2b8b9d5d0181e0ed771490fe4b649` |

## Scope and method

- Headed Chromium via installed `@playwright/test` 1.63.0, isolated contexts, script at `qa-artifacts/final-design/r5/copy/evidence/capture-copy.mjs`.
- Tour reading poses reached through the chapter controls at 1440×1000, 390×844, 320×740, 390×664 and 768×1024 (five desktop/tablet scenes, six phone scenes, plus overview). Every pose was screenshotted and a line-level analysis recorded whether each text line of the active reading group sat inside the measured header/control safe area (`capture-log.json`).
- Native forward wheel scrolling: 14 frames at 390×844 and 10 at 1440×1000; 6 reverse frames at 390×844 (`evidence/scroll/`).
- Ordinary reading (`?view=read`) at 1440, 390 and 320; `/agreement/` at 1440, 390 and 320; `/resume/` at 1440 and 390, all full page, plus DOM text extracts (`evidence/docs/`, `evidence/crops/`).
- Both PDFs downloaded from the candidate, text extracted with `pdftotext -layout`, pages rasterised (`evidence/pdf/`).
- Repo-declared read-only checks run: `pnpm pdf:check`, `pnpm resume:check`, `pnpm contract:check` (all pass). A parity script compared the canonical strings in `src/content/proposal.ts` against the live read-mode and notes DOM text.
- Original screenshots were inspected individually, not through contact sheets.

Arithmetic in the illustration was recomputed independently: $120,000 / 12 = $10,000; 15 % = $1,500 and 20 % = $2,000; remainders $8,500 and $8,000; per-installment difference $500; twelve-installment totals $18,000 and $24,000, difference $6,000; 5 % of $2,000 = $100. The resume forecasting claim also checks out: (18.60 − 14.12) / 18.60 = 24.1 %.

## Scores

| Criterion | Score /20 | Reason |
| --- | --- | --- |
| Immediate proposition | 19 | The cover states the offer in four lines at every viewport: a proposal for working together, "Let's grow Handrail.", "No base salary. Commission follows collected revenue.", "Begin with new business. Build the relationship from there." Nothing essential is deferred to a decorative back. Negligible residual: the reader has to reach scene two to learn why "collected" matters to Handrail (customer pays first); that is a reasonable pacing choice, not a defect. |
| Compensation precision | 17 | Rates, bases ("of collected build fees", "of collected recurring fees"), the all-future-credited-sales scope, the requested benefits, the 90-day limit and the before-costs qualifier are all stated and consistent. Deductions: COPY-1 (qualifying vs paying client), COPY-3 ("earlier" without a referent), COPY-6 ("This rate" after two rates). All are correctable wording. |
| Concise persuasive language | 18 | "Collect first. Pay commission second." and "Handrail keeps, before costs" carry the cash-flow argument honestly and briefly. The client-first premium is explained as the reward for enabling the hire, not as a demand. Deduction: COPY-2, the window scene says the hiring commitment "ends" before the flyer has ever named that commitment. |
| Hierarchy and related-copy spacing | 19 | At all 33 captured poses every line of the active group sat inside the safe area (0 lines outside, minimum rendered size 14.4 px at 390 and 320 phone cover eyebrow, 16.8 px in the phone rate scenes). Each phone rate scene keeps its own "Two ways to begin" context, rate pair, rationale and the shared no-salary/benefits line under a rule. The illustration keeps assumption, collected amount, table, difference, rule and qualifier together on one rust panel at every width, including 320. Residual: on 1440 the two-paths pose lets the top of the "90" glyph peek above the controls; that is peripheral context outside the active group and is acceptable under the brief. |
| Proposal / resume / notes consistency | 18 | Canonical checks pass; live DOM text matches the typed source string for string; Markdown, HTML and both PDFs carry identical numbers and section order; the resume's "could contribute" framing and closing sentence match the flyer's "room to grow" story and never claim Handrail employment. Deductions: COPY-4 (three different names for one PDF on the notes page) and COPY-5 (two canonical strings that no surface renders). |

**Total: 91 / 100.**

No P0, P1 or P2 defects were found. All findings are P3 and do not, on their own, make the release ineligible from this specialty's perspective.

## Findings

### COPY-1 · P3 · "paying client" and "qualifying client" name the same trigger

- Impact: the notes list "Qualifying-client criteria" as an open point, and sections 2, 3 and 5 use "qualifying client" throughout. The flyer's client-first path says "I bring the paying client that enables the hire." and window step 2 says "or I can bring the paying client first." directly under step 1's "Define the structure and qualifying client together." A Handrail reader can reasonably ask whether any paying client triggers the 20 % path or only the agreed qualifying client.
- Evidence: `evidence/tour/390x844-04-client-first.png`, `evidence/tour/390x844-05-the-window.png`, `evidence/tour/1440x1000-04-the-window.png`, `evidence/docs/read-text.txt`, `evidence/agreement-pdf.txt` lines 16–25 and 47–51. Source: `src/content/proposal.ts:52`, `src/pages/index.astro:130`.
- Bounded fix: use "qualifying client" in both flyer sentences (for example "I bring the qualifying client that enables the hire." and "or I can bring the qualifying client first."), or keep "paying" once and define it as the qualifying client. Regenerate Markdown and PDF only if the notes are touched (they are already consistent).
- Recheck: grep the canonical source and rendered read-mode text for "paying client"; confirm the phone client-first and window scenes still fit their safe areas after the longer word.

### COPY-2 · P3 · The window scene ends a commitment the flyer never names

- Impact: step 3 reads "No client and no hire by day 90: the hiring commitment ends." Nothing earlier on the flyer states that Handrail's side of the proposal is to bring Brent on when the qualifying client arrives; the closest is "enables the hire" in the client-first path. The notes carry it ("Handrail can walk away without an obligation to hire", section 3's "Handrail brings me on at 20 %"), so the meaning is recoverable one tap away, but the flyer sentence lands as a reference to something unstated.
- Evidence: `evidence/tour/390x844-05-the-window.png`, `evidence/tour/1440x1000-04-the-window.png`, `evidence/docs/read-1440.png`.
- Bounded fix: let step 1 or 2 state the proposed commitment in the same words as notes section 3, for example step 2 "Handrail can hire first, or bring me on at the client-first rate when I bring the qualifying client." Do not add deadlines or obligations that are not already in the notes.
- Recheck: the three window steps still form one reading group at 390×844, 390×664 and 320×740 with no line outside the safe area.

### COPY-3 · P3 · "Handrail can bring me on earlier" has no referent

- Impact: notes section 5 says "Handrail can bring me on earlier at the hire-first rate." Earlier than what is left to inference (before the qualifying client, or before the window closes). Section 2 already has the precise phrasing "before I originate the qualifying client".
- Evidence: `evidence/pdf/agreement-2.png`, `evidence/agreement-pdf.txt` lines 47–49, `evidence/crops/notes-390-c.png`.
- Bounded fix: "Handrail can bring me on before that client arrives, at the hire-first rate." Regenerate Markdown and PDF and rerun `pnpm contract:check` and `pnpm pdf:check`.
- Recheck: both checks pass and the section still fits page 2 of the PDF.

### COPY-4 · P3 · One PDF, three labels on the notes page

- Impact: the notes page header is "Proposal notes", the button reads "Download proposal", and the file is `handrail-proposed-agreement.pdf` whose first page is again titled "Proposal notes" and footed "For discussion". A recipient forwarding the file sees "proposed agreement" in the name and "notes" inside. The stable filename is an accepted prior decision (`docs/local-workflow.md`), so only the button label is in scope here.
- Evidence: `evidence/docs/notes-1440.png`, `evidence/crops/notes-390-a.png`, `evidence/pdf/agreement-1.png`.
- Bounded fix: label the button "Download the notes (PDF)" or "Download proposal notes" so the button, page title and PDF title agree.
- Recheck: notes page at 390 and 1440 shows the new label without wrapping the button onto two lines.

### COPY-5 · P3 · Canonical source carries copy that nothing renders

- Impact: not user-visible. `flyerCopy.cash.intro` ("No base salary. Customer money arrives before commission.") and both `dealPathCopy.*.note` strings exist in the typed source but the flyer passes `showScope={false}` and never places the cash intro, so they appear on no surface. A future edit to those strings would look live and would not be. The parity script reported them as MISS in read-mode text.
- Evidence: `evidence/docs/read-text.txt` versus `src/content/proposal.ts:23`, `:48`, `:53`; `src/pages/index.astro:97`, `:103`.
- Bounded fix: either render the cash intro under the collections headline (it strengthens the cash-flow argument and is already approved copy) or delete the three unused strings.
- Recheck: parity script shows every remaining canonical flyer string present in read-mode text; `pnpm check` passes.

### COPY-6 · P3 · "This rate covers all my future credited sales." follows two rates

- Impact: in the hire-first group the sentence sits under the 15 % and +5 % pair, so "this rate" is singular after two figures. The client-first counterpart avoids the problem by naming the rate ("That start earns 20 % on this client…"). The notes are precise ("15 % of collected build fees and 5 % of collected recurring fees on my credited sales").
- Evidence: `evidence/tour/390x844-03-hire-first.png`, `evidence/tour/1440x1000-03-the-two-paths.png`.
- Bounded fix: "These rates cover all my future credited sales." or "15 % and 5 % on all my future credited sales."
- Recheck: hire-first phone scene at 320×740 still keeps the sentence on two lines inside the safe area.

## Observations that are not defects

- The PDF leaves roughly the lower 40 % of page 1 blank because section 4 is forced to a new page so the table stays with its qualifiers and totals. That is a defensible editorial choice for a two-page document and keeps the illustration unsplit; it is noted for the editorial reviewer, not deducted here.
- "Client first: $500 more commission per installment." reads, from Handrail's chair, as a cost line. It is honest and the notes explain the premium, so it is kept as is.
- Transitional frames during native scrolling show neighbouring panels cropped and foreshortened (for example `evidence/scroll/390-fwd-11.png`); the captions correctly say "Between … and …" and no term is readable only in those frames. Grouping at rest is what this specialty grades.
- The resume distinguishes demonstrated work from proposed Handrail responsibilities ("How I could contribute at Handrail"), keeps the 2025 bachelor's year, presents graduate coursework as coursework, and its closing line agrees with the flyer's "room to grow" story.

## Untested limits

- Chromium only; WebKit and Firefox were not exercised, and no physical iPhone or Android device was used. Device emulation is not device certification.
- No screen-reader, VoiceOver or other assistive-technology run; the accessible table structure was read from the source, not heard.
- Reduced-motion and no-JavaScript reading paths were not separately captured; ordinary reading was reached through `?view=read`, which renders the same document flow.
- The hosted GitHub Pages copy was not checked; only the local frozen candidate was reviewed.
- Storybook and the DealPath component states were not inspected.
- Intermediate scroll frames were sampled at fixed intervals, not recorded as video.

## Evidence locations

- Report: `docs/final-design-review/r5-copy.md`
- Capture script and log: `qa-artifacts/final-design/r5/copy/evidence/capture-copy.mjs`, `capture-log.json`
- Reading poses: `qa-artifacts/final-design/r5/copy/evidence/tour/`
- Native scroll frames: `qa-artifacts/final-design/r5/copy/evidence/scroll/`
- Reading mode, notes, resume full pages and text: `qa-artifacts/final-design/r5/copy/evidence/docs/`, `crops/`
- PDFs, extracted text and page renders: `qa-artifacts/final-design/r5/copy/evidence/agreement.pdf`, `resume.pdf`, `*-pdf.txt`, `pdf/`

No application files, `dist`, or publication state were modified. The candidate hashes listed above were re-verified after all captures and matched.
